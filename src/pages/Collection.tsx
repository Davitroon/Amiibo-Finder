import { useState, useMemo } from "react";
import { useAmiibos } from "../context/AmiiboContext";
import { useFilters } from "../context/FilterContext"; // <--- IMPORTAR HOOK
import AmiiboList from "../modules/AmiiboList";
import DeleteCollectionModal from "../modules/DeleteModal";
import Filters from "../modules/Filters"; 
import { IoFilter } from "react-icons/io5"; 
import "../styles/collection.css";

const Collection = () => {
    const { userAmiibos, clearStorage } = useAmiibos();
    
    // --- CAMBIO: Usamos el contexto de filtros en lugar de useState local ---
    const { 
        filters, 
        setFilters, 
        isFilterPanelOpen, 
        toggleFilterPanel 
    } = useFilters();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    // NOTA: Hemos eliminado 'const [isFilterOpen...]' y 'const [filters...]' locales

    const handleConfirmDelete = () => {
        clearStorage();
        setShowDeleteConfirm(false);
    };

    const uniqueSeries = useMemo(() => {
        const series = userAmiibos.map((a) => a.gameSeries);
        return Array.from(new Set(series)).sort();
    }, [userAmiibos]);

    const filteredAmiibos = useMemo(() => {
        let result = [...userAmiibos];

        // 1. Filtro por Favoritos
        if (filters.showFavoritesOnly) {
            result = result.filter((a) => a.isFavorite);
        }

        // 2. Filtro por texto
        if (filters.name) {
            result = result.filter((a) =>
                a.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }

        // 3. Filtro por serie
        if (filters.series) {
            result = result.filter((a) => a.gameSeries === filters.series);
        }

        // 4. Ordenamiento
        result.sort((a, b) => {
            if (filters.sortBy === "favorites_first") {
                if (a.isFavorite && !b.isFavorite) return -1;
                if (!a.isFavorite && b.isFavorite) return 1;
                return a.name.localeCompare(b.name);
            }

            switch (filters.sortBy) {
                case "date_new": return -1;
                case "date_old": return 1;
                case "name_asc": return a.name.localeCompare(b.name);
                case "name_desc": return b.name.localeCompare(a.name);
                case "series":
                    const seriesComp = a.gameSeries.localeCompare(b.gameSeries);
                    return seriesComp !== 0 ? seriesComp : a.name.localeCompare(b.name);
                default: return 0;
            }
        });

        return result;
    }, [userAmiibos, filters]);

    return (
        <>
            <h2>My Collection</h2>
            <hr />

            <div className="collection-header">
                <button
                    // Usamos la variable del contexto: isFilterPanelOpen
                    className={`filter-toggle-btn ${isFilterPanelOpen ? "active" : ""}`}
                    // Usamos la función del contexto: toggleFilterPanel
                    onClick={toggleFilterPanel}
                >
                    <IoFilter style={{ marginRight: '5px' }} /> 
                    {isFilterPanelOpen ? "Hide Filters" : "Filters"}
                </button>
                
                <span className="results-count">
                    Showing <strong>{filteredAmiibos.length}</strong> of {userAmiibos.length} Amiibos
                </span>
            </div>

            {/* Pasamos los estados globales al componente */}
            <Filters 
                isOpen={isFilterPanelOpen}
                filters={filters}
                setFilters={setFilters}
                availableSeries={uniqueSeries}
            />

            <section className="collection-body">
                <div className="collection-frame">
                    {userAmiibos.length > 0 ? (
                        <>
                            {filteredAmiibos.length > 0 ? (
                                <AmiiboList amiibos={filteredAmiibos} />
                            ) : (
                                <div className="empty-content" style={{ minHeight: '200px' }}>
                                    <p>No amiibos found matching your filters.</p>
                                </div>
                            )}

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
                            <p className="empty-subtitle">
                                Go to the Unlock page to get your first Amiibo!
                            </p>
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