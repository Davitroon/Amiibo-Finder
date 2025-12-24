import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
// Iconos solo de UI básica
import {
	IoMoon,
	IoSunny,
	IoNotifications,
	IoNotificationsOff,
} from "react-icons/io5";
import { useToast } from "../context/ToastContext";
import UserMenu from "./UserMenu"; // <--- Importamos el nuevo componente
import "../styles/header.css";

const Header = () => {
	const { theme, toggleTheme } = useTheme();
	const { showToast } = useToast();
	const [notificationsEnabled, setNotificationsEnabled] = useState(false);

	// --- LÓGICA DE NOTIFICACIONES ---
	useEffect(() => {
		if ("Notification" in window && Notification.permission === "granted") {
			setNotificationsEnabled(true);
		}
	}, []);

	const toggleNotifications = async () => {
		if (!("Notification" in window)) return;

		if (Notification.permission === "granted") {
			showToast("ℹ️ To disable notifications, reset browser permissions."); // Cambio de alert
		} else if (Notification.permission !== "denied") {
			const permission = await Notification.requestPermission();
			if (permission === "granted") {
				setNotificationsEnabled(true);
				showToast("🔔 Notifications enabled!"); // Feedback visual
			}
		} else {
			showToast("🚫 Notifications are blocked by browser.");
		}
	};

	return (
        <header id="header"> {/* role="banner" es buena práctica */}
            <div className="header-main">
                <h1>Amiibo Finder</h1>
                {/* role="navigation" ayuda a identificar la zona de links */}
                <nav id="header-links" aria-label="Main navigation">
                    <NavLink 
                        to="/" 
                        end 
                        className={({ isActive }) => (isActive ? "active" : "")}
						title="See your Amiibo collection"
                        // NavLink ya gestiona aria-current="page" automáticamente
                    >
                        Collection
                    </NavLink>
                    <NavLink 
                        to="/unlock" 
                        className={({ isActive }) => (isActive ? "active" : "")}
						title="Unlock new Amiibos"
                    >
                        Unlock
                    </NavLink>
                </nav>
            </div>

            <div className="header-actions">
                <button
                    onClick={toggleNotifications} // Asumo que esta función la tienes definida arriba
                    className={`icon-btn ${notificationsEnabled ? "active-notify" : ""}`}
                    // Usamos aria-label dinámico para describir la ACCIÓN, no el estado actual
                    aria-label={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
                    title={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
                >
                    {/* aria-hidden en iconos decorativos */}
                    {notificationsEnabled ? <IoNotifications aria-hidden="true"/> : <IoNotificationsOff aria-hidden="true"/>}
                </button>

                <button 
                    onClick={toggleTheme} 
                    className="icon-btn" 
                    aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                    title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                >
                    {theme === "light" ? <IoMoon aria-hidden="true"/> : <IoSunny aria-hidden="true"/>}
                </button>

                <UserMenu />
            </div>
        </header>
    );
};

export default Header;
