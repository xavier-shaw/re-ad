import "./App.css";
import { PaperContextProvider } from "./contexts/PaperContext";
import { PaperReader } from "./containers/PaperReader";
import { useEffect } from "react";
import { TourProvider } from "./contexts/TourContext";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Home } from "./containers/Home";

function App() {

  useEffect(() => {
    window.sessionStorage.clear();
  }, []);

  return (
    <TourProvider>
      <PaperContextProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/paper-reader" element={<PaperReader />} />
          </Routes>
        </HashRouter>
      </PaperContextProvider>
    </TourProvider>
  );
}

export default App;
