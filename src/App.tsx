

import "./App.css";
import "./../node_modules/react-pdf-highlighter/dist/style.css"
import GraphPanel from "./containers/GraphPanel";
import PaperPanel from "./containers/PaperPanel";


function App() {
  

  

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <PaperPanel />
      <GraphPanel />
    </div>
  );
}

export default App;