import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * Represents the available theme modes.
 */
type Theme = "light" | "dark";

/**
 * Defines the shape of the Theme Context.
 * Includes the current theme value and a function to toggle it.
 */
interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Provider component that manages the application's visual theme.
 * It handles persisting the theme to LocalStorage and updating the DOM
 * (specifically the 'dark-mode' class on the body) when the state changes.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    // 1. Initialize state lazily
    const [theme, setTheme] = useState<Theme>(() => {
        // Read the value from local storage to prevent flickering on reload
        const savedTheme = localStorage.getItem("amiiboFinderSiteTheme");
        return (savedTheme as Theme) || "light";
    });

    useEffect(() => {
        // 2. Synchronization
        localStorage.setItem("amiiboFinderSiteTheme", theme);

        // Update the DOM body class based on the current theme state.
        // This ensures the visual styles match the React state.
        if (theme === "dark") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [theme]);

    /**
     * Toggles the theme between 'light' and 'dark'.
     */
    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Custom hook to consume the ThemeContext.
 * @returns The current theme and the toggle function.
 * @throws Error if used outside of a ThemeProvider.
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};