import '@xyflow/react/dist/style.css';
import { useState, useCallback, useContext, useEffect } from 'react';
import {
    ReactFlow,
    addEdge,
    type Node,
    type Edge,
    type FitViewOptions,
    type OnNodeDrag,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Connection,
    Panel,
    MarkerType,
    NodeMouseHandler,
} from '@xyflow/react';
import { Box, Button } from '@mui/material';
import HighlightNode from '../components/graph-components/HighlightNode';
import OverviewNode from '../components/graph-components/OverviewNode';
import TemporalEdge from '../components/graph-components/TemporalEdge';
import RelationEdge from '../components/graph-components/RelationEdge';
import { PaperContext } from '../contexts/PaperContext';


const nodeTypes = {
    highlight: HighlightNode,
    overview: OverviewNode
};

const edgeTypes = {
    temporal: TemporalEdge,
    relation: RelationEdge
};

export default function GraphPanel() {
    const paperContext = useContext(PaperContext);
    if (!paperContext) {
        throw new Error("PaperContext not found");
    }
    const { nodes, edges, setNodes, onNodesChange, onEdgesChange, onConnect, selectedHighlightId, setSelectedHighlightId } = paperContext;

    const [isOverview, setIsOverview] = useState(false);

    useEffect(() => {
        const highlightNode = document.getElementById(`node-${selectedHighlightId}`);
        if (highlightNode) {
            highlightNode.style.border = '2px solid red';
        }
    }, [selectedHighlightId]);

    const onNodeDrag: OnNodeDrag = (_, node) => {
        console.log('drag event', node.data);
    };

    const onNodeClick: NodeMouseHandler = (event, node) => {
        setSelectedHighlightId(node.id);

        if (selectedHighlightId !== null) {
            const currentHighlightNode = document.getElementById(`node-${selectedHighlightId}`);
            if (currentHighlightNode) {
                currentHighlightNode.style.border = 'none';
            }
            setSelectedHighlightId(node.id);
        }
    };

    const openOverview = () => {
        if (isOverview) {
            setNodes(nodes.map(node => ({ ...node, type: 'highlight' })));
        } else {
            setNodes(nodes.map(node => ({ ...node, type: 'overview' })));
        }

        setIsOverview(!isOverview);
    };

    return (
        <Box style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDrag={onNodeDrag}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                style={{ width: '100%', height: '100%' }}
            >
                <Background />
                <Controls />
                <MiniMap />

                <Panel position="top-right">
                    <Button size="small" onClick={openOverview}>{isOverview ? 'Overview' : 'Highlight'}</Button>
                </Panel>
            </ReactFlow>
        </Box>
    );
}