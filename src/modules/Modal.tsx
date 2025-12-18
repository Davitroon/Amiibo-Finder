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
        {amiibo.type && <p>Type: {amiibo.type}</p>}
        {amiibo.release?.eu && <p>Release (EU): {amiibo.release.eu}</p>}
        {/* Puedes agregar más detalles si los tienes */}
      </div>
    </div>
  );
};

export default Modal;