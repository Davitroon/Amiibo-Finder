import { useState, useMemo } from "react";
import { useAmiibos } from "../context/AmiiboContext";
import AmiiboList from "../modules/AmiiboList";
import DeleteCollectionModal from "../modules/DeleteModal";
import Filters from "../modules/Filters"; 
import { IoFilter } from "react-icons/io5"; 
import "../styles/collection.css";

interface FilterState {
  name: string;
  series: string;
  sortBy: "date_new" | "date_old" | "name_asc" | "name_desc" | "series";
}

const Collection = () => {
    const { userAmiibos, clearStorage } = useAmiibos();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Estado para abrir/cerrar el panel de filtros
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [filters, setFilters] = useState<FilterState>({
        name: "",
        series: "",
        sortBy: "date_new"
    });

    const handleConfirmDelete = () => {
        clearStorage();
        setShowDeleteConfirm(false);
    };

    // --- LÓGICA DE FILTRADO ---
    const uniqueSeries = useMemo(() => {
        const series = userAmiibos.map((a) => a.gameSeries);
        return Array.from(new Set(series)).sort();
    }, [userAmiibos]);

    const filteredAmiibos = useMemo(() => {
        let result = [...userAmiibos];

        // 1. Filtro por texto
        if (filters.name) {
            result = result.filter((a) =>
                a.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }

        // 2. Filtro por serie
        if (filters.series) {
            result = result.filter((a) => a.gameSeries === filters.series);
        }

        // 3. Ordenamiento
        result.sort((a, b) => {
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

            {/* HEADER CON BOTÓN Y CONTADOR */}
            <div className="collection-header">
                <button
                    className={`filter-toggle-btn ${isFilterOpen ? "active" : ""}`}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                    <IoFilter style={{ marginRight: '5px' }} /> 
                    {isFilterOpen ? "Hide Filters" : "Show Filters"}
                </button>
                
                <span className="results-count">
                    Showing <strong>{filteredAmiibos.length}</strong> of {userAmiibos.length} Amiibos
                </span>
            </div>

            {/* COMPONENTE DE FILTROS (PANEL DESPLEGABLE) */}
            <Filters 
                isOpen={isFilterOpen}
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

            {/* Modal de Confirmación de Borrado */}
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