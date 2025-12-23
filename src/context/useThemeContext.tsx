import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	// 1. Inicializamos estado
	const [theme, setTheme] = useState<Theme>(() => {
		// Leemos el mismo valor que leyó el index.html
		const savedTheme = localStorage.getItem("amiiboFinderSiteTheme");
		return (savedTheme as Theme) || "light";
	});

	useEffect(() => {
		// 2. Sincronización
		localStorage.setItem("amiiboFinderSiteTheme", theme);

		// React se encargará de añadir/quitar la clase cuando cambies el tema en vivo.
		// Aunque el script del HTML ya lo hizo al inicio, esto asegura que
		// si cambias el estado, el DOM se actualice.
		if (theme === "dark") {
			document.body.classList.add("dark-mode");
		} else {
			document.body.classList.remove("dark-mode");
		}
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useThemeContext = () => {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("useThemeContext must be used within a ThemeProvider");
	return context;
};
