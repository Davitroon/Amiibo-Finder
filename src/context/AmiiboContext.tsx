import React, { createContext, useState, useEffect, useContext } from "react";

// Tipos (basados en tu código original)
interface Amiibo {
	amiiboSeries: string;
	character: string;
	gameSeries: string;
	head: string;
	image: string;
	name: string;
	release: { au?: string; eu?: string; jp?: string; na?: string };
	tail: string;
	type: string;
}

interface AmiiboContextType {
	userAmiibos: Amiibo[];
	unlockAmiibo: (amiibo: Amiibo) => void;
	clearStorage: () => void;
}

const AmiiboContext = createContext<AmiiboContextType | undefined>(undefined);

export const AmiiboProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [userAmiibos, setUserAmiibos] = useState<Amiibo[]>([]);

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
		localStorage.removeItem("amiiboFinderFullList");
		setUserAmiibos([]);
	};

	return (
		<AmiiboContext.Provider value={{ userAmiibos, unlockAmiibo, clearStorage }}>
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
