import React, { createContext, useState, useContext, useCallback } from "react";
import "../styles/toast.css";

/**
 * Defines the shape of the Toast Context.
 * Provides a function to trigger a toast notification.
 */
interface ToastContextType {
    showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Provider component that manages the global state for toast notifications.
 * It renders the toast component at the root level, allowing it to float over the application.
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    /**
     * Triggers a toast notification with the specified message.
     * The message automatically disappears after 3 seconds.
     * @param message - The text to display in the toast.
     */
    const showToast = useCallback((message: string) => {
        setToastMessage(message);
        // The animation lasts 3s, so we clear the state right after to match it
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            
            {/* Render the Toast here, "floating" over the entire app */}
            {toastMessage && (
                <div role="status" aria-live="polite" className="toast">
                    {toastMessage}
                </div>
            )}
        </ToastContext.Provider>
    );
};

/**
 * Custom hook to consume the ToastContext.
 * @returns The context value containing the showToast function.
 * @throws Error if used outside of a ToastProvider.
 */
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
};