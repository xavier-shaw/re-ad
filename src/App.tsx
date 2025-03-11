import "./App.css";
import { PaperContextProvider } from "./contexts/PaperContext";
import { PaperReader } from "./containers/PaperReader";

function App() {
  return (
    <PaperContextProvider>
      <PaperReader />
    </PaperContextProvider>
  );
}

export default App;
