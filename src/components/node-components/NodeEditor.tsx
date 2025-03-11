import { useContext } from "react";
import "../../styles/NodeEditor.css";
import Summary from "./Summary";
import References from "./References";
import Notes from "./Notes";
import { Box, Button } from "@mui/material";
import { PaperContext } from "../../contexts/PaperContext";

interface NodeEditorProps {
  selectedHighlightId: string;
}

function NodeEditor({ selectedHighlightId }: NodeEditorProps) {
  const paperContext = useContext(PaperContext);
  if (!paperContext) {
    throw new Error("PaperContext not found");
  }
  const { updateHighlight, deleteHighlight } = paperContext;

  const handleSave = () => {
    
  };

  return (
    <div className="wrapper" style={{ width: "100%", height: "100%", overflowY: "auto" }}>
      <Summary className="field" />
      <References className="field" />
      <Notes className="field" />
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
        <Button variant="outlined" color="secondary" onClick={() => {}}>Link</Button>
        <Button variant="outlined" color="success" onClick={() => handleSave()}>Save</Button>
        <Button variant="outlined" color="error" onClick={() => deleteHighlight(selectedHighlightId)}>Delete</Button>
      </Box>
    </div>
  );
}

export default NodeEditor;
