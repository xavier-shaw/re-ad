import { Box, Typography } from "@mui/material";
import { Position, Handle, NodeProps, Node } from "@xyflow/react";
import "../../styles/GraphNode.css";
import { PaperContext } from "../../contexts/PaperContext";
import { useContext } from "react";

export default function GroupNode({ data }: NodeProps<Node>) {
  const { id, readRecordId, label, type, content, intersected } = data as {
    id: string;
    readRecordId: string;
    label: string;
    type: string;
    content: string;
    intersected: boolean;
  };
  const paperContext = useContext(PaperContext);
  if (!paperContext) {
    throw new Error("PaperContext not found");
  }
  const { readRecords, displayedReads, selectedHighlightId } = paperContext;
  const { color } = readRecords[readRecordId];
  const isDisplayed = displayedReads.includes(readRecordId);

  return (
    <Box
      className={`group-node ${id === selectedHighlightId ? "selected" : ""} ${intersected ? "intersected" : ""}`}
      id={`node-${id}`}
      sx={{ backgroundColor: isDisplayed ? color : "#e6e6e6" }}
    >
      <Handle type="target" position={Position.Top} />
      <Typography variant="body1">{label}</Typography>
      {type === "area" &&
        <img src={content} alt="Node Content" style={{ maxWidth: "100%", maxHeight: "100px" }} />
      }
      <Handle type="source" position={Position.Bottom} />
    </Box>
  );
}
