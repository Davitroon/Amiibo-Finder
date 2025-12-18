import React from "react";
import Header from "../modules/Header";
import Footer from "../modules/Footer"; // Asume que creaste Footer.tsx similar a Header
import "../styles/main.css";

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="app-container">
			<Header />
			<main>{children}</main>
			<Footer />
		</div>
	);
};

export default BaseLayout;
