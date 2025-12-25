import React, { createContext, useState, useContext } from "react";

/**
 * Defines the structure of the filter state.
 * Includes search criteria, sorting options, and boolean toggles.
 */
export interface FilterState {
    name: string;
    series: string;
    sortBy: "date_new" | "date_old" | "name_asc" | "name_desc" | "series" | "favorites_first"; 
    showFavoritesOnly: boolean;
}

/**
 * Defines the shape of the Filter Context.
 * Provides access to the filter state, visibility of the panel, and modifier functions.
 */
interface FilterContextType {
    isFilterPanelOpen: boolean;
    toggleFilterPanel: () => void;
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

/**
 * Provider component that manages the global state for filtering and sorting.
 * Wraps the application or specific sections that require filter access.
 */
export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    
    const [filters, setFilters] = useState<FilterState>({
        name: "",
        series: "",
        sortBy: "date_new",
        showFavoritesOnly: false
    });

    /**
     * Toggles the visibility of the side filter panel.
     */
    const toggleFilterPanel = () => setIsFilterPanelOpen(prev => !prev);

    /**
     * Resets all filter and sort criteria to their default values.
     */
    const resetFilters = () => {
        setFilters({
            name: "",
            series: "",
            sortBy: "date_new",
            showFavoritesOnly: false
        });
    };

    return (
        <FilterContext.Provider value={{
            isFilterPanelOpen,
            toggleFilterPanel,
            filters,
            setFilters,
            resetFilters
        }}>
            {children}
        </FilterContext.Provider>
    );
};

/**
 * Custom hook to consume the FilterContext.
 * @returns The filter context value.
 * @throws Error if used outside of a FilterProvider.
 */
export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) throw new Error("useFilter must be used within a FilterProvider");
    return context;
};