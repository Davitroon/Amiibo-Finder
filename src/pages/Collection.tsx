import { useState } from "react";
import { useAmiibos } from "../context/AmiiboContext";
import Modal from "../modules/Modal";
import AmiiboList from "../modules/AmiiboList";
import DeleteCollectionModal from "../modules/DeleteCollectionModal";

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
				<DeleteCollectionModal
					setShowDeleteConfirm={setShowDeleteConfirm}
					handleConfirmDelete={handleConfirmDelete}
				/>
			)}
		</>
	);
};

export default Collection;
