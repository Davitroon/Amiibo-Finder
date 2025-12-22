import React, { createContext, useState, useContext } from "react";
// Importamos el tipo FilterState
import type { FilterState } from "../modules/Filters";

interface FilterContextType {
    isFilterPanelOpen: boolean;
    toggleFilterPanel: () => void;
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 1. Estado del Panel (Visible/Oculto)
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    
    // 2. Estado de los Filtros
    // Se mantiene en memoria durante la sesión. Se borra al recargar (F5).
    const [filters, setFilters] = useState<FilterState>({
        name: "",
        series: "",
        sortBy: "date_new",
        showFavoritesOnly: false
    });

    const toggleFilterPanel = () => setIsFilterPanelOpen(prev => !prev);

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

export const useFilters = () => {
    const context = useContext(FilterContext);
    if (!context) throw new Error("useFilters debe usarse dentro de FilterProvider");
    return context;
};