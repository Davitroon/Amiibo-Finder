import { useState, useEffect } from "react";
import Confetti from "react-confetti";
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
        showConfetti, // Extraemos el nuevo estado
        handleConfettiComplete, // Extraemos el handler
        handleUnlock,
        closeModal,
        formatTime,
    } = useUnlockLogic();

    // Lógica para el tamaño de la ventana
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="unlock-container">
            {/* CAMBIO: Usamos 'showConfetti' en lugar de '!!unlockedAmiibo'.
                Esto permite que el confeti siga existiendo aunque el modal se cierre.
                Cuando 'recycle={false}' termina todas las partículas, 
                llama a 'onConfettiComplete' y desmontamos el componente limpiamente.
            */}
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false} 
                    numberOfPieces={400}
                    gravity={0.15}
                    onConfettiComplete={handleConfettiComplete}
                />
            )}

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
        </div>
    );
};

export default Unlock;