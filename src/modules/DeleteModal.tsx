import { useEffect, useRef } from "react";
import { createPortal } from "react-dom"; // <--- IMPORTANTE
import "../styles/modal.css";
import "../styles/modal-delete.css";

interface Props {
    setShowDeleteConfirm: (status: boolean) => void;
    handleConfirmDelete: () => void;
}

const DeleteModal = ({
    setShowDeleteConfirm,
    handleConfirmDelete,
}: Props) => {
    // Referencias para la trampa de foco
    const modalRef = useRef<HTMLDivElement>(null);
    const cancelBtnRef = useRef<HTMLButtonElement>(null);

    // 1. Bloquear Scroll del Body y gestionar tecla ESC
    useEffect(() => {
        // Bloquear scroll
        document.body.style.overflow = "hidden";

        // Mover foco al botón cancelar
        cancelBtnRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setShowDeleteConfirm(false);
            }
            
            // TRAMPA DE FOCO BÁSICA
            // Si presionamos TAB dentro del modal, hay que asegurar que no salga
            if (e.key === "Tab" && modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else { // Tab normal
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        // Limpieza al cerrar
        return () => {
            document.body.style.overflow = "auto"; // Restaurar scroll
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [setShowDeleteConfirm]);

    // Lógica visual del modal
    const modalContent = (
        <div 
            className="modal-overlay show"
            onClick={() => setShowDeleteConfirm(false)}
            // Z-Index muy alto para asegurar que tape todo
            style={{ zIndex: 9999 }} 
        >
            <div 
                ref={modalRef} // Referencia para la trampa de foco
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

    // 2. Renderizamos usando Portal en el document.body
    return createPortal(modalContent, document.body);
};

export default DeleteModal;