import "./App.css";
import { PaperContextProvider } from "./contexts/PaperContext";
import { PaperReader } from "./containers/PaperReader";
import { useEffect } from "react";
import { TourProvider } from "./contexts/TourContext";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Home } from "./containers/Home";
import { ReadingAnalyticsProvider } from "./contexts/ReadingAnalyticsContext";

function App() {

  useEffect(() => {
    window.sessionStorage.clear();
  }, []);

  return (
    <TourProvider>
      <ReadingAnalyticsProvider>
        <PaperContextProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/paper-reader" element={<PaperReader />} />
            </Routes>
          </HashRouter>
        </PaperContextProvider>
      </ReadingAnalyticsProvider>
    </TourProvider>
  );
}

export default App;
