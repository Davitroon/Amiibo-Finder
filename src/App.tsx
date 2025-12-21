import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AmiiboProvider } from "./context/AmiiboContext";
import { ThemeProvider } from "./context/ThemeContext"; // Importar nuevo contexto
import BaseLayout from "./layouts/BaseLayout";
import Home from "./pages/Collection";
import Unlock from "./pages/Unlock";

function App() {
	return (
		<ThemeProvider>
			{" "}
			{/* Envolvemos la app con el tema */}
			<AmiiboProvider>
				<BrowserRouter>
					<BaseLayout>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/unlock" element={<Unlock />} />
						</Routes>
					</BaseLayout>
				</BrowserRouter>
			</AmiiboProvider>
		</ThemeProvider>
	);
}

export default App;
