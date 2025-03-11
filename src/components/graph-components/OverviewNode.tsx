import { Handle, NodeProps, Node, Position } from "@xyflow/react";
import { Box, Typography } from "@mui/material";
import "../../styles/OverviewNode.css";
import { PaperContext } from "../../contexts/PaperContext";
import { useContext } from "react";

export default function OverviewNode({ data }: NodeProps<Node>) {
    const { id, readRecordId, label, content } = data as { id: string, readRecordId: string, label: string, content: string };
    const paperContext = useContext(PaperContext);
    if (!paperContext) {
        throw new Error("PaperContext not found");
    }
    const { readRecords, displayedReads } = paperContext;
    const { title, color } = readRecords[readRecordId];
    const isDisplayed = displayedReads.includes(readRecordId);
    
    return (
        <Box className="overview-node" id={`node-${id}`} sx={{ backgroundColor: isDisplayed ? color : "#e6e6e6" }}>
            <Handle type="target" position={Position.Top} />
            <Typography variant="h6">{label}</Typography>
            <Typography variant="caption">{content}</Typography>
            <Handle type="source" position={Position.Bottom} />
        </Box>
    );
}
