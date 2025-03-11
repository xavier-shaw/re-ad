import { useContext, useState } from "react";
import "../../styles/NodeEditor.css";
import Summary from "./Summary";
import References from "./References";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { PaperContext } from "../../contexts/PaperContext";
import { Close } from "@mui/icons-material";

interface NodeEditorProps {
  selectedHighlightId: string;
}

export type NodeData = {
  label: string;
  content: string;
  summary: string;
  references: string[];
  notes: string;
}

function NodeEditor({ selectedHighlightId }: NodeEditorProps) {
  const paperContext = useContext(PaperContext);
  if (!paperContext) {
    throw new Error("PaperContext not found");
  }
  const { nodes, updateNodeData, deleteHighlight, setSelectedHighlightId } = paperContext;
  const selectedNode = nodes.find((node) => node.id === selectedHighlightId);

  const [label, setLabel] = useState<string>(selectedNode?.data.label as string);
  const [isEditingLabel, setIsEditingLabel] = useState(false);

  const [summary, setSummary] = useState<string>(selectedNode?.data.summary as string);
  const [references, setReferences] = useState<string[]>(selectedNode?.data.references as string[]);

  const [notes, setNotes] = useState<string>(selectedNode?.data.notes as string);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const handleSave = () => {
    updateNodeData(selectedHighlightId, { label, summary, references, notes });
    setSelectedHighlightId(null);
  };

  return (
    <div className="wrapper" style={{ width: "100%", height: "100%", overflowY: "auto" }}>
      <IconButton size="small" sx={{ position: "absolute", top: 0, right: 0 }} onClick={() => setSelectedHighlightId(null)}>
        <Close />
      </IconButton>
      <Box className="field">
        <h3>Label</h3>
        <div onClick={() => setIsEditingLabel(true)} style={{ cursor: "pointer" }}>
          {isEditingLabel ? (
            <TextField
              id="label"
              variant="outlined"
              sx={{ width: "100%" }}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={() => setIsEditingLabel(false)} // Save and switch back when losing focus
              autoFocus
            />
          ) : (
            <Typography>
              {label}
            </Typography>
          )}
        </div>
      </Box>
      <Summary className="field" text={selectedNode?.data.content as string} />
      <References className="field" />
      <Box className="field">
        <h3>Notes</h3>
        <div onClick={() => setIsEditingNotes(true)} style={{ cursor: "pointer" }}>
          {isEditingNotes ? (
            <TextField
              id="notes"
              variant="outlined"
              sx={{ width: "100%" }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => setIsEditingNotes(false)} // Save and switch back when losing focus
              autoFocus
            />
          ) : (
            <Typography>
              {notes}
            </Typography>
          )}
        </div>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
        {/* <Button variant="outlined" color="secondary" onClick={() => { }}>Link</Button> */}
        <Button variant="outlined" color="success" onClick={() => handleSave()}>Save</Button>
        <Button variant="outlined" color="error" onClick={() => deleteHighlight(selectedHighlightId)}>Delete</Button>
      </Box>
    </div>
  );
}

export default NodeEditor;
