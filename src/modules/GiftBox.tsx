import React from "react";
import giftClosed from "../assets/gift-closed.png";
import giftOpen from "../assets/gift-open.png";

interface GiftBoxProps {
	isLoading: boolean;
	isLocked: boolean;
	isOpeningAnim: boolean;
	remainingTime: number;
	formatTime: (ms: number) => string;
	onUnlock: () => void;
}

const GiftBox: React.FC<GiftBoxProps> = ({
	isLoading,
	isLocked,
	isOpeningAnim,
	remainingTime,
	formatTime,
	onUnlock,
}) => {
	// Lógica visual
	const showOpenImage = isOpeningAnim || isLocked;

	// Cálculo de clases CSS
	let boxClass = "gift-box";
	let imgClass = "gift-image"; // Usamos una clase base, o vacía si prefieres

	if (isLoading) {
		boxClass += " opening";
		imgClass += " pop-anim";
	} else if (isLocked) {
		boxClass += " locked";
	} else {
		imgClass += " wobble-anim";
	}

	// Nota: en tu CSS original usabas .gift-open y .gift-closed para tamaños
	const sizeClass = showOpenImage ? "gift-open" : "gift-closed";

	return (
		<div className="gift-stage">
			<div
				className={boxClass}
				onClick={onUnlock}
				title={
					isLocked
						? "You have to wait to unlock a new Amiibo!"
						: "Click to unlock a new Amiibo!"
				}
			>
				{/* TEMPORIZADOR */}
				<div className={`timer-display ${isLocked ? "visible" : ""}`}>
					{isLocked ? formatTime(remainingTime) : "Ready!"}
				</div>

				<img
					src={showOpenImage ? giftOpen : giftClosed}
					alt="Mystery Gift"
					className={`${sizeClass} ${imgClass}`}
				/>

				<p className="gift-text">
					{isLoading
						? "Opening..."
						: isLocked
						? "Come back later!"
						: "Amiibo available!"}
				</p>
			</div>
		</div>
	);
};

export default GiftBox;
