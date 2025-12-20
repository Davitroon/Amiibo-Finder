import ModalUnlocked from "../modules/ModalUnlocked";
import GiftBox from "../modules/GiftBox"; // Importamos el componente visual
import { useUnlockLogic } from "../hooks/useUnlockLogic"; // Importamos la lógica
import "../styles/unlock.css";

const Unlock = () => {
	const {
		unlockedAmiibo,
		isLoading,
		isOpeningAnim,
		remainingTime,
		isLocked,
		handleUnlock,
		closeModal,
		formatTime,
	} = useUnlockLogic();

	return (
		<div className="unlock-container">
			<h2>Unlock new Amiibos</h2>
			<hr />

			{/* Componente que maneja el regalo y el timer */}
			<GiftBox
				isLoading={isLoading}
				isLocked={isLocked}
				isOpeningAnim={isOpeningAnim}
				remainingTime={remainingTime}
				formatTime={formatTime}
				onUnlock={handleUnlock}
			/>

			{/* Componente del Modal */}
			<ModalUnlocked
				isOpen={!!unlockedAmiibo}
				onClose={closeModal}
				amiibo={unlockedAmiibo}
			/>
		</div>
	);
};

export default Unlock;
