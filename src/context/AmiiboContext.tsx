import React, { createContext, useState, useEffect, useContext } from "react";

// Tipos
interface Amiibo {
	amiiboSeries: string;
	character: string;
	gameSeries: string;
	head: string;
	image: string;
	name: string;
	release: { au?: string; eu?: string; jp?: string; na?: string };
	tail: string;
	type?: string; // Lo hago opcional porque a veces lo borramos
	unlockedAt?: string; // Añadido opcionalmente por si lo usas
}

interface AmiiboContextType {
	userAmiibos: Amiibo[];
	unlockAmiibo: (amiibo: Amiibo) => void;
	clearStorage: () => void;
	// --- NUEVO: Propiedades para el Confeti ---
	isConfettiActive: boolean;
	triggerConfetti: () => void;
	stopConfetti: () => void;
}

const AmiiboContext = createContext<AmiiboContextType | undefined>(undefined);

export const AmiiboProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [userAmiibos, setUserAmiibos] = useState<Amiibo[]>([]);

	// NUEVO: Estado para controlar el confeti globalmente
	const [isConfettiActive, setIsConfettiActive] = useState(false);

	// Cargar desde localStorage al iniciar
	useEffect(() => {
		const stored = localStorage.getItem("amiiboFinderUserList");
		if (stored) {
			setUserAmiibos(JSON.parse(stored));
		}
	}, []);

	// Función para desbloquear uno nuevo
	const unlockAmiibo = (amiibo: Amiibo) => {
		const newList = [...userAmiibos, amiibo];
		setUserAmiibos(newList);
		localStorage.setItem("amiiboFinderUserList", JSON.stringify(newList));
	};

	// Función para borrar datos
	const clearStorage = () => {
		localStorage.removeItem("amiiboFinderUserList");
		setUserAmiibos([]);
	};

	// NUEVO: Funciones para controlar el confeti
	const triggerConfetti = () => setIsConfettiActive(true);
	const stopConfetti = () => setIsConfettiActive(false);

	return (
		<AmiiboContext.Provider
			value={{
				userAmiibos,
				unlockAmiibo,
				clearStorage,
				// Exportamos las cosas del confeti
				isConfettiActive,
				triggerConfetti,
				stopConfetti,
			}}
		>
			{children}
		</AmiiboContext.Provider>
	);
};

export const useAmiibos = () => {
	const context = useContext(AmiiboContext);
	if (!context)
		throw new Error("useAmiibos debe usarse dentro de AmiiboProvider");
	return context;
};
