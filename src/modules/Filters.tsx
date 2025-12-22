import React from "react";
import "../styles/filters.css";

// Actualizamos el tipo para incluir los nuevos campos
export interface FilterState {
  name: string;
  series: string;
  // Añadimos 'favorites_first' al tipo de ordenación
  sortBy: "date_new" | "date_old" | "name_asc" | "name_desc" | "series" | "favorites_first"; 
  // Nuevo filtro booleano
  showFavoritesOnly: boolean;
}

interface Props {
  isOpen: boolean;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  availableSeries: string[];
}

const Filters: React.FC<Props> = ({
  isOpen,
  filters,
  setFilters,
  availableSeries,
}) => {
  
  const handleClean = () => {
    setFilters({ 
        name: "", 
        series: "", 
        sortBy: "date_new", 
        showFavoritesOnly: false 
    });
  };

  return (
    <div className={`filter-panel-container ${isOpen ? "open" : ""}`}>
      <div className="filter-content-wrapper">
        <div className="filter-row">
            
          <div className="filter-left-group">
              <div className="filter-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Mario, Link..."
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
              </div>

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

              <div className="filter-group">
                <label>Sort By</label>
                <select
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

              {/* NUEVO: Checkbox para solo favoritos */}
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
             <button className="clean-filters-btn" onClick={handleClean}>
                Clean
             </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Filters;