import '@xyflow/react/dist/style.css';
import { useState, useCallback } from 'react';
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
} from '@xyflow/react';
import { Box, Button } from '@mui/material';
import HighlightNode from '../components/graph-components/HighlightNode';
import OverviewNode from '../components/graph-components/OverviewNode';
import TemporalEdge from '../components/graph-components/TemporalEdge';
import RelationEdge from '../components/graph-components/RelationEdge';


const onNodeDrag: OnNodeDrag = (_, node) => {
    console.log('drag event', node.data);
};

export default function GraphPanel() {
    const initialNodes: Node[] = [
        { id: '1', type: 'highlight', data: { label: 'Node 1', content: 'Content 1' }, position: { x: 50, y: 50 } },
        { id: '2', type: 'highlight', data: { label: 'Node 2', content: 'Content 2' }, position: { x: 150, y: 100 } },
        { id: '3', type: 'highlight', data: { label: 'Node 3', content: 'Content 3' }, position: { x: 50, y: 250 } },
    ];
    const initialEdges: Edge[] = [
        { id: 'e1-2', type: 'temporal', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed, color: 'blue' } },
        { id: 'e1-3', type: 'relation', source: '1', target: '3' }
    ];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [isOverview, setIsOverview] = useState(false);

    const nodeTypes = {
        highlight: HighlightNode,
        overview: OverviewNode
    };

    const edgeTypes = {
        temporal: TemporalEdge,
        relation: RelationEdge
    };

    const onConnect = useCallback((connection: Connection) => {
        const edge = { ...connection, animated: true };
        setEdges(prevEdges => addEdge(edge, prevEdges));
    }, []);

    const openOverview = () => {
        if (isOverview) {
            setNodes(nodes.map(node => ({ ...node, type: 'highlight' })));
        } else {
            setNodes(nodes.map(node => ({ ...node, type: 'overview' })));
        }

        setIsOverview(!isOverview);
    };

    return (
        <Box style={{ width: '100%', height: '100%'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDrag={onNodeDrag}
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