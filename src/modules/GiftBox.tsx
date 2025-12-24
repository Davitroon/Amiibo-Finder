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
    const showOpenImage = isOpeningAnim || isLocked;
    
    // Texto descriptivo para lectores de pantalla
    const statusText = isLoading 
        ? "Opening gift..." 
        : isLocked 
        ? `Locked. Wait ${formatTime(remainingTime)}` 
        : "Gift ready! Click to open.";

    // Clases CSS (igual que antes)
    let boxClass = "gift-box";
    let imgClass = "gift-image";

    if (isLoading) {
        boxClass += " opening";
        imgClass += " pop-anim";
    } else if (isLocked) {
        boxClass += " locked";
    } else {
        imgClass += " wobble-anim";
    }

    return (
        <div className="gift-stage">
            {/* CAMBIO 1: Usar <button> en lugar de <div> 
               Esto arregla la navegación por teclado y semántica automáticamente.
            */}
            <button
                type="button"
                className={boxClass}
                onClick={onUnlock}
                // Si está bloqueado o cargando, deshabilitamos la interacción real
                disabled={isLocked || isLoading}
                // Etiqueta aria para describir la acción exacta al lector de pantalla
                aria-label={statusText}
            >
                {/* TEMPORIZADOR */}
                {/* aria-hidden porque ya lo decimos en el aria-label del botón */}
                <div className={`timer-display ${isLocked ? "visible" : ""}`} aria-hidden="true">
                    {isLocked ? formatTime(remainingTime) : "Ready!"}
                </div>

                <img
                    src={showOpenImage ? giftOpen : giftClosed}
                    alt="" // Alt vacío porque es decorativo (el botón ya describe la acción)
                    className={`gift ${imgClass}`}
                />

                {/* CAMBIO 2: Live Region 
                   aria-live="polite" anuncia cambios de texto (ej. de "Wait" a "Available")
                */}
                <p className="gift-text" aria-live="polite">
                    {isLoading
                        ? "Opening..."
                        : isLocked
                        ? "Come back later!"
                        : "Amiibo available!"}
                </p>
            </button>
        </div>
    );
};

export default GiftBox;