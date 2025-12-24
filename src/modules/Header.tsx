import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useThemeContext } from "../context/useThemeContext";
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
	const { theme, toggleTheme } = useThemeContext();
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
		<header id="header">
			<div className="header-main">
				<h1>Amiibo Finder</h1>
				<div id="header-links">
					<NavLink
						to="/"
						title="See my Amiibos"
						end
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						Collection
					</NavLink>
					<NavLink
						to="/unlock"
						title="Unlock new Amiibos"
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						Unlock
					</NavLink>
				</div>
			</div>

			{/* Contenedor de Acciones */}
			<div className="header-actions">
				<button
					onClick={toggleNotifications}
					className={`icon-btn ${notificationsEnabled ? "active-notify" : ""}`}
					title="Toggle Notifications"
				>
					{notificationsEnabled ? <IoNotifications /> : <IoNotificationsOff />}
				</button>

				<button onClick={toggleTheme} className="icon-btn" title="Toggle Theme">
					{theme === "light" ? <IoMoon /> : <IoSunny />}
				</button>

				{/* AQUÍ ESTÁ EL COMPONENTE SEPARADO */}
				<UserMenu />
			</div>
		</header>
	);
};

export default Header;
