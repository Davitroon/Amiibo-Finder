import { useState, useEffect, useRef } from "react";
import { useAmiiboContext } from "../context/useAmiiboContext";
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
	const { userAmiibos, importData, clearStorage } = useAmiiboContext();
	const { showToast } = useToast();

	// Estados
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	// Referencia para el input oculto
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Cerrar menú al hacer clic fuera
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target.closest(".user-menu-container")) {
				setIsMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

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
		setIsMenuOpen(false);
        showToast("🗑️ Collection deleted.");
	};

	return (
		<div className="user-menu-container">
			<button
				className={`icon-btn ${isMenuOpen ? "active" : ""}`}
				onClick={() => setIsMenuOpen(!isMenuOpen)}
				title="User Options"
			>
				<IoPerson />
			</button>

			{/* Menú Desplegable */}
			{isMenuOpen && (
				<div className="dropdown-menu">
					<button
						className="dropdown-item"
						onClick={handleExport}
						title="Save your collection data as a JSON file"
					>
						<IoCloudDownload /> Export data
					</button>

					<button
						className="dropdown-item"
						onClick={triggerImport}
						title="Load a collection data as a JSON file"
					>
						<IoCloudUpload /> Import data
					</button>

					<input
						type="file"
						ref={fileInputRef}
						style={{ display: "none" }}
						accept=".json"
						onChange={handleFileChange}
					/>

					<div className="dropdown-divider"></div>

					<button
						className="dropdown-item danger"
						onClick={() => setShowDeleteConfirm(true)}
						title="Delete your current collection"
					>
						<IoTrash /> Delete Data
					</button>
				</div>
			)}

			{/* Modal de Borrado */}
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
