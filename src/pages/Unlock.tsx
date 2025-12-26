import ModalUnlocked from "../modules/ModalUnlocked";
import GiftBox from "../modules/GiftBox";
import { useUnlockLogic } from "../logic/useUnlockLogic";
import "../styles/unlock.css";

/**
 * Unlock Page Component.
 * Displays the interactive "Mystery Gift" box allowing users to unlock new random Amiibos.
 * It manages the view layer while delegating business logic (timers, API calls) to the `useUnlockLogic` hook.
 */
const Unlock = () => {
    // Destructure state and handlers from the custom logic hook
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

            {/* Interactive Gift Box Component */}
            <GiftBox
                isLoading={isLoading}
                isLocked={isLocked}
                isOpeningAnim={isOpeningAnim}
                remainingTime={remainingTime}
                formatTime={formatTime}
                onUnlock={handleUnlock}
            />

            {/* Success Modal (appears when an Amiibo is successfully unlocked) */}
            <ModalUnlocked
                isOpen={!!unlockedAmiibo} // Converts the object existence to a boolean
                onClose={closeModal}
                amiibo={unlockedAmiibo}
            />
        </>
    );
};

export default Unlock;