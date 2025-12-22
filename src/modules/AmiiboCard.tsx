import React, { useState } from "react";
import { useAmiibos } from "../context/AmiiboContext";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import "../styles/amiibo-card.css";

interface Props {
  amiibo: any;
}

const AmiiboCard: React.FC<Props> = ({ amiibo }) => {
  const { toggleFavorite } = useAmiibos();
  const [showDetails, setShowDetails] = useState(false);

  // ESTA ES LA FUNCIÓN QUE ESTABA "HUÉRFANA"
  const getReleaseDate = () => {
    if (!amiibo.release) return "N/A";
    return amiibo.release.eu || amiibo.release.na || amiibo.release.jp || "Unknown";
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(amiibo.head);
  };

  return (
    <article 
      className={`amiibo-card-container ${showDetails ? "details-active" : ""}`}
      onClick={() => setShowDetails(!showDetails)}
      title={showDetails ? "Click to see image" : "Click to see details"}
    >
        {/* --- CAPA DE IMAGEN --- */}
        <div className="card-image-layer">
          <button 
            className={`favorite-btn ${amiibo.isFavorite ? "active" : ""}`} 
            onClick={handleFavoriteClick}
            title={amiibo.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
             {amiibo.isFavorite ? <IoBookmark /> : <IoBookmarkOutline />}
          </button>

          <img 
            src={amiibo.image} 
            alt={amiibo.name} 
            loading="lazy" 
          />
          
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

                {/* --- RECUPERAMOS EL USO AQUÍ --- */}
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