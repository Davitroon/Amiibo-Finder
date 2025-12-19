import { useState } from "react";
import { useAmiibos } from "../context/AmiiboContext";
import Modal from "../modules/Modal";
import AmiiboList from "../modules/AmiiboList";

const Collection = () => {
	const { userAmiibos, clearStorage } = useAmiibos();
	const [selectedAmiibo, setSelectedAmiibo] = useState<any>(null);

	// Estado para controlar el popup de confirmación
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	// ----------------------------------------------------
	// FUNCIÓN DE BORRADO (Lógica pendiente)
	// ----------------------------------------------------
	const handleConfirmDelete = () => {
		console.log("User collection deleted");
		clearStorage();
		setShowDeleteConfirm(false);
	};

	return (
		<>
			<h2>My Collection</h2>
			<hr />

			<section className="collection-body">
				{userAmiibos.length > 0 ? (
					<AmiiboList setSelectedAmiibo={setSelectedAmiibo} />

				) : (
					<p>You haven't any Amiibos unlocked yet.</p>
				)}

				<button
					onClick={() => setShowDeleteConfirm(true)}
					className="delete-collection"
					title="Delete my Amiibos collection"
				>
					Delete collection
				</button>
			</section>

			{/* Amiibo details modal */}
			<Modal
				isOpen={!!selectedAmiibo}
				onClose={() => setSelectedAmiibo(null)}
				amiibo={selectedAmiibo}
			/>

			{/* Collection confirm modal */}
			{showDeleteConfirm && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0,0,0,0.7)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 1000,
					}}
				>
					<div
						style={{
							background: "white",
							padding: "2rem",
							borderRadius: "8px",
							textAlign: "center",
							maxWidth: "300px",
							color: "black",
						}}
					>
						<h3 style={{ marginTop: 0 }}>Are you sure?</h3>
						<p>
							You're about to delete your entire Amiibo collection. This action
							can't be undone.
						</p>

						<div
							style={{
								display: "flex",
								gap: "1rem",
								justifyContent: "center",
								marginTop: "1.5rem",
							}}
						>
							<button
								onClick={() => setShowDeleteConfirm(false)}
								style={{
									background: "gray",
									color: "white",
									padding: "8px 16px",
									border: "none",
									borderRadius: "4px",
									cursor: "pointer",
								}}
							>
								Cancel
							</button>

							<button
								onClick={handleConfirmDelete}
								style={{
									background: "red",
									color: "white",
									padding: "8px 16px",
									border: "none",
									borderRadius: "4px",
									cursor: "pointer",
								}}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Collection;
