import { Box } from "@mui/material";
import { Position, Handle, NodeProps, Node } from "@xyflow/react";
import "../../styles/HighlightNode.css";
import { PaperContext } from "../../contexts/PaperContext";
import { useContext } from "react";

export default function HighlightNode({ data }: NodeProps<Node>) {
    const { id, readRecordId, label } = data as { readRecordId: string, label: string, id: string };
    const paperContext = useContext(PaperContext);
    if (!paperContext) {
        throw new Error("PaperContext not found");
    }
    const { readRecords } = paperContext;
    const { title, color } = readRecords[readRecordId];

    return (
        <Box className="highlight-node" id={`node-${id}`} sx={{ backgroundColor: color }}>
            <Handle type="target" position={Position.Top} />
            <h6>{label}</h6>
            <Handle type="source" position={Position.Bottom} />
        </Box>
    );
}