import React, { useState } from "react";
import "../styles/amiibo-card.css";

interface Props {
  amiibo: any;
}

const AmiiboCard: React.FC<Props> = ({ amiibo }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getReleaseDate = () => {
    if (!amiibo.release) return "N/A";
    return amiibo.release.eu || amiibo.release.na || amiibo.release.jp || "Unknown";
  };

  return (
    <article 
      className={`amiibo-card-container ${showDetails ? "details-active" : ""}`}
      onClick={() => setShowDetails(!showDetails)}
      title={showDetails ? "Click to see image" : "Click to see details"}
    >
        {/* --- CAPA DE IMAGEN (Ahora incluye texto) --- */}
        <div className="card-image-layer">
          <img 
            src={amiibo.image} 
            alt={amiibo.name} 
            loading="lazy" 
          />
          
          {/* NUEVO: Información básica visible en la cara principal */}
          <div className="card-front-info">
            <h4>{amiibo.name}</h4>
            <span>{amiibo.gameSeries}</span>
          </div>
        </div>

        {/* --- CAPA DE DETALLES (Overlay) --- */}
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