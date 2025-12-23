import React from "react";
import "../styles/filters.css";
// SOLUCIÓN ERROR 1: Añadir 'type' explícitamente
import type { FilterState } from "../context/useFilterContext"; 

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
  availableSeries, // SOLUCIÓN ERROR 2: Se declara aquí...
  onReset,
}) => {
  return (
    <div className={`filter-panel-container ${isOpen ? "open" : ""}`}>
      <div className="filter-content-wrapper">
        <div className="filter-row">
          
          <div className="filter-left-group">
              {/* Input Nombre */}
              <div className="filter-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Mario, Link..."
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
              </div>

              {/* Input Series - AQUÍ USAMOS availableSeries */}
              <div className="filter-group">
                <label>Game Series</label>
                <select
                  value={filters.series}
                  onChange={(e) => setFilters({ ...filters, series: e.target.value })}
                >
                  <option value="">All Series</option>
                  {/* ... y aquí se lee el valor, solucionando el error TS6133 */}
                  {availableSeries.map((series) => (
                    <option key={series} value={series}>
                      {series}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Input Sort By */}
              <div className="filter-group">
                 {/* ... tu select de sort ... */}
              </div>
          </div>

          <div className="filter-right-group">
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