import { useState } from "react";
import { useAmiibos } from "../context/AmiiboContext";
import Modal from "../modules/Modal";
import AmiiboList from "../modules/AmiiboList";
import DeleteCollectionModal from "../modules/DeleteCollectionModal";
import "../styles/collection.css"; // Asegúrate de importar el CSS actualizado

const Collection = () => {
    const { userAmiibos, clearStorage } = useAmiibos();
    const [selectedAmiibo, setSelectedAmiibo] = useState<any>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleConfirmDelete = () => {
        clearStorage();
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <h2>My Collection</h2>
            <hr />

            <section className="collection-body">
                {userAmiibos.length > 0 ? (
                    <>
                        <AmiiboList setSelectedAmiibo={setSelectedAmiibo} />
                        
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="delete-collection"
                                title="Delete my Amiibos collection"
                            >
                                Delete collection
                            </button>
                        </div>
                    </>
                ) : (
                    /* CAMBIO: Mejor formato para lista vacía */
                    <div className="empty-state">
                        <p className="empty-title">Your collection is empty</p>
                        <p className="empty-subtitle">Go to the Unlock page to get your first Amiibo!</p>
                    </div>
                )}
            </section>

            <Modal
                isOpen={!!selectedAmiibo}
                onClose={() => setSelectedAmiibo(null)}
                amiibo={selectedAmiibo}
            />

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