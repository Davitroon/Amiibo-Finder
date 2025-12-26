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

/**
 * UserMenu Component.
 * Handles the User Interface (Menus, Clicks, Toasts).
 * Delegates heavy data logic to AmiiboContext.
 */
const UserMenu = () => {
	// Access data logic methods from Context
	const { userAmiibos, exportCollection, importFromFile, clearStorage } =
		useAmiibo();
	const { showToast } = useToast();

	// Local UI State
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	// Refs for Focus Management
	const fileInputRef = useRef<HTMLInputElement>(null);
	const menuButtonRef = useRef<HTMLButtonElement>(null);

	/**
	 * Effect: Closes menu on 'Escape' or Click Outside.
	 */
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isMenuOpen) {
				setIsMenuOpen(false);
				menuButtonRef.current?.focus(); // Restore focus to trigger
			}
		};

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target.closest(".user-menu-container")) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isMenuOpen]);

	/**
	 * Handles the Export button click.
	 * Calls logic -> Shows feedback.
	 */
	const onExportClick = () => {
		if (userAmiibos.length === 0) {
			showToast("⚠️ No data to export!");
			return;
		}

		const success = exportCollection();
		if (success) {
			showToast("✅ Collection exported successfully!");
			setIsMenuOpen(false);
		}
	};

	/**
	 * Triggers the hidden file input.
	 */
	const onImportClick = () => {
		fileInputRef.current?.click();
	};

	/**
	 * Handles file selection.
	 * Calls async logic -> Waits for result -> Shows feedback.
	 */
	const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const success = await importFromFile(file);

		if (success) {
			showToast("✅ Collection imported successfully!");
		} else {
			showToast("❌ Error importing file. Check format.");
		}

		setIsMenuOpen(false);
		e.target.value = ""; // Reset input
	};

	/**
	 * Finalizes the deletion process after Modal confirmation.
	 */
	const onConfirmDelete = () => {
		clearStorage();
		setShowDeleteConfirm(false);
		setIsMenuOpen(false);
		showToast("🗑️ Collection deleted.");

		// Return focus to the main menu button
		menuButtonRef.current?.focus();
	};

	// Ensure focus is returned if the delete modal is cancelled
	useEffect(() => {
		if (!showDeleteConfirm && !isMenuOpen) {
			menuButtonRef.current?.focus();
		}
	}, [showDeleteConfirm, isMenuOpen]);

	return (
		<div className="user-menu-container">
			<button
				ref={menuButtonRef}
				className={`icon-btn ${isMenuOpen ? "active" : ""}`}
				onClick={() => setIsMenuOpen(!isMenuOpen)}
				aria-label="User data options menu"
				title="User data options"
				aria-haspopup="true"
				aria-expanded={isMenuOpen}
				aria-controls="user-dropdown"
			>
				<IoPerson aria-hidden="true" />
			</button>

			{isMenuOpen && (
				<div
					id="user-dropdown"
					className="dropdown-menu"
					role="menu"
					aria-label="User options"
				>
					<button
						className="dropdown-item"
						onClick={onExportClick}
						role="menuitem"
					>
						<IoCloudDownload aria-hidden="true" />
						<span>Export data</span>
					</button>

					<button
						className="dropdown-item"
						onClick={onImportClick}
						role="menuitem"
					>
						<IoCloudUpload aria-hidden="true" />
						<span>Import data</span>
					</button>

					{/* Hidden Input for Import */}
					<input
						type="file"
						ref={fileInputRef}
						style={{ display: "none" }}
						accept=".json"
						onChange={onFileSelected}
						aria-hidden="true"
						tabIndex={-1}
					/>

					<div className="dropdown-divider" role="separator"></div>

					<button
						className="dropdown-item danger"
						onClick={() => {
							setShowDeleteConfirm(true);
							setIsMenuOpen(false); // Close menu immediately
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
					handleConfirmDelete={onConfirmDelete}
				/>
			)}
		</div>
	);
};

export default UserMenu;
