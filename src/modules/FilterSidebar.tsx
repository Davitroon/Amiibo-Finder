import React from "react";

interface FilterState {
  name: string;
  series: string;
  sortBy: "date_new" | "date_old" | "name_asc" | "name_desc" | "series";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  availableSeries: string[];
}

const FilterSidebar: React.FC<Props> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  availableSeries,
}) => {
  
  // Resetear filtros
  const handleClean = () => {
    setFilters({
      name: "",
      series: "",
      sortBy: "date_new",
    });
  };

  return (
    <>
      {/* Overlay oscuro (hacer clic fuera cierra el menú) */}
      <div 
        className={`filter-overlay ${isOpen ? "open" : ""}`} 
        onClick={onClose} 
      />

      {/* El Sidebar en sí */}
      <div className={`filter-sidebar ${isOpen ? "open" : ""}`}>
        <div className="filter-header">
          <h3>Filters</h3>
          <button className="close-filter-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="filter-content">
          {/* 1. Nombre */}
          <div className="filter-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Mario, Link..."
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>

          {/* 2. Saga (Game Series) */}
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

          {/* 3. Ordenar por */}
          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
            >
              <option value="date_new">Date Obtained (Newest)</option>
              <option value="date_old">Date Obtained (Oldest)</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="series">Series</option>
            </select>
          </div>

          {/* Botón Clean */}
          <button className="clean-filters-btn" onClick={handleClean}>
            Clean filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;