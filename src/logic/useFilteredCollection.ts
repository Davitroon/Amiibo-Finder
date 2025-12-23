import { useMemo } from "react";
// Importamos el tipo desde el Contexto (ahora es el lugar correcto)
import type { FilterState } from "../context/useFilterContext"; 
import type { Amiibo } from "../context/useAmiiboContext"; 

// Renombrado para ser más descriptivo
export const useFilteredCollection = (userAmiibos: Amiibo[], filters: FilterState) => {

    const uniqueSeries = useMemo(() => {
        const series = userAmiibos.map((a) => a.gameSeries);
        return Array.from(new Set(series)).sort();
    }, [userAmiibos]);

    const filteredAmiibos = useMemo(() => {
        let result = [...userAmiibos];

        if (filters.showFavoritesOnly) {
            result = result.filter((a) => a.isFavorite);
        }
        if (filters.name) {
            result = result.filter((a) =>
                a.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }
        if (filters.series) {
            result = result.filter((a) => a.gameSeries === filters.series);
        }

        result.sort((a, b) => {
            if (filters.sortBy === "favorites_first") {
                if (a.isFavorite && !b.isFavorite) return -1;
                if (!a.isFavorite && b.isFavorite) return 1;
                return a.name.localeCompare(b.name);
            }
            // ... resto de tu lógica switch ...
            return 0; // fallback
        });

        return result;
    }, [userAmiibos, filters]);

    return { filteredAmiibos, uniqueSeries };
};