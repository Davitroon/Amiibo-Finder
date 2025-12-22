import React from "react";
import "../styles/filters.css";

interface FilterState {
  name: string;
  series: string;
  sortBy: "date_new" | "date_old" | "name_asc" | "name_desc" | "series";
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
    setFilters({ name: "", series: "", sortBy: "date_new" });
  };

  return (
    <div className={`filter-panel-container ${isOpen ? "open" : ""}`}>
      <div className="filter-content-wrapper">
        
        <div className="filter-row">
            
          {/* 1. Nombre (Quitamos 'grow') */}
          <div className="filter-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Mario, Link..."
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>

          {/* 2. Saga (Quitamos 'grow') */}
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

          {/* 3. Ordenar */}
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
            </select>
          </div>

          {/* Botón Clean (AÑADIDO: 'push-right' para empujarlo al final) */}
          <div className="filter-group push-right">
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