import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom"; // Essential for rendering outside the current DOM hierarchy
import "../styles/modal.css";
import "../styles/modal-unlock.css";

/**
 * Props definition for the ModalUnlocked component.
 */
interface Props {
    /** Controls the visibility of the modal. */
    isOpen: boolean;
    /** Callback function to close the modal. */
    onClose: () => void;
    /** The Amiibo data to display in the modal. */
    amiibo: any | null;
}

/**
 * A modal component that displays the newly unlocked Amiibo.
 * * Accessibility Features:
 * - Uses `createPortal` to render at the document body level.
 * - Implements a "Focus Trap" to keep keyboard navigation inside the modal.
 * - Locks body scroll when open.
 * - Closes on 'Escape' key press.
 * - Manages initial focus on the close button.
 */
const ModalUnlocked: React.FC<Props> = ({ isOpen, onClose, amiibo }) => {
    // Refs for focus management
    const modalRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    // Effect: Handle Body Scroll Lock, Initial Focus, and Keyboard Events
    useEffect(() => {
        if (isOpen) {
            // 1. Lock body scroll to prevent background scrolling
            document.body.style.overflow = "hidden";
            
            // 2. Set initial focus to the close button (with a small delay for rendering)
            setTimeout(() => {
                closeBtnRef.current?.focus();
            }, 50);

            const handleKeyDown = (e: KeyboardEvent) => {
                // Close on Escape key
                if (e.key === "Escape") {
                    onClose();
                    return;
                }

                // 3. FOCUS TRAP LOGIC
                // If Tab is pressed, ensure focus remains strictly within the modal
                if (e.key === "Tab" && modalRef.current) {
                    const focusableElements = modalRef.current.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    
                    if (focusableElements.length === 0) return;

                    const firstElement = focusableElements[0] as HTMLElement;
                    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                    // Shift + Tab (Moving backwards)
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } 
                    // Tab (Moving forwards)
                    else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            };

            document.addEventListener("keydown", handleKeyDown);
            
            // Cleanup: Restore scroll and remove listeners
            return () => {
                document.body.style.overflow = "auto";
                document.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen || !amiibo) return null;

    // Modal UI Content
    const modalContent = (
        <div 
            className={`modal-overlay ${isOpen ? "show" : ""}`}
            onClick={onClose}
            // High Z-Index to ensure it sits on top of everything
            style={{ zIndex: 9999 }} 
        >
            <div 
                ref={modalRef} // Ref needed for the Focus Trap
                className="modal-box unlock-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="unlock-title"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    ref={closeBtnRef} // Ref for initial focus
                    className="unlock-close-btn" 
                    onClick={onClose}
                    aria-label="Close modal"
                    type="button"
                    // Inline styles to reset default button appearance (or move to CSS)
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem'}} 
                >
                    &times;
                </button>

                <h3 className="unlock-subtitle">You unlocked...</h3>

                {/* aria-hidden="true" because the image is redundant with the text below */}
                <img id="modal-img" src={amiibo.image} alt="" aria-hidden="true" />

                <h2 id="unlock-title" className="unlock-name">{amiibo.name}!</h2>

                <p className="unlock-series">{amiibo.gameSeries} Series</p>
            </div>
        </div>
    );

    // 4. Render using a Portal attached to document.body
    return createPortal(modalContent, document.body);
};

export default ModalUnlocked;