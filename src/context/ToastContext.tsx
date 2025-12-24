import React, { createContext, useState, useContext, useCallback } from "react";
import "../styles/toast.css"; // Importamos los estilos

interface ToastContextType {
    showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = useCallback((message: string) => {
        setToastMessage(message);
        // La animación dura 3s, así que borramos el estado justo después
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            
            {/* Renderizamos el Toast aquí, "flotando" sobre toda la app */}
            {toastMessage && (
                <div role="status" aria-live="polite" className="toast">
                    {toastMessage}
                </div>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast debe usarse dentro de ToastProvider");
    return context;
};