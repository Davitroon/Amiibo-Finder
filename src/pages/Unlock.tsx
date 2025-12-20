import { useState } from "react";
import { useAmiibos } from "../context/AmiiboContext";
// CAMBIO: Importamos el nuevo ModalUnlocked
import ModalUnlocked from "../modules/ModalUnlocked";
import "../styles/unlock.css";

import giftClosed from "../assets/gift-closed.png";
import giftOpen from "../assets/gift-open.png";

const Unlock = () => {
	const { unlockAmiibo } = useAmiibos();
	const [unlockedAmiibo, setUnlockedAmiibo] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isBoxOpen, setIsBoxOpen] = useState(false);

	// ... (Mantén la función preloadImage igual) ...
	const preloadImage = (src: string) => {
		return new Promise((resolve) => {
			const img = new Image();
			img.src = src;
			img.onload = resolve;
			img.onerror = resolve;
		});
	};

	// ... (Mantén la función handleUnlock igual) ...
	const handleUnlock = async () => {
		if (isLoading || isBoxOpen) return;

		setIsLoading(true);
		setIsBoxOpen(true);

		let fullList = [];
		const storedList = localStorage.getItem("amiiboFinderFullList");

		try {
			if (storedList) {
				fullList = JSON.parse(storedList);
			} else {
				const res = await fetch(
					"https://amiiboapi.com/api/amiibo/?page=1&type=figure"
				);
				const json = await res.json();
				fullList = json.amiibo;
				localStorage.setItem("amiiboFinderFullList", JSON.stringify(fullList));
			}
		} catch (error) {
			console.error("Error fetching amiibos", error);
			setIsLoading(false);
			setIsBoxOpen(false);
			return;
		}

		if (fullList.length > 0) {
			const random = fullList[Math.floor(Math.random() * fullList.length)];

			// Promesa A: Animación
			const animationDelay = new Promise((resolve) => setTimeout(resolve, 800));
			// Promesa B: Carga de imagen
			const imageLoad = preloadImage(random.image);

			await Promise.all([animationDelay, imageLoad]);

			unlockAmiibo(random);
			setUnlockedAmiibo(random);
			setIsLoading(false);
		} else {
			setIsLoading(false);
			setIsBoxOpen(false);
		}
	};

	const handleCloseModal = () => {
		setUnlockedAmiibo(null);
		setIsBoxOpen(false);
	};

	return (
		<div className="unlock-container">
			<h2>Unlock new Amiibos</h2>
			<hr />

			<div className="gift-stage">
				<div
					className={`gift-box ${isLoading ? "opening" : ""}`}
					onClick={handleUnlock}
					title="Click to open!"
				>
					<img
						src={isBoxOpen ? giftOpen : giftClosed}
						alt="Mystery Gift"
						className={`${isBoxOpen ? "gift-open" : "gift-closed"} ${
							!isBoxOpen ? "wobble-anim" : "pop-anim"
						}`}
					/>

					<p className="gift-text">
						{isLoading ? "Opening..." : "Tap the gift!"}
					</p>
				</div>		
			</div>

			{/* CAMBIO: Usamos ModalUnlocked en lugar de Modal */}
			<ModalUnlocked
				isOpen={!!unlockedAmiibo}
				onClose={handleCloseModal}
				amiibo={unlockedAmiibo}
			/>
		</div>
	);
};

export default Unlock;
