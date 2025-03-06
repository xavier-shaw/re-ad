import { Handle, NodeProps, Node, Position } from "@xyflow/react";
import { Box } from "@mui/material";
import './OverviewNode.css';
export default function OverviewNode({ data }: NodeProps<Node>) {
    const { label, content } = data as { label: string; content: string };
    return (
        <Box className="overview-node">
            <Handle type="target" position={Position.Top} />
            <h6>{label}</h6>
            <p>{content}</p>
            <Handle type="source" position={Position.Bottom}/>
        </Box>
    );
}
