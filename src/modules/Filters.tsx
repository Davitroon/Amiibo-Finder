import React, { useEffect } from "react";
import "../styles/filters.css";

// Fix for TS(1484): Explicitly importing 'type'
import type { FilterState } from "../context/FilterContext";

/**
 * Props definition for the Filters component.
 */
interface Props {
    isOpen: boolean;
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    availableSeries: string[];
    onReset: () => void;
}

/**
 * Component that renders the filter panel.
 * Contains inputs for filtering by name, game series, sorting options, and a favorites toggle.
 * * Accessibility Features:
 * - Uses semantic `<label>` tags linked to inputs via `htmlFor`.
 * - Manages focus when the panel opens.
 * - Supports keyboard navigation (Enter key) for the checkbox.
 * - Uses `aria-hidden` and `inert` to manage visibility to screen readers.
 */
const Filters: React.FC<Props> = ({
    isOpen,
    filters,
    setFilters,
    availableSeries,
    onReset,
}) => {
    // Auto-focus the name input when the panel opens for better keyboard UX
    useEffect(() => {
        if (isOpen) {
            document.getElementById("filter-name")?.focus();
        }
    }, [isOpen]);

    return (
        <div
            className={`filter-panel-container ${isOpen ? "open" : ""}`}
            aria-hidden={!isOpen}
            // 'inert' attribute (modern browsers) prevents interaction when closed
            // @ts-ignore
            inert={!isOpen ? "true" : undefined}
        >
            <div className="filter-content-wrapper">
                <div className="filter-row">
                    <div className="filter-left-group">
                        {/* 1. FILTER: NAME */}
                        <div className="filter-group">
                            <label htmlFor="filter-name">Name</label>
                            <input
                                id="filter-name"
                                type="text"
                                placeholder="Mario, Link..."
                                value={filters.name}
                                onChange={(e) =>
                                    setFilters({ ...filters, name: e.target.value })
                                }
                            />
                        </div>

                        {/* 2. FILTER: SERIES */}
                        <div className="filter-group">
                            <label htmlFor="filter-series">Game Series</label>
                            <select
                                id="filter-series"
                                value={filters.series}
                                onChange={(e) =>
                                    setFilters({ ...filters, series: e.target.value })
                                }
                            >
                                <option value="">All Series</option>
                                {availableSeries.map((series) => (
                                    <option key={series} value={series}>
                                        {series}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 3. FILTER: SORT BY */}
                        <div className="filter-group">
                            <label htmlFor="filter-sort">Sort By</label>
                            <select
                                id="filter-sort"
                                value={filters.sortBy}
                                onChange={(e) =>
                                    setFilters({ ...filters, sortBy: e.target.value as any })
                                }
                            >
                                <option value="date_new">Newest</option>
                                <option value="date_old">Oldest</option>
                                <option value="name_asc">Name (A-Z)</option>
                                <option value="name_desc">Name (Z-A)</option>
                                <option value="series">Series</option>
                                <option value="favorites_first">Favorites</option>
                            </select>
                        </div>

                        {/* 4. FILTER: FAVORITES ONLY */}
                        <div
                            className="filter-group"
                            style={{
                                display: "flex", 
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: "25px",
                                gap: "8px",
                            }}
                        >
                            <input
                                type="checkbox"
                                id="favCheck"
                                checked={filters.showFavoritesOnly}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        showFavoritesOnly: e.target.checked,
                                    })
                                }
                                // Add keyboard support for 'Enter' key to toggle checkbox
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault(); // Prevent accidental form submission
                                        setFilters({
                                            ...filters,
                                            showFavoritesOnly: !filters.showFavoritesOnly,
                                        });
                                    }
                                }}
                                style={{
                                    width: "20px",
                                    minWidth: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />

                            <label
                                htmlFor="favCheck"
                                style={{
                                    cursor: "pointer",
                                    marginBottom: 0,
                                    userSelect: "none",
                                }}
                            >
                                Favorites Only
                            </label>
                        </div>
                    </div>

                    <div className="filter-right-group">
                        {/* Clean Button */}
                        <button
                            className="clean-filters-btn"
                            onClick={onReset}
                            title="Reset all filters"
                            aria-label="Reset all filters"
                        >
                            Clean
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filters;