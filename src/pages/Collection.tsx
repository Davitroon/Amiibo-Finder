import { useState } from "react";
import { useAmiiboContext } from "../context/useAmiiboContext"; // Asegúrate de que este nombre sea correcto (amiiboContext vs useAmiibos)
import { useFilterContext } from "../context/useFilterContext"; // Corregido path si es necesario
// SOLUCIÓN ERROR 3: Importar el nombre correcto del hook de lógica
import { useFilteredCollection } from "../logic/useFilteredCollection"; 

import AmiiboList from "../modules/AmiiboList";
import DeleteCollectionModal from "../modules/DeleteModal";
import Filters from "../modules/Filters";
import { IoFilter } from "react-icons/io5";
import "../styles/collection.css";

const Collection = () => {
    // 1. Datos Globales
    const { userAmiibos, clearStorage } = useAmiiboContext();
    
    // SOLUCIÓN ERROR 4 (parte A): Extraer 'resetFilters' del contexto
    const { 
        filters, 
        setFilters, 
        resetFilters, // <--- NECESARIO
        isFilterPanelOpen, 
        toggleFilterPanel 
    } = useFilterContext();

    // 2. Estado Local de UI
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // 3. Lógica compleja (Nombre corregido)
    const { filteredAmiibos, uniqueSeries } = useFilteredCollection(
        userAmiibos,
        filters
    );

    const handleConfirmDelete = () => {
        clearStorage();
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <h2>My Collection</h2>
            <hr />

            <div className="collection-header">
                <button
                    className={`filter-toggle-btn ${isFilterPanelOpen ? "active" : ""}`}
                    onClick={toggleFilterPanel}
                >
                    <IoFilter style={{ marginRight: "5px" }} />
                    {isFilterPanelOpen ? "Hide Filters" : "Filters"}
                </button>

                <span className="results-count">
                    Showing <strong>{filteredAmiibos.length}</strong> of{" "}
                    {userAmiibos.length} Amiibos
                </span>
            </div>

            <Filters
                isOpen={isFilterPanelOpen}
                filters={filters}
                setFilters={setFilters}
                availableSeries={uniqueSeries}
                // SOLUCIÓN ERROR 4 (parte B): Pasar la función al componente
                onReset={resetFilters} 
            />

            <section className="collection-body">
                {/* ... resto del código igual ... */}
                 <div className="collection-frame">
                    {userAmiibos.length > 0 ? (
                        <>
                            {filteredAmiibos.length > 0 ? (
                                <AmiiboList amiibos={filteredAmiibos} />
                            ) : (
                                <div className="empty-content" style={{ minHeight: "200px" }}>
                                    <p>No amiibos found matching your filters.</p>
                                </div>
                            )}
                            {/* Botón borrar */}
                             <div style={{ display: "flex", justifyContent: "center" }}>
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
                        <div className="empty-content">
                             <p className="empty-title">Your collection is empty</p>
                        </div>
                    )}
                </div>
            </section>

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