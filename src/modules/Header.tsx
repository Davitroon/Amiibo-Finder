// 1. Cambiamos la importación de Link a NavLink
import { NavLink } from "react-router-dom";
import "../styles/header.css";

const Header = () => (
	<header id="header">
		<h1>Amiibo Finder</h1>
		<div id="header-links">
			{/* 2. Usamos NavLink. 
               La prop 'end' en la ruta "/" asegura que solo se marque 
               cuando sea EXACTAMENTE el home, y no en subrutas.
            */}
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
	</header>
);

export default Header;
