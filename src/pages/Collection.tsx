import { useState, useMemo } from "react";
import { useAmiibos } from "../context/AmiiboContext";
import Modal from "../modules/Modal";
import AmiiboList from "../modules/AmiiboList";
import DeleteCollectionModal from "../modules/DeleteCollectionModal";
import "../styles/collection.css";

const Collection = () => {
    const { userAmiibos, clearStorage } = useAmiibos();
    const [selectedAmiibo, setSelectedAmiibo] = useState<any>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Estado para mostrar/ocultar el panel de filtros
    const [showFilters, setShowFilters] = useState(false);

    // Estados para los filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSeries, setSelectedSeries] = useState("All");
    const [sortOrder, setSortOrder] = useState("newest");

    const handleConfirmDelete = () => {
        clearStorage();
        setShowDeleteConfirm(false);
    };

    // --- LÓGICA DE FILTRADO ---
    // Obtenemos las series únicas para el select
    const uniqueSeries = useMemo(() => {
        const series = userAmiibos.map((a) => a.gameSeries);
        // Ordenamos las series alfabéticamente para el dropdown
        return ["All", ...Array.from(new Set(series)).sort()];
    }, [userAmiibos]);

    // Filtramos y ordenamos la lista
    const filteredAmiibos = useMemo(() => {
        let result = [...userAmiibos];

        // 1. Filtro por texto
        if (searchTerm) {
            result = result.filter((a) =>
                a.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Filtro por serie (Dropdown de filtrado)
        if (selectedSeries !== "All") {
            result = result.filter((a) => a.gameSeries === selectedSeries);
        }

        // 3. Ordenamiento
        result.sort((a, b) => {
            if (sortOrder === "newest") {
                return -1; // Asumiendo orden de inserción invertido
            } else if (sortOrder === "oldest") {
                return 1;
            } else if (sortOrder === "az") {
                return a.name.localeCompare(b.name);
            } else if (sortOrder === "za") {
                return b.name.localeCompare(a.name);
            } else if (sortOrder === "series") {
                // NUEVO: Lógica para ordenar por Serie alfabéticamente
                // Si la serie es igual, ordena por nombre secundariamente
                const seriesComparison = a.gameSeries.localeCompare(b.gameSeries);
                if (seriesComparison !== 0) return seriesComparison;
                return a.name.localeCompare(b.name);
            }
            return 0;
        });

        return result;
    }, [userAmiibos, searchTerm, selectedSeries, sortOrder]);

    return (
        <>
            <h2>My Collection</h2>

            <hr />

            {/* HEADER CON BOTÓN Y CONTADOR */}
            <div className="collection-header">
                <button
                    className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
                
                {/* Contador de resultados */}
                <span className="results-count">
                    Showing <strong>{filteredAmiibos.length}</strong> of {userAmiibos.length} Amiibos
                </span>
            </div>

            {/* PANEL DE FILTROS EXPANDIBLE */}
            <div className={`filter-panel ${showFilters ? "open" : ""}`}>
                <div className="filter-content">
                    {/* 1. Buscador */}
                    <div className="filter-group">
                        <label>Search:</label>
                        <input
                            type="text"
                            placeholder="Mario, Link..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* 2. Series (Filtrado) */}
                    <div className="filter-group">
                        <label>Filter by Series:</label>
                        <select
                            value={selectedSeries}
                            onChange={(e) => setSelectedSeries(e.target.value)}
                        >
                            {uniqueSeries.map((series) => (
                                <option key={series} value={series}>
                                    {series}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 3. Ordenar (Sorting) */}
                    <div className="filter-group">
                        <label>Sort by:</label>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                            <option value="az">Name (A-Z)</option>
                            <option value="za">Name (Z-A)</option>
                            <option value="series">Series</option>
                        </select>
                    </div>
                </div>
            </div>

            <section className="collection-body">
                <div className="collection-frame">
                    {userAmiibos.length > 0 ? (
                        <>
                            {filteredAmiibos.length > 0 ? (
                                <AmiiboList
                                    amiibos={filteredAmiibos}
                                    setSelectedAmiibo={setSelectedAmiibo}
                                />
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