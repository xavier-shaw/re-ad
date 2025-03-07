import { Handle, NodeProps, Node, Position } from "@xyflow/react";
import { Box } from "@mui/material";
import "../../styles/OverviewNode.css";

export default function OverviewNode({ data }: NodeProps<Node>) {
    const { id, label, content } = data as { id: string, label: string, content: string };
    return (
        <Box className="overview-node" id={`node-${id}`}>
            <Handle type="target" position={Position.Top} />
            <h6>{label}</h6>
            <p>{content}</p>
            <Handle type="source" position={Position.Bottom} />
        </Box>
    );
}
