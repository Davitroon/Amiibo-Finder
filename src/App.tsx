import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AmiiboProvider } from "./context/AmiiboContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FilterProvider } from "./context/FilterContext";
import BaseLayout from "./layouts/BaseLayout";
import Home from "./pages/Collection";
import Unlock from "./pages/Unlock";
import { ToastProvider } from "./context/ToastContext";

/**
 * Root component of the application.
 * * * Responsibilities:
 * 1. Composes all Global Context Providers (Theme, Data, Filters, Toasts).
 * 2. Initializes the React Router.
 * 3. Applies the BaseLayout structure.
 * 4. Defines the main application Routes.
 */
function App() {
    return (
        /* Global State Providers */
        <ThemeProvider>
            <AmiiboProvider>
                <FilterProvider>
                    <ToastProvider>
                        {/* Routing Configuration */}
                        <BrowserRouter>
                            <BaseLayout>
                                <Routes>
                                    {/* Main Collection Page */}
                                    <Route path="/" element={<Home />} />
                                    
                                    {/* Unlock/Gacha Page */}
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