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

	const handleFavorite = (e: React.MouseEvent) => {
		e.stopPropagation();
		toggleFavorite(amiibo.head);
	};

	const favoriteLabel = amiibo.isFavorite
		? `Remove ${amiibo.name} from favorites`
		: `Add ${amiibo.name} to favorites`;

	return (
		<div
			className={`amiibo-card-container ${showDetails ? "details-active" : ""}`}
			onClick={() => setShowDetails(!showDetails)}
			title={showDetails ? `Close details` : `See details for ${amiibo.name}`} // Título actualizado
			tabIndex={0}
			role="button"
			// Usamos aria-expanded para indicar que esto despliega info
			aria-expanded={showDetails}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					setShowDetails(!showDetails);
				}
			}}
		>
			<button
				className={`favorite-btn ${amiibo.isFavorite ? "active" : ""}`}
				onClick={handleFavorite}
				onKeyDown={(e) => e.stopPropagation()} // Tu fix anterior
				aria-label={favoriteLabel}
				title={favoriteLabel}
			>
				<IoBookmark />
			</button>

			{/* --- CAPA DE IMAGEN (FRONTAL) --- */}
			{/* ACCESIBILIDAD:
          Si los detalles están abiertos (showDetails = true), ocultamos la cara frontal 
          al lector de pantalla con aria-hidden={true}.
      */}
			<div className="card-image-layer" aria-hidden={showDetails}>
				<img src={amiibo.image} alt="" />{" "}
				{/* alt vacío es mejor si el nombre está abajo */}
				<div className="card-front-info">
					<h4>{amiibo.name}</h4>
					<span>{amiibo.gameSeries}</span>
				</div>
			</div>

			{/* --- CAPA DE DETALLES (TRASERA) --- */}
			{/* ACCESIBILIDAD:
          Si los detalles NO están abiertos (!showDetails), ocultamos esta capa 
          al lector de pantalla.
      */}
			<div className="card-info-layer" aria-hidden={!showDetails}>
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

				{/* aria-hidden aquí porque es una pista visual solo */}
				<small className="tap-hint" aria-hidden="true">
					Tap to close
				</small>
			</div>
		</div>
	);
};

export default AmiiboCard;
