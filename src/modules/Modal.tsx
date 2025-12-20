import React from 'react';
import '../styles/modal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amiibo: any | null;
}

const Modal: React.FC<Props> = ({ isOpen, onClose, amiibo }) => {
  if (!isOpen || !amiibo) return null;

  return (
    <div className="modal show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <img id="modal-img" src={amiibo.image} alt={amiibo.name} />
        
        <h2>{amiibo.name}</h2>
        <p>Serie: {amiibo.gameSeries}</p>
        
        {/* CAMBIO: Eliminado el Type y añadida la fecha */}
        {amiibo.unlockedAt && (
            <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#888' }}>
                Unlocked: <strong>{amiibo.unlockedAt}</strong>
            </p>
        )}

        {amiibo.release?.eu && <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Release (EU): {amiibo.release.eu}</p>}
      </div>
    </div>
  );
};

export default Modal;