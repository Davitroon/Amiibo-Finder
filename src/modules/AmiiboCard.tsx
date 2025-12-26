import React, { useState } from "react";
import { useAmiibo } from "../context/AmiiboContext";
import { IoBookmark } from "react-icons/io5";
import "../styles/amiibo-card.css";

interface Props {
	/** The Amiibo data object containing name, image, series, and status. */
	amiibo: any;
}

/**
 * Interactive card component representing a single Amiibo.
 * Features:
 * - Click/Enter to toggle details (flip effect).
 * - Separate favorite button with event bubbling prevention.
 * - ARIA attributes for full screen reader accessibility.
 */
const AmiiboCard: React.FC<Props> = ({ amiibo }) => {
	const { toggleFavorite } = useAmiibo();
	const [showDetails, setShowDetails] = useState(false);

	/**
	 * Helper to determine the release date string based on region availability.
	 */
	const getReleaseDate = () => {
		if (!amiibo.release) return "N/A";
		return (
			amiibo.release.eu || amiibo.release.na || amiibo.release.jp || "Unknown"
		);
	};

	/**
	 * Handles the favorite toggle action.
	 * Stops propagation to prevent the card from flipping when clicking the heart.
	 */
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
			title={showDetails ? `Close details` : `See details for ${amiibo.name}`}
			tabIndex={0}
			role="button"
			// Indicates to screen readers if the "expandable" content is currently visible
			aria-expanded={showDetails}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					setShowDetails(!showDetails);
				}
			}}
		>
			{/* Favorite Button
              Placed here visually but logic ensures it doesn't trigger the parent click.
            */}

			<button
				className={`favorite-btn ${amiibo.isFavorite ? "active" : ""}`}
				onClick={handleFavorite}
				onKeyDown={(e) => e.stopPropagation()} // Prevents "Enter" from bubbling up and flipping the card
				aria-label={favoriteLabel}
				title={favoriteLabel}
			>
				<IoBookmark />
			</button>

			{/* --- FRONT LAYER (IMAGE) --- */}
			{/* Accessibility: When details are shown, hide this layer from screen readers
               to prevent reading overlapping content.
            */}
			<div className="card-image-layer" aria-hidden={showDetails}>
				<img src={amiibo.image} alt="" />{" "}
				{/* Empty alt because the name is rendered immediately below as text */}
				<div className="card-front-info">
					<h4>{amiibo.name}</h4>
					<span>{amiibo.gameSeries}</span>
				</div>
			</div>

			{/* --- BACK LAYER (DETAILS) --- */}
			{/* Accessibility: When details are closed, hide this layer from screen readers.
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

				{/* Hidden from screen readers as it is a visual-only hint */}
				<small className="tap-hint" aria-hidden="true">
					Tap to close
				</small>
			</div>
		</div>
	);
};

export default AmiiboCard;
