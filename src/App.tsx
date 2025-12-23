import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AmiiboProvider } from "./context/useAmiiboContext";
import { ThemeProvider } from "./context/useThemeContext";
import { FilterProvider } from "./context/useFilterContext"; // <--- IMPORTAR
import BaseLayout from "./layouts/BaseLayout";
import Home from "./pages/Collection";
import Unlock from "./pages/Unlock";

function App() {
    return (
        <ThemeProvider>
            <AmiiboProvider>
                <FilterProvider> {/* <--- ENVOLVEMOS LA APP AQUÍ */}
                    <BrowserRouter>
                        <BaseLayout>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/unlock" element={<Unlock />} />
                            </Routes>
                        </BaseLayout>
                    </BrowserRouter>
                </FilterProvider>
            </AmiiboProvider>
        </ThemeProvider>
    );
}

export default App;