

import "./App.css";
import "./../node_modules/react-pdf-highlighter/dist/style.css"
import GraphPanel from "./containers/GraphPanel";
import PaperPanel from "./containers/PaperPanel";
import { Box } from "@mui/material";
import { PaperContextProvider } from "./contexts/PaperContext";

function App() {

  return (
    <PaperContextProvider>
      <div className="App">
        <Box className="panel paper-panel">
          <PaperPanel />
        </Box>
        <Box className="panel graph-panel">
          <GraphPanel />
        </Box>
      </div>
    </PaperContextProvider>
  );
}

export default App;