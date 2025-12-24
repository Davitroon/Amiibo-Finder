import { useState, useEffect, useRef } from "react";
import { useAmiibo } from "../context/AmiiboContext";
import {
	IoPerson,
	IoCloudUpload,
	IoCloudDownload,
	IoTrash,
} from "react-icons/io5";
import DeleteCollectionModal from "./DeleteModal";
import { useToast } from "../context/ToastContext";

const UserMenu = () => {
	// Solo este componente necesita acceder a los datos de los Amiibos
	const { userAmiibos, importData, clearStorage } = useAmiibo();
	const { showToast } = useToast();

	// Estados
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	// Referencia para el input oculto
	const fileInputRef = useRef<HTMLInputElement>(null);
	const menuButtonRef = useRef<HTMLButtonElement>(null);

	// Cerrar menú al hacer clic fuera
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isMenuOpen) {
				setIsMenuOpen(false);
				menuButtonRef.current?.focus(); // Devolver foco al botón al cerrar
			}
		};

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target.closest(".user-menu-container")) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown); // Escuchar teclado
	}, [isMenuOpen]);

	// --- FUNCIONES DE LÓGICA (Movidas desde Header) ---

	const handleExport = () => {
		if (userAmiibos.length === 0) {
			showToast("⚠️ No data to export!");
			return;
		}
		const dataStr = JSON.stringify(userAmiibos, null, 2);
		const blob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = `amiibo-collection-${new Date()
			.toISOString()
			.slice(0, 10)}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		showToast("✅ Collection exported successfully!");
		setIsMenuOpen(false);
	};

	const triggerImport = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			try {
				const json = JSON.parse(event.target?.result as string);
				if (Array.isArray(json)) {
					importData(json);
					showToast("✅ Collection imported successfully!");
				} else {
					showToast("❌ Invalid file format.");
				}
			} catch (error) {
				console.error(error);
				showToast("❌ Error reading file.");
			}
		};
		reader.readAsText(file);
		setIsMenuOpen(false);
		e.target.value = "";
	};

	const handleConfirmDelete = () => {
		clearStorage();
		setShowDeleteConfirm(false);
		setIsMenuOpen(false); // Cerramos menú también
		showToast("🗑️ Collection deleted.");
		// Importante: Devolver foco al botón principal tras la acción
		menuButtonRef.current?.focus();
	};

	// Cuando el modal de borrar se cierra (por Cancelar), queremos que el foco
	// vuelva al menú si sigue abierto, o al botón principal si se cerró.
	useEffect(() => {
		if (!showDeleteConfirm && isMenuOpen) {
			// Opcional: devolver foco a un elemento dentro del menú
		} else if (!showDeleteConfirm && !isMenuOpen) {
			// Si todo se cerró, foco al botón principal
			menuButtonRef.current?.focus();
		}
	}, [showDeleteConfirm, isMenuOpen]);

	return (
		<div className="user-menu-container">
			<button
				ref={menuButtonRef}
				className={`icon-btn ${isMenuOpen ? "active" : ""}`}
				onClick={() => setIsMenuOpen(!isMenuOpen)}
				// --- ACCESIBILIDAD ---
				aria-label="User data options menu" // Etiqueta para lector de pantalla
				title="User data options" // Tooltip visual
				aria-haspopup="true" // Indica que abre un menú
				aria-expanded={isMenuOpen} // Dice si está abierto o cerrado
				aria-controls="user-dropdown" // Vincula con el ID del menú
			>
				<IoPerson aria-hidden="true" />{" "}
				{/* Ocultar icono decorativo al lector */}
			</button>

			{/* Menú Desplegable */}
			{isMenuOpen && (
				<div
					id="user-dropdown"
					className="dropdown-menu"
					role="menu" // Semántica de menú
					aria-label="User options"
				>
					<button
						className="dropdown-item"
						onClick={handleExport}
						role="menuitem" // Semántica de ítem
					>
						<IoCloudDownload aria-hidden="true" />
						<span>Export data</span>
					</button>

					<button
						className="dropdown-item"
						onClick={triggerImport}
						role="menuitem"
					>
						<IoCloudUpload aria-hidden="true" />
						<span>Import data</span>
					</button>

					<input
						type="file"
						ref={fileInputRef}
						style={{ display: "none" }}
						accept=".json"
						onChange={handleFileChange}
						aria-hidden="true" // Oculto porque usamos el botón trigger
						tabIndex={-1}
					/>

					<div className="dropdown-divider" role="separator"></div>

					<button
						className="dropdown-item danger"
						onClick={() => {
							setShowDeleteConfirm(true);
							setIsMenuOpen(false); // <--- AÑADIR ESTO
						}}
						role="menuitem"
					>
						<IoTrash aria-hidden="true" />
						<span>Delete Data</span>
					</button>
				</div>
			)}

			{showDeleteConfirm && (
				<DeleteCollectionModal
					setShowDeleteConfirm={setShowDeleteConfirm}
					handleConfirmDelete={handleConfirmDelete}
				/>
			)}
		</div>
	);
};

export default UserMenu;
