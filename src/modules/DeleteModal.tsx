import "../styles/modal.css";
import "../styles/modal-delete.css";

interface Props {
	setShowDeleteConfirm: (status: boolean) => void;
	handleConfirmDelete: () => void;
}

const DeleteCollectionModal = ({
	setShowDeleteConfirm,
	handleConfirmDelete,
}: Props) => {
	return (
		<div className="modal-overlay show">
			<div className="modal-box delete-content">
				<h3 className="delete-title">Are you sure?</h3>
				<p>
					You're about to delete your entire Amiibo collection. This action
					can't be undone.
				</p>

				<div className="delete-actions">
					<button
						onClick={() => setShowDeleteConfirm(false)}
						className="modal-btn cancel"
					>
						Cancel
					</button>

					<button onClick={handleConfirmDelete} className="modal-btn delete">
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteCollectionModal;
