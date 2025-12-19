import "../styles/delete-modal.css"; // Asegúrate de importar el archivo CSS

interface Props {
    setShowDeleteConfirm: (status: boolean) => void;
    handleConfirmDelete: () => void;
}

const DeleteCollectionModal = ({
    setShowDeleteConfirm,
    handleConfirmDelete,
}: Props) => {
    return (
        <div className="delete-modal-overlay">
            <div className="delete-modal-content">
                <h3 className="delete-modal-title">Are you sure?</h3>
                <p>
                    You're about to delete your entire Amiibo collection. This action
                    can't be undone.
                </p>

                <div className="delete-modal-actions">
                    <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="modal-btn cancel"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirmDelete}
                        className="modal-btn delete"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCollectionModal;