import React from "react";
import giftClosed from "../assets/gift-closed.png";
import giftOpen from "../assets/gift-open.png";

/**
 * Props definition for the GiftBox component.
 */
interface GiftBoxProps {
    /** Indicates if the unlock API request is currently in progress. */
    isLoading: boolean;
    /** Indicates if the gift is locked due to the cooldown timer. */
    isLocked: boolean;
    /** Indicates if the opening animation is currently playing. */
    isOpeningAnim: boolean;
    /** The remaining cooldown time in milliseconds. */
    remainingTime: number;
    /** Utility function to format milliseconds into a "HH:MM:SS" string. */
    formatTime: (ms: number) => string;
    /** Callback function triggered when the user attempts to open the gift. */
    onUnlock: () => void;
}

/**
 * A highly interactive component representing a Mystery Gift Box.
 * * Accessibility Features:
 * - Uses a semantic `<button>` for keyboard focus and interaction.
 * - Dynamic `aria-label` to describe the exact state (Locked/Ready/Opening).
 * - `aria-live` region to announce status changes to screen readers.
 * - Respects the `disabled` state when locked or loading.
 */
const GiftBox: React.FC<GiftBoxProps> = ({
    isLoading,
    isLocked,
    isOpeningAnim,
    remainingTime,
    formatTime,
    onUnlock,
}) => {
    // Visual state logic
    const showOpenImage = isOpeningAnim || isLocked;

    // Descriptive text for screen readers (Dynamic ARIA Label)
    const statusText = isLoading
        ? "Opening gift..."
        : isLocked
        ? `Locked. Wait ${formatTime(remainingTime)}`
        : "Gift ready! Click to open.";

    // CSS Class calculation
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
            {/* Main interactive element.
                Using a <button> ensures native keyboard navigation (Tab/Enter/Space).
            */}
            <button
                type="button"
                className={boxClass}
                onClick={onUnlock}
                disabled={isLocked || isLoading}
                aria-label={statusText}
            >
                {/* TIMER DISPLAY */}
                {/* Hidden from screen readers because the info is already in the button's aria-label */}
                <div className={`timer-display ${isLocked ? "visible" : ""}`} aria-hidden="true">
                    {isLocked ? formatTime(remainingTime) : "Ready!"}
                </div>

                <img
                    src={showOpenImage ? giftOpen : giftClosed}
                    alt="" // Empty alt because the button wrapper already describes the action
                    className={`gift ${imgClass}`}
                />

                {/* STATUS TEXT (Live Region) */}
                {/* aria-live="polite" ensures updates (like "Wait" -> "Available") are announced */}
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