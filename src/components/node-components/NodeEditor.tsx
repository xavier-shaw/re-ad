import { useContext } from "react";
import "../../styles/NodeEditor.css";
import Summary from "./Summary";
import References from "./References";
import Notes from "./Notes";
import Button from "./Button";
import { Box } from "@mui/material";
import { PaperContext } from "../../contexts/PaperContext";

interface NodeEditorProps {
  highlight: string;
}

function NodeEditor({ highlight }: NodeEditorProps) {
  const paperContext = useContext(PaperContext);
  if (!paperContext) {
    throw new Error("PaperContext not found");
  }
  const { deleteHighlight } = paperContext;
  return (
    <div className="wrapper" style={{ width: "100%", height: "100%", overflowY: "auto" }}>
      <Summary className="field" text={highlight} />
      <References className="field" />
      <Notes className="field" />
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
        <Button className="link button" text="link" onClick={() => {}} />
        <Button className="save button" text="save" onClick={() => {}} />
        <Button className="delete button" text="delete" onClick={() => deleteHighlight(highlight)} />
      </Box>
    </div>
  );
}

export default NodeEditor;
