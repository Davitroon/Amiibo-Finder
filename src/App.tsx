import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AmiiboProvider } from "./context/AmiiboContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FilterProvider } from "./context/FilterContext"; // <--- IMPORTAR
import BaseLayout from "./layouts/BaseLayout";
import Home from "./pages/Collection";
import Unlock from "./pages/Unlock";
import { ToastProvider } from "./context/ToastContext";

function App() {
	return (
		<ThemeProvider>
			<AmiiboProvider>
				<FilterProvider>
					<ToastProvider>
						<BrowserRouter>
							<BaseLayout>
								<Routes>
									<Route path="/" element={<Home />} />
									<Route path="/unlock" element={<Unlock />} />
								</Routes>
							</BaseLayout>
						</BrowserRouter>
					</ToastProvider>
				</FilterProvider>
			</AmiiboProvider>
		</ThemeProvider>
	);
}

export default App;
