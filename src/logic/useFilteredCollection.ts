import { useMemo } from "react";
// Asegúrate de que los imports coinciden con tus nombres de archivo
import type { FilterState } from "../context/useFilterContext";
import type { Amiibo } from "../context/useAmiiboContext";

export const useFilteredCollection = (userAmiibos: Amiibo[], filters: FilterState) => {

    // 1. Extraer Series Únicas (Para el desplegable)
    const uniqueSeries = useMemo(() => {
        const series = userAmiibos.map((a) => a.gameSeries);
        return Array.from(new Set(series)).sort();
    }, [userAmiibos]);

    // 2. Lógica principal de Filtrado y Ordenamiento
    const filteredAmiibos = useMemo(() => {
        // Creamos una copia para no modificar el array original
        let result = [...userAmiibos];

        // --- A. FILTROS ---

        // A.1 Solo Favoritos
        if (filters.showFavoritesOnly) {
            result = result.filter((a) => a.isFavorite);
        }

        // A.2 Por Nombre (CORREGIDO: "starts with")
        if (filters.name) {
            result = result.filter((a) =>
                // Usamos startsWith en lugar de includes.
                // "Mario" aparecerá si escribes "Mar", pero NO si escribes "ario".
                a.name.toLowerCase().startsWith(filters.name.toLowerCase())
            );
        }

        // A.3 Por Serie
        if (filters.series) {
            result = result.filter((a) => a.gameSeries === filters.series);
        }

        // --- B. ORDENAMIENTO (CORREGIDO: Lógica completa) ---

        // Caso 1: FECHAS (Usamos el orden natural del array)
        if (filters.sortBy === "date_new") {
            // Invertimos el array: los últimos añadidos aparecen primero
            result.reverse();
        } 
        else if (filters.sortBy === "date_old") {
            // No hacemos nada: ya vienen ordenados por fecha de llegada
        } 
        else {
            // Caso 2: RESTO DE OPCIONES (Usamos .sort)
            result.sort((a, b) => {
                switch (filters.sortBy) {
                    case "name_asc":
                        return a.name.localeCompare(b.name);
                    
                    case "name_desc":
                        return b.name.localeCompare(a.name);
                    
                    case "series":
                        // Primero por serie, luego por nombre
                        const seriesComp = a.gameSeries.localeCompare(b.gameSeries);
                        return seriesComp !== 0 ? seriesComp : a.name.localeCompare(b.name);
                    
                    case "favorites_first":
                        // Si 'a' es fav y 'b' no, 'a' va primero (-1)
                        if (a.isFavorite && !b.isFavorite) return -1;
                        if (!a.isFavorite && b.isFavorite) return 1;
                        // Si ambos son iguales (los dos fav o los dos no fav), alfabético
                        return a.name.localeCompare(b.name);
                    
                    default:
                        return 0;
                }
            });
        }

        return result;
    }, [userAmiibos, filters]);

    return { filteredAmiibos, uniqueSeries };
};