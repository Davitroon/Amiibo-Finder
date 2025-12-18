import React from "react";
import "../styles/footer.css";

const Footer: React.FC = () => {
	return (
		<footer className="site-footer">
			<p>
				Data obtained from{" "}
				<a
					href="https://amiiboapi.com/"
					title="Amiibo API documentation"
					target="_blank"
					rel="noopener noreferrer"
				>
					Amiibo API
				</a>
			</p>
			<p>
				Project developed with{" "}
				<a
					href="https://react.dev/"
					title="React Official Site"
					target="_blank"
					rel="noopener noreferrer"
				>
					React
				</a>
			</p>
		</footer>
	);
};

export default Footer;
