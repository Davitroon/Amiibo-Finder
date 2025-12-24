import React from "react";
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
  return (
    <div className={`filter-panel-container ${isOpen ? "open" : ""}`}>
      <div className="filter-content-wrapper">
        <div className="filter-row">
          
          <div className="filter-left-group">
              
              {/* 1. FILTRO: NOMBRE */}
              <div className="filter-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Mario, Link..."
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
              </div>

              {/* 2. FILTRO: SERIE */}
              <div className="filter-group">
                <label>Game Series</label>
                <select
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

              {/* 3. FILTRO: ORDENAR POR (Restaurado) */}
              <div className="filter-group">
                <label>Sort By</label>
                <select
                  value={filters.sortBy}
                  // TypeScript a veces pide castear el value si es muy estricto
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

              {/* 4. FILTRO: SOLO FAVORITOS (Restaurado) */}
              <div className="filter-group" style={{ flexDirection: 'row', alignItems: 'center', marginTop: '25px', gap: '8px' }}>
                <input 
                    type="checkbox" 
                    id="favCheck"
                    checked={filters.showFavoritesOnly}
                    onChange={(e) => setFilters({...filters, showFavoritesOnly: e.target.checked})}
                    style={{ width: '20px', minWidth: '20px', height: '20px' }}
                />
                <label htmlFor="favCheck" style={{ cursor: 'pointer', marginBottom: 0 }}>
                    Favorites Only
                </label>
              </div>

          </div>

          <div className="filter-right-group">
             {/* Botón Clean */}
             <button className="clean-filters-btn" onClick={onReset}>
                Clean
             </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Filters;