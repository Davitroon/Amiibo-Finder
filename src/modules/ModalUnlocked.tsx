import React from 'react';
import '../styles/modal.css'; // Reutilizamos los estilos y la animación

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amiibo: any | null;
}

const ModalUnlocked: React.FC<Props> = ({ isOpen, onClose, amiibo }) => {
  // Si no hay datos o no está abierto, no renderizamos nada
  if (!isOpen || !amiibo) return null;

  return (
    // La clase "modal show" asegura que se ejecute la animación de entrada
    <div className="modal show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        
        {/* Botón de cerrar */}
        <span className="close" onClick={onClose}>&times;</span>

        {/* Header especial */}
        <h3 style={{ color: '#666', marginBottom: '5px', fontSize: '1rem' }}>
            You unlocked...
        </h3>

        {/* Imagen */}
        <img id="modal-img" src={amiibo.image} alt={amiibo.name} />

        {/* Nombre del Amiibo */}
        <h2 style={{ margin: '15px 0 5px', color: '#E60012' }}>
            {amiibo.name}!
        </h2>

        {/* Serie del Amiibo */}
        <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#555' }}>
            {amiibo.gameSeries} Series
        </p>

      </div>
    </div>
  );
};

export default ModalUnlocked;