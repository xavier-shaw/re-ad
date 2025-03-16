import "./App.css";
import { PaperContextProvider } from "./contexts/PaperContext";
import { PaperReader } from "./containers/PaperReader";

import Joyride from 'react-joyride';


function App() {
  return (
     <PaperContextProvider>
      <PaperReader />
    </PaperContextProvider> 
  );
}

export default App;
