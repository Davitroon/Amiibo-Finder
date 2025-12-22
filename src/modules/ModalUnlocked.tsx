import React from "react";
import "../styles/modal.css";
import "../styles/modal-unlock.css"; // Reutilizamos los estilos y la animación

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
		<div className={`modal-overlay ${isOpen ? "show" : ""}`}>
			{/* Añadimos 'modal-box' (base) y 'unlock-content' (específico) */}
			<div className="modal-box unlock-content">
				<span className="unlock-close-btn" onClick={onClose}>
					&times;
				</span>

				{/* Header especial */}
				<h3 className="unlock-subtitle">You unlocked...</h3>

				{/* Imagen */}
				<img id="modal-img" src={amiibo.image} alt={amiibo.name} />

				{/* Nombre del Amiibo */}
				<h2 className="unlock-name">{amiibo.name}!</h2>

				{/* Serie del Amiibo */}
				<p className="unlock-series">{amiibo.gameSeries} Series</p>
			</div>
		</div>
	);
};

export default ModalUnlocked;
