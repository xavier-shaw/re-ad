import NavBar from "../components/paper-components/NavBar";
import PaperPanel from "./PaperPanel";
import GraphPanel from "./GraphPanel";
import { Box, DialogTitle, TextField, Dialog, DialogContent, Button, DialogActions } from "@mui/material";
import "../styles/PaperReader.css";
import { PaperContext } from "../contexts/PaperContext";
import { useContext, useState } from "react";

export const PaperReader = () => {
  const paperContext = useContext(PaperContext);
  if (!paperContext) {
    throw new Error("PaperContext not found");
  }
  const { isAddingNewRead, setIsAddingNewRead, createRead } = paperContext;

  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#000000");

  const handleCreateRead = () => {
    createRead(title, color);
    handleCancel();
  };

  const handleCancel = () => {
    setTitle("");
    setColor("#000000");
    setIsAddingNewRead(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh" }}>
      <Box sx={{ height: "8%", width: "100%", display: "flex" }}>
        <NavBar />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", width: "100%", height: "92%" }}>
        <Box className="panel paper-panel">
          <PaperPanel />
        </Box>
        <Box className="panel graph-panel">
          <GraphPanel />
        </Box>
      </Box>

      <Dialog open={isAddingNewRead}>
        <DialogTitle>Create New Read</DialogTitle>
        <DialogContent style={{ paddingTop: 20, display: "flex", alignItems: "center" }}>
          <TextField
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            style={{ padding: 4 }}
          />
          <input
            style={{
              padding: 4,
              borderColor: "rgba(0, 0, 0, 0.23)",
              background: "none",
              cursor: "pointer",
              borderRadius: 4,
            }}
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button className="mui-button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button className="mui-button" onClick={handleCreateRead}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
