import "./App.css";
import { PaperContextProvider } from "./contexts/PaperContext";
import { PaperReader } from "./containers/PaperReader";
import React, {useEffect } from "react";

import Joyride from 'react-joyride';


function App() {
  useEffect(() => {
    window.sessionStorage.clear();
  }, []);

  return (
     <PaperContextProvider>
      <PaperReader />
    </PaperContextProvider> 
  );
}

export default App;
