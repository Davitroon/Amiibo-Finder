import { useAmiibo } from "../context/AmiiboContext";
import { useFilter } from "../context/FilterContext";
import { useFilteredCollection } from "../logic/useFilteredCollection"; 

import AmiiboList from "../modules/AmiiboList";
import Filters from "../modules/Filters";
import { IoFilter } from "react-icons/io5";
import "../styles/collection.css";

/**
 * Main Collection Page Component.
 * Displays the user's Amiibo collection with filtering and sorting capabilities.
 */
const Collection = () => {
    // 1. Global Data Access
    const { userAmiibos } = useAmiibo();
    
    // 2. Filter Context Access
    const { 
        filters, 
        setFilters, 
        resetFilters, 
        isFilterPanelOpen, 
        toggleFilterPanel 
    } = useFilter();

    // 3. Filtering Logic Hook
    const { filteredAmiibos, uniqueSeries } = useFilteredCollection(
        userAmiibos,
        filters
    );

    return (
        <>
            <h2>My Collection</h2>
            <hr />

            {/* Collection Controls Header */}
            <div className="collection-header">
                <button
                    className={`filter-toggle-btn ${isFilterPanelOpen ? "active" : ""}`}
                    onClick={toggleFilterPanel}
                    aria-expanded={isFilterPanelOpen}
                    aria-controls="filter-panel"
                >
                    <IoFilter style={{ marginRight: "5px" }} aria-hidden="true" />
                    {isFilterPanelOpen ? "Hide Filters" : "Filters"}
                </button>

                <span className="results-count" role="status">
                    Showing <strong>{filteredAmiibos.length}</strong> of{" "}
                    {userAmiibos.length} Amiibos
                </span>
            </div>

            {/* Filter Panel Component */}
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
        </>
    );
};

export default Collection;