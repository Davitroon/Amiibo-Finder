import React, { useEffect } from "react";
import "../styles/filters.css";

// CORRECCIÓN DEL ERROR TS(1484): Añadimos 'type' a la importación
import type { FilterState } from "../context/FilterContext";

interface Props {
  isOpen: boolean;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  availableSeries: string[];
  onReset: () => void;
}

const Filters: React.FC<Props> = ({
  isOpen,
  filters,
  setFilters,
  availableSeries,
  onReset,
}) => {

  useEffect(() => {
  if (isOpen) {
    document.getElementById("filter-name")?.focus();
  }
}, [isOpen]);

  return (
    <div 
      className={`filter-panel-container ${isOpen ? "open" : ""}`} 
      hidden={!isOpen}
    >
      <div className="filter-content-wrapper">
        <div className="filter-row">
          
          <div className="filter-left-group">
              
              {/* 1. FILTRO: NOMBRE */}
              <div className="filter-group">
                {/* ACCESIBILIDAD: Vinculamos label con input usando htmlFor e id */}
                <label htmlFor="filter-name">Name</label>
                <input
                  id="filter-name"
                  type="text"
                  placeholder="Mario, Link..."
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
              </div>

              {/* 2. FILTRO: SERIE */}
              <div className="filter-group">
                <label htmlFor="filter-series">Game Series</label>
                <select
                  id="filter-series"
                  value={filters.series}
                  onChange={(e) => setFilters({ ...filters, series: e.target.value })}
                >
                  <option value="">All Series</option>
                  {availableSeries.map((series) => (
                    <option key={series} value={series}>
                      {series}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. FILTRO: ORDENAR POR */}
              <div className="filter-group">
                <label htmlFor="filter-sort">Sort By</label>
                <select
                  id="filter-sort"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                >
                  <option value="date_new">Newest</option>
                  <option value="date_old">Oldest</option>
                  <option value="name_asc">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="series">Series</option>
                  <option value="favorites_first">Favorites</option>
                </select>
              </div>

              {/* 4. FILTRO: SOLO FAVORITOS */}
              <div className="filter-group" style={{ flexDirection: 'row', alignItems: 'center', marginTop: '25px', gap: '8px' }}>
                <input 
                    type="checkbox" 
                    id="favCheck"
                    checked={filters.showFavoritesOnly}
                    onChange={(e) => setFilters({...filters, showFavoritesOnly: e.target.checked})}
                    style={{ width: '20px', minWidth: '20px', height: '20px' }}
                />
                {/* Este ya lo tenías bien, ¡genial! */}
                <label htmlFor="favCheck" style={{ cursor: 'pointer', marginBottom: 0 }}>
                    Favorites Only
                </label>
              </div>

          </div>

          <div className="filter-right-group">
             {/* Botón Clean */}
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