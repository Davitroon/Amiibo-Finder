import React, { createContext, useState, useEffect, useContext } from "react";

/**
 * Represents the structure of an Amiibo object.
 * Contains API data and local user state (like isFavorite).
 */
export interface Amiibo {
    amiiboSeries: string;
    character: string;
    gameSeries: string;
    head: string;
    image: string;
    name: string;
    release: { au?: string; eu?: string; jp?: string; na?: string };
    tail: string;
    type?: string;
    unlockedAt?: string;
    isFavorite?: boolean;
}

/**
 * Defines the shape of the Context, including the state
 * and all the methods exposed to consumers.
 */
interface AmiiboContextType {
    userAmiibos: Amiibo[];
    unlockAmiibo: (amiibo: Amiibo) => void;
    clearStorage: () => void;
    toggleFavorite: (head: string) => void;
    importData: (data: Amiibo[]) => void;

    // Confetti State & Actions
    isConfettiActive: boolean;
    triggerConfetti: () => void;
    stopConfetti: () => void;
}

const AmiiboContext = createContext<AmiiboContextType | undefined>(undefined);

/**
 * Provider component that wraps the application.
 * Manages the user's Amiibo collection, persistence (LocalStorage),
 * and global UI states like the confetti effect.
 */
export const AmiiboProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [userAmiibos, setUserAmiibos] = useState<Amiibo[]>([]);
    const [isConfettiActive, setIsConfettiActive] = useState(false);

    // Initialize state from Local Storage on mount
    useEffect(() => {
        const stored = localStorage.getItem("amiiboFinderUserList");
        if (stored) {
            setUserAmiibos(JSON.parse(stored));
        }
    }, []);

    /**
     * Adds a newly unlocked Amiibo to the collection and saves to Local Storage.
     * @param amiibo - The Amiibo object to unlock.
     */
    const unlockAmiibo = (amiibo: Amiibo) => {
        const newList = [...userAmiibos, { ...amiibo, isFavorite: false }];
        setUserAmiibos(newList);
        localStorage.setItem("amiiboFinderUserList", JSON.stringify(newList));
    };

    /**
     * Toggles the favorite status of a specific Amiibo by its ID (head).
     * @param head - The unique identifier part of the Amiibo.
     */
    const toggleFavorite = (head: string) => {
        const updatedList = userAmiibos.map((amiibo) => {
            if (amiibo.head === head) {
                return { ...amiibo, isFavorite: !amiibo.isFavorite };
            }
            return amiibo;
        });

        setUserAmiibos(updatedList);
        localStorage.setItem("amiiboFinderUserList", JSON.stringify(updatedList));
    };

    /**
     * Overwrites the current collection with imported data.
     * @param data - The array of Amiibo objects to import.
     */
    const importData = (data: Amiibo[]) => {
        setUserAmiibos(data);
        localStorage.setItem("amiiboFinderUserList", JSON.stringify(data));
    };

    /**
     * Clears all user data from the state and Local Storage.
     */
    const clearStorage = () => {
        localStorage.removeItem("amiiboFinderUserList");
        setUserAmiibos([]);
    };

    const triggerConfetti = () => setIsConfettiActive(true);
    const stopConfetti = () => setIsConfettiActive(false);

    return (
        <AmiiboContext.Provider
            value={{
                userAmiibos,
                unlockAmiibo,
                clearStorage,
                toggleFavorite,
                importData,
                isConfettiActive,
                triggerConfetti,
                stopConfetti,
            }}
        >
            {children}
        </AmiiboContext.Provider>
    );
};

/**
 * Custom hook to consume the AmiiboContext.
 * @returns The context value containing state and actions.
 * @throws Error if used outside of an AmiiboProvider.
 */
export const useAmiibo = () => {
    const context = useContext(AmiiboContext);
    if (!context)
        throw new Error("useAmiibo must be used within an AmiiboProvider");
    return context;
};