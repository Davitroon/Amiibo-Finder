import React, { createContext, useState, useEffect, useContext } from "react";

/**
 * Represents the structure of an Amiibo object.
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
 * Defines the shape of the Context.
 * Includes state access and methods for data manipulation.
 */
interface AmiiboContextType {
	userAmiibos: Amiibo[];
	unlockAmiibo: (amiibo: Amiibo) => void;
	toggleFavorite: (head: string) => void;
	clearStorage: () => void;

	// Data Management Methods (Import/Export)
	exportCollection: () => boolean;
	importFromFile: (file: File) => Promise<boolean>;

	// Confetti State
	isConfettiActive: boolean;
	triggerConfetti: () => void;
	stopConfetti: () => void;
}

const AmiiboContext = createContext<AmiiboContextType | undefined>(undefined);

/**
 * Provider component.
 * Centralizes all business logic, data persistence, and file handling.
 */
export const AmiiboProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [userAmiibos, setUserAmiibos] = useState<Amiibo[]>([]);
	const [isConfettiActive, setIsConfettiActive] = useState(false);

	// Load from Local Storage on mount
	useEffect(() => {
		const stored = localStorage.getItem("amiiboFinderUserList");
		if (stored) {
			setUserAmiibos(JSON.parse(stored));
		}
	}, []);

	/**
	 * Internal helper to update both State and LocalStorage simultaneously.
	 * Prevents desynchronization.
	 */
	const saveToStorage = (list: Amiibo[]) => {
		setUserAmiibos(list);
		localStorage.setItem("amiiboFinderUserList", JSON.stringify(list));
	};

	/**
	 * Adds a new Amiibo to the collection.
	 */
	const unlockAmiibo = (amiibo: Amiibo) => {
		const newList = [...userAmiibos, { ...amiibo, isFavorite: false }];
		saveToStorage(newList);
	};

	/**
	 * Toggles the favorite status of a specific Amiibo.
	 */
	const toggleFavorite = (head: string) => {
		const updatedList = userAmiibos.map((amiibo) => {
			if (amiibo.head === head) {
				return { ...amiibo, isFavorite: !amiibo.isFavorite };
			}
			return amiibo;
		});
		saveToStorage(updatedList);
	};

	/**
	 * Wipes all data from memory and storage.
	 */
	const clearStorage = () => {
		localStorage.removeItem("amiiboFinderUserList");
		setUserAmiibos([]);
	};

	/**
	 * Logic to export data to a JSON file.
	 * Handles Blob creation and DOM anchor manipulation.
	 * @returns {boolean} True if export started, false if no data to export.
	 */
	const exportCollection = (): boolean => {
		if (userAmiibos.length === 0) return false;

		const dataStr = JSON.stringify(userAmiibos, null, 2);
		const blob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = `amiibo-collection-${new Date()
			.toISOString()
			.slice(0, 10)}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		return true;
	};

	/**
	 * Logic to import data from a JSON file.
	 * Handles FileReader, JSON parsing, and validation.
	 * @param file - The file object selected by the user.
	 * @returns {Promise<boolean>} Resolves true if success, false if error.
	 */
	const importFromFile = (file: File): Promise<boolean> => {
		return new Promise((resolve) => {
			const reader = new FileReader();

			reader.onload = (event) => {
				try {
					const json = JSON.parse(event.target?.result as string);
					if (Array.isArray(json)) {
						saveToStorage(json);
						resolve(true); // Success
					} else {
						console.error("Invalid format: Not an array");
						resolve(false); // Invalid format
					}
				} catch (error) {
					console.error("Error parsing JSON", error);
					resolve(false); // Parse error
				}
			};

			reader.onerror = () => {
				console.error("Error reading file");
				resolve(false); // Read error
			};

			reader.readAsText(file);
		});
	};

	const triggerConfetti = () => setIsConfettiActive(true);
	const stopConfetti = () => setIsConfettiActive(false);

	return (
		<AmiiboContext.Provider
			value={{
				userAmiibos,
				unlockAmiibo,
				toggleFavorite,
				clearStorage,
				exportCollection,
				importFromFile,
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
 * Hook to consume the Amiibo Context.
 */
export const useAmiibo = () => {
	const context = useContext(AmiiboContext);
	if (!context)
		throw new Error("useAmiibo must be used within an AmiiboProvider");
	return context;
};
