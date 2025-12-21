import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // Importar hook
import "../styles/header.css";

const Header = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<header id="header">
			{/* Contenedor del Título y Links (Izquierda/Centro) */}
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

			{/* Botón de Tema (Derecha) */}
			<button
				onClick={toggleTheme}
				className="theme-toggle-btn"
				title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
			>
				{theme === "light" ? "🌙" : "☀️"}
			</button>
		</header>
	);
};

export default Header;
