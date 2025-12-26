import { useMemo } from "react";
import type { FilterState } from "../context/FilterContext";
import type { Amiibo } from "../context/AmiiboContext";

/**
 * Custom hook to filter and sort the Amiibo collection efficiently.
 * * @param userAmiibos - The raw list of Amiibos owned by the user.
 * @param filters - The current state of active filters and sorting preferences.
 * @returns An object containing the filtered list and available unique game series.
 */
export const useFilteredCollection = (userAmiibos: Amiibo[], filters: FilterState) => {

    // 1. Extract Unique Series (for the dropdown menu)
    const uniqueSeries = useMemo(() => {
        const series = userAmiibos.map((a) => a.gameSeries);
        return Array.from(new Set(series)).sort();
    }, [userAmiibos]);

    // 2. Main Filtering and Sorting Logic
    const filteredAmiibos = useMemo(() => {
        // Create a shallow copy to avoid mutating the original array
        let result = [...userAmiibos];

        // --- A. FILTERS ---

        // A.1 Filter by Favorites
        if (filters.showFavoritesOnly) {
            result = result.filter((a) => a.isFavorite);
        }

        // A.2 Filter by Name (Prefix Match)
        if (filters.name) {
            result = result.filter((a) =>
                // Using startsWith ensures "Mario" is found by "Mar", but not "ario"
                a.name.toLowerCase().startsWith(filters.name.toLowerCase())
            );
        }

        // A.3 Filter by Series
        if (filters.series) {
            result = result.filter((a) => a.gameSeries === filters.series);
        }

        // --- B. SORTING ---

        // Case 1: DATES (Relying on the natural array order of insertion)
        if (filters.sortBy === "date_new") {
            // Reverse the array: newest additions appear first
            result.reverse();
        } 
        else if (filters.sortBy === "date_old") {
            // Do nothing: items are already sorted by arrival/unlock time
        } 
        else {
            // Case 2: OTHER OPTIONS (Using .sort)
            result.sort((a, b) => {
                switch (filters.sortBy) {
                    case "name_asc":
                        return a.name.localeCompare(b.name);
                    
                    case "name_desc":
                        return b.name.localeCompare(a.name);
                    
                    case "series":
                        // Primary sort by Series, secondary sort by Name
                        const seriesComp = a.gameSeries.localeCompare(b.gameSeries);
                        return seriesComp !== 0 ? seriesComp : a.name.localeCompare(b.name);
                    
                    case "favorites_first":
                        // If 'a' is favorite and 'b' is not, 'a' comes first (-1)
                        if (a.isFavorite && !b.isFavorite) return -1;
                        if (!a.isFavorite && b.isFavorite) return 1;
                        
                        // If both have the same status, sort alphabetically
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