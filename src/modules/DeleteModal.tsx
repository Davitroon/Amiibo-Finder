import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "../styles/modal.css";
import "../styles/modal-delete.css";

/**
 * Props interface for the DeleteModal component.
 */
interface Props {
    /** Function to control the visibility of the modal. */
    setShowDeleteConfirm: (status: boolean) => void;
    /** Callback function to execute when the user confirms the deletion. */
    handleConfirmDelete: () => void;
}

/**
 * A modal component designed for confirming destructive actions.
 * * Accessibility Features:
 * - Uses `createPortal` to render at the document body level (avoiding z-index clipping).
 * - Implements a "Focus Trap" to keep keyboard navigation inside the modal.
 * - Locks body scroll when open.
 * - Closes on 'Escape' key press.
 * - Uses appropriate ARIA roles (`alertdialog`).
 */
const DeleteModal = ({
    setShowDeleteConfirm,
    handleConfirmDelete,
}: Props) => {
    // Refs for focus management
    const modalRef = useRef<HTMLDivElement>(null);
    const cancelBtnRef = useRef<HTMLButtonElement>(null);

    // Effect: Handle Body Scroll Lock & Keyboard Events
    useEffect(() => {
        // 1. Lock body scroll to prevent background scrolling
        document.body.style.overflow = "hidden";

        // 2. Set initial focus to the "Cancel" button for safety
        cancelBtnRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            // Close on Escape key
            if (e.key === "Escape") {
                setShowDeleteConfirm(false);
            }
            
            // --- FOCUS TRAP LOGIC ---
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
    }, [setShowDeleteConfirm]);

    // Modal UI Content
    const modalContent = (
        <div 
            className="modal-overlay show"
            onClick={() => setShowDeleteConfirm(false)}
            // High Z-Index to ensure it sits on top of everything
            style={{ zIndex: 9999 }} 
        >
            <div 
                ref={modalRef} // Ref needed for the Focus Trap
                className="modal-box delete-content"
                role="alertdialog" 
                aria-modal="true" 
                aria-labelledby="delete-title" 
                aria-describedby="delete-desc"
                onClick={(e) => e.stopPropagation()} 
            >
                <h3 id="delete-title" className="delete-title">Are you sure?</h3>
                
                <p id="delete-desc">
                    You're about to delete your entire Amiibo collection. This action
                    can't be undone.
                </p>

                <div className="delete-actions">
                    <button
                        ref={cancelBtnRef}
                        onClick={() => setShowDeleteConfirm(false)}
                        className="modal-btn cancel"
                        type="button"
                    >
                        Cancel
                    </button>

                    <button 
                        onClick={handleConfirmDelete} 
                        className="modal-btn delete"
                        type="button"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );

    // Render using a Portal attached to document.body
    return createPortal(modalContent, document.body);
};

export default DeleteModal;