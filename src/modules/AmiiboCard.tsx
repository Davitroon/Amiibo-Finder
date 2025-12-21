import React from "react";
import "../styles/amiibo-card.css"; // Asegúrate de mover tus estilos CSS

interface Props {
	amiibo: any; // Usa la interfaz Amiibo completa si prefieres
	onClick: () => void;
}

const AmiiboCard: React.FC<Props> = ({ amiibo, onClick }) => {
	return (
		<article
			className="amiibo-card"
			onClick={onClick}
			role="button"
			title={`See details of ${amiibo.name}`}
		>
			<img src={amiibo.image} alt={amiibo.name} />
			<h3>{amiibo.name}</h3>
			<p>{amiibo.gameSeries}</p>
		</article>
	);
};

export default AmiiboCard;
