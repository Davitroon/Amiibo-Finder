import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { IoMoon, IoSunny, IoNotifications, IoNotificationsOff } from "react-icons/io5"; // Iconos bonitos
import "../styles/header.css";

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    // Comprobar estado inicial del permiso
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "granted") {
            setNotificationsEnabled(true);
        }
    }, []);

    const toggleNotifications = async () => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications");
            return;
        }

        if (Notification.permission === "granted") {
            // No se puede "revocar" el permiso programáticamente en JS, 
            // pero podemos simularlo visualmente o decirle al usuario cómo hacerlo.
            // Para simplificar, aquí solo mostramos el estado.
            // Lo ideal en una app real es guardar un estado local 'userMutedNotifications'
            alert("To disable notifications completely, please reset permissions in your browser settings (click the lock icon in the address bar).");
        } else if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                setNotificationsEnabled(true);
                new Notification("Notifications Enabled", {
                    body: "You will be notified when your next Amiibo is ready!",
                    icon: "/favicon.ico"
                });
            }
        } else {
            // Permiso denegado previamente
            alert("Notifications are blocked. Please enable them in your browser settings.");
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

            {/* Contenedor de Botones (Derecha) */}
            <div className="header-actions">
                {/* Botón Notificaciones */}
                <button
                    onClick={toggleNotifications}
                    className={`icon-btn ${notificationsEnabled ? "active-notify" : ""}`}
                    title={notificationsEnabled ? "Notifications enabled" : "Enable notifications"}
                >
                    {notificationsEnabled ? <IoNotifications /> : <IoNotificationsOff />}
                </button>

                {/* Botón Tema */}
                <button
                    onClick={toggleTheme}
                    className="icon-btn"
                    title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
                >
                    {theme === "light" ? <IoMoon /> : <IoSunny />}
                </button>
            </div>
        </header>
    );
};

export default Header;