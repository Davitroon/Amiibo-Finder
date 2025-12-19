import { Link } from "react-router-dom";
import "../styles/header.css";

const Header = () => (
	<header id="header">
		<h1>Amiibo Finder</h1>
		<div id="header-links">
			<Link to="/" title="See my Amiibos">
				Collection
			</Link>
			<Link to="/unlock" title="Unlock new Amiibos">
				Unlock
			</Link>
		</div>
	</header>
);

export default Header;
