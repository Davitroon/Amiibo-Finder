import ModalUnlocked from "../modules/ModalUnlocked";
import GiftBox from "../modules/GiftBox";
import { useUnlockLogic } from "../hooks/useUnlockLogic";
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
        <>
            <h2>Unlock new Amiibos</h2>
            <hr />

            <GiftBox
                isLoading={isLoading}
                isLocked={isLocked}
                isOpeningAnim={isOpeningAnim}
                remainingTime={remainingTime}
                formatTime={formatTime}
                onUnlock={handleUnlock}
            />

            <ModalUnlocked
                isOpen={!!unlockedAmiibo}
                onClose={closeModal}
                amiibo={unlockedAmiibo}
            />
        </>
    );
};

export default Unlock;