import React, { useState, useEffect } from "react";
import Confetti from "react-confetti"; // Importamos la librería
import Header from "../modules/Header";
import Footer from "../modules/Footer";
import { useAmiibo } from "../context/AmiiboContext"; // Importamos el contexto
import "../styles/main.css";

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	// Obtenemos el estado y la función para detener el confeti
	const { isConfettiActive, stopConfetti } = useAmiibo();

	// Estado para manejar el tamaño de la ventana (para que el confeti cubra todo)
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="app-container">
			{/* RENDERIZADO CONDICIONAL DEL CONFETI 
               Se muestra encima de todo gracias al zIndex alto.
               Cuando termina la animación (recycle={false}), llama a stopConfetti.
            */}
			{isConfettiActive && (
				<Confetti
					width={windowSize.width}
					height={windowSize.height}
					recycle={false}
					numberOfPieces={600}
					gravity={0.15}
					onConfettiComplete={stopConfetti}
					style={{ zIndex: 99999, pointerEvents: "none" }}
				/>
			)}

			<Header />
			<main>{children}</main>
			<Footer />
		</div>
	);
};

export default BaseLayout;
