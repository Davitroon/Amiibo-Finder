import React, { createContext, useState, useContext } from "react";

// 1. DEFINICIÓN DEL TIPO (Movido aquí para evitar círculos)
export interface FilterState {
  name: string;
  series: string;
  sortBy: "date_new" | "date_old" | "name_asc" | "name_desc" | "series" | "favorites_first"; 
  showFavoritesOnly: boolean;
}

interface FilterContextType {
    isFilterPanelOpen: boolean;
    toggleFilterPanel: () => void;
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    
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

// 2. RENOMBRADO: De 'filterContext' a 'useFilterContext' (Estándar React)
export const useFilterContext = () => {
    const context = useContext(FilterContext);
    if (!context) throw new Error("useFilterContext debe usarse dentro de FilterProvider");
    return context;
};