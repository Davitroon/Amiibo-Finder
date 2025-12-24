import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom"; // <--- 1. Importar Portal
import "../styles/modal.css";
import "../styles/modal-unlock.css";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    amiibo: any | null;
}

const ModalUnlocked: React.FC<Props> = ({ isOpen, onClose, amiibo }) => {
    // Referencias
    const modalRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    // Efecto: Foco, Scroll Lock y Teclado
    useEffect(() => {
        if (isOpen) {
            // 2. Bloquear Scroll del fondo
            document.body.style.overflow = "hidden";
            
            // 3. Foco inicial (con pequeño delay para asegurar renderizado)
            setTimeout(() => {
                closeBtnRef.current?.focus();
            }, 50);

            const handleKeyDown = (e: KeyboardEvent) => {
                // Cerrar con ESC
                if (e.key === "Escape") {
                    onClose();
                    return;
                }

                // 4. TRAMPA DE FOCO (Focus Trap)
                if (e.key === "Tab" && modalRef.current) {
                    const focusableElements = modalRef.current.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    
                    if (focusableElements.length === 0) return;

                    const firstElement = focusableElements[0] as HTMLElement;
                    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                    // Si Shift + Tab (hacia atrás)
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } 
                    // Si Tab normal (hacia adelante)
                    else {
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
        }
    }, [isOpen, onClose]);

    if (!isOpen || !amiibo) return null;

    // Contenido del modal
    const modalContent = (
        <div 
            className={`modal-overlay ${isOpen ? "show" : ""}`}
            onClick={onClose}
            style={{ zIndex: 9999 }} // Asegurar que esté encima de todo
        >
            <div 
                ref={modalRef} // Referencia para buscar elementos focusables
                className="modal-box unlock-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="unlock-title"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    ref={closeBtnRef} // Referencia para foco inicial
                    className="unlock-close-btn" 
                    onClick={onClose}
                    aria-label="Close modal"
                    type="button"
                    // Estilos inline para asegurar reset, o muévelos a tu CSS
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem'}} 
                >
                    &times;
                </button>

                <h3 className="unlock-subtitle">You unlocked...</h3>

                {/* aria-hidden en la imagen porque es redundante con el texto de abajo */}
                <img id="modal-img" src={amiibo.image} alt="" aria-hidden="true" />

                <h2 id="unlock-title" className="unlock-name">{amiibo.name}!</h2>

                <p className="unlock-series">{amiibo.gameSeries} Series</p>
            </div>
        </div>
    );

    // 5. Usar Portal al final del body
    return createPortal(modalContent, document.body);
};

export default ModalUnlocked;