import { Box } from "@mui/material";
import { Position, Handle, NodeProps, Node } from "@xyflow/react";
import "../../styles/HighlightNode.css";

export default function HighlightNode({ data }: NodeProps<Node>) {
    const { label, id } = data as { label: string, id: string };
    return (
        <Box className="highlight-node" id={`node-${id}`}>
            <Handle type="target" position={Position.Top} />
            <h6>{label}</h6>
            <Handle type="source" position={Position.Bottom}/>
        </Box>
    );
}