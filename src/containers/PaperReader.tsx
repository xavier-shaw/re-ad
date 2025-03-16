import NavBar from "../components/paper-components/NavBar";
import PaperPanel from "./PaperPanel";
import GraphPanel from "./GraphPanel";
import { Box, DialogTitle, TextField, Dialog, DialogContent, Button, DialogActions, IconButton } from "@mui/material";
import "../styles/PaperReader.css";
import { PaperContext } from "../contexts/PaperContext";
import { TourProvider } from "../contexts/TourContext";
import { useContext, useRef, useState } from "react";
import { Add } from "@mui/icons-material";

export const PaperReader = () => {
  const paperContext = useContext(PaperContext);
  if (!paperContext) {
    throw new Error("PaperContext not found");
  }
  const { isAddingNewRead, setIsAddingNewRead, createRead } = paperContext;

  const [title, setTitle] = useState<string | null>("");
  const [color, setColor] = useState<string | null>(null);

  const handleCreateRead = () => {
    if (!title) {
      alert("Please enter a title");
      return;
    }

    if (!color) {
      alert("Please select a color");
      return;
    }

    createRead(title, color);
    handleCancel();
  };

  const handleCancel = () => {
    setTitle("");
    setColor(null);
    setIsAddingNewRead(false);
  };

  const colorPalette = [
    "#FFADAD",
    "#FFD6A5",
    "#FDFFB6",
    "#CAFFBF",
    "#9BF6FF",
    "#A0C4FF",
    "#BDB2FF",
    "#FFC6FF"
  ];

  return (
    <TourProvider>
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
        <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <TextField
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            style={{ padding: 4 }}
          />

          <Box sx={{ my: 2, display: "flex", flexDirection: "row", alignItems: "center" }}>
            {colorPalette.map((c) => (
              <Box
                key={c}
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: c,
                  borderRadius: 4,
                  margin: 1,
                  border: c === color ? "2px solid black" : "none"
                }}
                onClick={() => setColor(c)}
              />
            ))}
            {/* <IconButton
              sx={{ marginLeft: 1, padding: 0 }}
              onClick={() => colorInputRef.current.click()}
            >
              <Add />
            </IconButton>
            <input
              ref={colorInputRef}
              type="color"
              style={{ display: "none" }}
              onChange={(event) => setColor(event.target.value)}
            /> */}
          </Box>
          {/* <input
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
          />; */}
        </DialogContent>
        <DialogActions>
          <Button variant="text" color="error" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="text" onClick={handleCreateRead}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </TourProvider>
  );
};
