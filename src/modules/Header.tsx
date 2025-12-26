import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
    IoMoon,
    IoSunny,
    IoNotifications,
    IoNotificationsOff,
} from "react-icons/io5";
import { useToast } from "../context/ToastContext";
import UserMenu from "./UserMenu";
import "../styles/header.css";

/**
 * Header component displayed at the top of the application.
 * Features:
 * - Application Branding (H1).
 * - Main Navigation Links (Collection, Unlock).
 * - Global Actions: Notification Toggle, Theme Toggle.
 * - User Menu Component.
 */
const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { showToast } = useToast();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    // Check for existing notification permissions on component mount
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "granted") {
            setNotificationsEnabled(true);
        }
    }, []);

    /**
     * Handles the logic for toggling browser notifications.
     * - If granted: Shows a toast (permissions cannot be revoked programmatically).
     * - If default: Requests permission.
     * - If denied: Shows an error toast.
     */
    const toggleNotifications = async () => {
        if (!("Notification" in window)) return;

        if (Notification.permission === "granted") {
            // Browsers don't allow revoking permission via JS, so we inform the user.
            showToast("ℹ️ To disable notifications, reset browser permissions.");
        } else if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                setNotificationsEnabled(true);
                showToast("🔔 Notifications enabled!");
            }
        } else {
            showToast("🚫 Notifications are blocked by browser.");
        }
    };

    return (
        <header id="header">
            <div className="header-main">
                <h1>Amiibo Finder</h1>
                {/* role="navigation" helps screen readers identify the link area */}
                <nav id="header-links" aria-label="Main navigation">
                    <NavLink 
                        to="/" 
                        end 
                        className={({ isActive }) => (isActive ? "active" : "")}
                        title="See your Amiibo collection"
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
                {/* Notification Toggle Button */}
                <button
                    onClick={toggleNotifications}
                    className={`icon-btn ${notificationsEnabled ? "active-notify" : ""}`}
                    // Dynamic aria-label describes the ACTION to be taken
                    aria-label={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
                    title={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
                >
                    {notificationsEnabled ? (
                        <IoNotifications aria-hidden="true"/>
                    ) : (
                        <IoNotificationsOff aria-hidden="true"/>
                    )}
                </button>

                {/* Theme Toggle Button */}
                <button 
                    onClick={toggleTheme} 
                    className="icon-btn" 
                    aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                    title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                >
                    {theme === "light" ? (
                        <IoMoon aria-hidden="true"/>
                    ) : (
                        <IoSunny aria-hidden="true"/>
                    )}
                </button>

                <UserMenu />
            </div>
        </header>
    );
};

export default Header;