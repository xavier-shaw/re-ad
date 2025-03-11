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
    }

    const handleCancel = () => {
        setTitle("");
        setColor("#000000");
        setIsAddingNewRead(false);
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh" }}>
            <Box sx={{ height: "8vh", width: "100%", display: "flex" }}>
                <NavBar />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", width: "100%", height: "90vh" }}>
                <Box className="panel paper-panel">
                    <PaperPanel />
                </Box>
                <Box className="panel graph-panel">
                    <GraphPanel />
                </Box>
            </Box>

            <Dialog open={isAddingNewRead}>
                <DialogTitle>Create New Read</DialogTitle>
                <DialogContent>
                    <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
                    <input
                        type="color"
                        value={color}
                        onChange={(event) => setColor(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleCreateRead}>Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
