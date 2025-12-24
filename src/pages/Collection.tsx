import { useAmiibo } from "../context/AmiiboContext";
import { useFilter } from "../context/FilterContext";
import { useFilteredCollection } from "../logic/useFilteredCollection"; 

import AmiiboList from "../modules/AmiiboList";
import Filters from "../modules/Filters";
import { IoFilter } from "react-icons/io5";
import "../styles/collection.css";

const Collection = () => {
    // 1. Datos Globales
    const { userAmiibos } = useAmiibo(); // Ya no necesitamos clearStorage aquí
    
    const { 
        filters, 
        setFilters, 
        resetFilters, 
        isFilterPanelOpen, 
        toggleFilterPanel 
    } = useFilter();

    // 2. Lógica de Filtrado
    const { filteredAmiibos, uniqueSeries } = useFilteredCollection(
        userAmiibos,
        filters
    );

    // NOTA: Hemos eliminado el estado 'showDeleteConfirm' y el 'handleConfirmDelete'
    // porque esa funcionalidad se ha movido al Header.

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
                onReset={resetFilters} 
            />

            <section className="collection-body">
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
                            
                            {/* AQUÍ ANTES ESTABA EL BOTÓN DELETE. LO HEMOS ELIMINADO. */}
                        </>
                    ) : (
                        <div className="empty-content">
                             <p className="empty-title">Your collection is empty</p>
                             <p className="empty-subtitle">
                                Go to the Unlock page to get your first Amiibo!
                            </p>
                        </div>
                    )}
                </div>
            </section>
            
            {/* EL MODAL TAMBIÉN SE HA MOVIDO AL HEADER */}
        </>
    );
};

export default Collection;