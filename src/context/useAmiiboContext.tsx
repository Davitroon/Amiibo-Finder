import React, { createContext, useState, useEffect, useContext } from "react";

// Tipos
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

interface AmiiboContextType {
    userAmiibos: Amiibo[];
    unlockAmiibo: (amiibo: Amiibo) => void;
    clearStorage: () => void;
    toggleFavorite: (head: string) => void;
    // NUEVO: Función para importar datos
    importData: (data: Amiibo[]) => void;

    // Confeti
    isConfettiActive: boolean;
    triggerConfetti: () => void;
    stopConfetti: () => void;
}

const AmiiboContext = createContext<AmiiboContextType | undefined>(undefined);

export const AmiiboProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [userAmiibos, setUserAmiibos] = useState<Amiibo[]>([]);
    const [isConfettiActive, setIsConfettiActive] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("amiiboFinderUserList");
        if (stored) {
            setUserAmiibos(JSON.parse(stored));
        }
    }, []);

    const unlockAmiibo = (amiibo: Amiibo) => {
        const newList = [...userAmiibos, { ...amiibo, isFavorite: false }];
        setUserAmiibos(newList);
        localStorage.setItem("amiiboFinderUserList", JSON.stringify(newList));
    };

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

    // NUEVO: Función para sobrescribir datos (Importar JSON)
    const importData = (data: Amiibo[]) => {
        setUserAmiibos(data);
        localStorage.setItem("amiiboFinderUserList", JSON.stringify(data));
    };

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
                importData, // Exportamos la función
                isConfettiActive,
                triggerConfetti,
                stopConfetti,
            }}
        >
            {children}
        </AmiiboContext.Provider>
    );
};

export const useAmiiboContext = () => {
    const context = useContext(AmiiboContext);
    if (!context)
        throw new Error("useAmiiboContext debe usarse dentro de AmiiboProvider");
    return context;
};