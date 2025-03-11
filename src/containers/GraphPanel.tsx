import '@xyflow/react/dist/style.css';
import { useState, useCallback, useContext, useEffect } from 'react';
import {
    ReactFlow,
    type FitViewOptions,
    type OnNodeDrag,
    Background,
    Controls,
    MiniMap,
    Panel,
    NodeMouseHandler,
    useReactFlow,
    ReactFlowProvider
} from '@xyflow/react';
import { Box, Button } from '@mui/material';
import HighlightNode from '../components/graph-components/HighlightNode';
import OverviewNode from '../components/graph-components/OverviewNode';
import TemporalEdge from '../components/graph-components/TemporalEdge';
import RelationEdge from '../components/graph-components/RelationEdge';
import { PaperContext } from '../contexts/PaperContext';
import NodeEditor from '../components/node-components/NodeEditor';

const nodeTypes = {
    highlight: HighlightNode,
    overview: OverviewNode
};

const edgeTypes = {
    temporal: TemporalEdge,
    relation: RelationEdge
};

function Flow(props: any) {
    const { nodes, edges, setNodes, onNodesChange, onEdgesChange, onConnect, selectedHighlightId, setSelectedHighlightId } = props;
    const [isOverview, setIsOverview] = useState(false);

    const onNodeDrag: OnNodeDrag = (_, node) => {
        console.log('drag event', node.data);
    };

    const onNodeClick: NodeMouseHandler = (event, node) => {
        if (selectedHighlightId === node.id) {
            setSelectedHighlightId(null);
        }
        else {
            setSelectedHighlightId(node.id);
        }

        const currentHighlightNode = document.getElementById(`node-${selectedHighlightId}`);
        if (currentHighlightNode) {
            currentHighlightNode.style.border = 'none';
        }
    };

    const openOverview = () => {
        if (isOverview) {
            setNodes(nodes.map((node: any) => ({ ...node, type: 'highlight' })));
        } else {
            setNodes(nodes.map((node: any) => ({ ...node, type: 'overview' })));
        }

        setIsOverview(!isOverview);
    };

    const { fitView } = useReactFlow();
    useEffect(() => {
        fitView();
    }, [nodes.length]);

    return (
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
            <Controls style={{ color: 'black' }} />
            <MiniMap />

            <Panel position="top-right">
                <Button size="small" onClick={openOverview}>{isOverview ? 'Overview' : 'Highlight'}</Button>
            </Panel>
        </ReactFlow>
    );
}

export default function GraphPanel() {
    const paperContext = useContext(PaperContext);
    if (!paperContext) {
        throw new Error("PaperContext not found");
    }
    const { nodes, edges, setNodes, onNodesChange, onEdgesChange, onConnect, selectedHighlightId, setSelectedHighlightId } = paperContext;

    useEffect(() => {
        const highlightNode = document.getElementById(`node-${selectedHighlightId}`);
        if (highlightNode) {
            highlightNode.style.border = '2px solid red';
        }
    }, [selectedHighlightId]);

    return (
        <Box style={{ width: '100%', height: '100%', position: 'relative' }}>
            <ReactFlowProvider>
                <Flow
                    nodes={nodes}
                    edges={edges}
                    setNodes={setNodes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    selectedHighlightId={selectedHighlightId}
                    setSelectedHighlightId={setSelectedHighlightId}
                />
            </ReactFlowProvider>

            {selectedHighlightId && (
                <Box style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '30%',
                    backgroundColor: 'white',
                    borderTop: '1px solid #ccc',
                    zIndex: 5
                }}>
                    <NodeEditor highlight={selectedHighlightId} />
                </Box>
            )}
        </Box>
    );
}