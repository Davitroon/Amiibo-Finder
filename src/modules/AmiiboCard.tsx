import React, { useState } from "react";
import { useAmiibo } from "../context/AmiiboContext";
import { IoBookmark } from "react-icons/io5";
import "../styles/amiibo-card.css";

interface Props {
  amiibo: any;
}

const AmiiboCard: React.FC<Props> = ({ amiibo }) => {
  const { toggleFavorite } = useAmiibo();
  const [showDetails, setShowDetails] = useState(false);

  const getReleaseDate = () => {
    if (!amiibo.release) return "N/A";
    return (
      amiibo.release.eu || amiibo.release.na || amiibo.release.jp || "Unknown"
    );
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Vital para que no gire la carta al dar like
    toggleFavorite(amiibo.head);
  };

  const favoriteLabel = amiibo.isFavorite
    ? `Remove ${amiibo.name} from favorites`
    : `Add ${amiibo.name} to favorites`;

  return (
    <article
      className={`amiibo-card-container ${showDetails ? "details-active" : ""}`}
      onClick={() => setShowDetails(!showDetails)}
      title={showDetails ? `See ${amiibo.name}'s image` : `See ${amiibo.name}'s details`}
      tabIndex={0}
      role="button"
      aria-pressed={showDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setShowDetails(!showDetails);
        }
      }}
      // Asegúrate en tu CSS que el article tenga position: relative
    >
      {/* 1. HEMOS MOVIDO EL BOTÓN AQUÍ.
          Ahora es hermano de las capas, no hijo. 
          Al estar fuera, no gira con la imagen y siempre es visible.
      */}
      <button
        className={`favorite-btn ${amiibo.isFavorite ? "active" : ""}`}
        onClick={handleFavoriteClick}
        aria-label={favoriteLabel}
        title={favoriteLabel}
        // Nota: Asegúrate que en CSS este botón tenga z-index alto (ej: z-index: 10)
      >
        <IoBookmark />
      </button>

      {/* --- CAPA DE IMAGEN --- */}
      <div className="card-image-layer">
        {/* El botón ya no está aquí dentro */}
        
        <img src={amiibo.image} alt={amiibo.name} loading="lazy" />

        <div className="card-front-info">
          <h4>{amiibo.name}</h4>
          <span>{amiibo.gameSeries}</span>
        </div>
      </div>

      {/* --- CAPA DE DETALLES --- */}
      <div className="card-info-layer">
        <div className="info-content-top">
          <h3>{amiibo.name}</h3>
          <hr />

          <div className="info-row">
            <p className="label">Series</p>
            <span className="value">{amiibo.gameSeries}</span>
          </div>

          {amiibo.unlockedAt && (
            <div className="info-row">
              <p className="label">Unlocked</p>
              <span className="value highlight">{amiibo.unlockedAt}</span>
            </div>
          )}

          <div className="info-row">
            <p className="label">Released</p>
            <span className="value">{getReleaseDate()}</span>
          </div>
        </div>
        <small className="tap-hint">Tap to close</small>
      </div>
    </article>
  );
};

export default AmiiboCard;