import "@xyflow/react/dist/style.css";
import Dagre from '@dagrejs/dagre';
import { useState, useContext, useEffect, useCallback } from "react";
import {
  ReactFlow,
  type OnNodeDrag,
  Background,
  Controls,
  MiniMap,
  Panel,
  NodeMouseHandler,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import { Box, IconButton } from "@mui/material";
import HighlightNode from "../components/graph-components/HighlightNode";
import OverviewNode from "../components/graph-components/OverviewNode";
import TemporalEdge from "../components/graph-components/TemporalEdge";
import RelationEdge from "../components/graph-components/RelationEdge";
import { PaperContext } from "../contexts/PaperContext";
import NodeEditor from "../components/node-components/NodeEditor";
import { CloseFullscreen, OpenInFull } from "@mui/icons-material";

const nodeTypes = {
  highlight: HighlightNode,
  overview: OverviewNode,
};

const edgeTypes = {
  temporal: TemporalEdge,
  relation: RelationEdge,
};

function Flow(props: any) {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectedHighlightId,
    setSelectedHighlightId,
    setOnSelectNode
  } = props;
  const [isOverview, setIsOverview] = useState(false);

  const onNodeDrag: OnNodeDrag = (_, node) => {
    console.log("drag event", node.data);
  };

  const onNodeClick: NodeMouseHandler = (event, node) => {
    if (isOverview || !event) return;

    if (selectedHighlightId === node.id) {
      setSelectedHighlightId(null);
      setOnSelectNode(false);
    } else {
      setSelectedHighlightId(node.id);
      setOnSelectNode(true);
    }
  };

  const openOverview = () => {
    console.log("open Overview");
    if (isOverview) {
      setNodes(nodes.map((node: any) => ({ ...node, type: "highlight" })));
    } else {
      setNodes(nodes.map((node: any) => ({ ...node, type: "overview" })));
    }

    setSelectedHighlightId(null);
    setIsOverview(!isOverview);
  };

  const { fitView } = useReactFlow();

  const getLayoutedElements = (nodes: any, edges: any, options: any) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: options.direction });

    edges.forEach((edge: any) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node: any) =>
      g.setNode(node.id, {
        ...node,
        width: node.measured?.width ?? 0,
        height: node.measured?.height ?? 0,
      }),
    );

    Dagre.layout(g);

    return {
      nodes: nodes.map((node: any) => {
        const position = g.node(node.id);
        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        const x = position.x - (node.measured?.width ?? 0) / 2;
        const y = position.y - (node.measured?.height ?? 0) / 2;

        return { ...node, position: { x, y } };
      }),
      edges,
    };
  };

  const onLayout = useCallback((direction: string) => {
      console.log(nodes);
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    }, [nodes, edges]);

  useEffect(() => {
    if (nodes.length > 0) {
      console.log("layouting");
      onLayout("TB");
    }
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
      style={{ width: "100%", height: "100%" }}
    >
      <Background />
      <Controls onFitView={() => onLayout("TB")} style={{ color: "black" }} />
      <MiniMap />

      <Panel position="top-right">
        <IconButton onClick={openOverview}>{isOverview ? <CloseFullscreen /> : <OpenInFull />}</IconButton>
      </Panel>
    </ReactFlow>
  );
}

export default function GraphPanel() {
  const paperContext = useContext(PaperContext);
  if (!paperContext) {
    throw new Error("PaperContext not found");
  }
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectedHighlightId,
    setSelectedHighlightId,
    setOnSelectNode
  } = paperContext;

  return (
    <Box style={{ width: "100%", height: "100%", position: "relative" }}>
      <ReactFlowProvider>
        <Flow
          style={{ height: "auto" }}
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          selectedHighlightId={selectedHighlightId}
          setSelectedHighlightId={setSelectedHighlightId}
          setOnSelectNode={setOnSelectNode}
        />
      </ReactFlowProvider>

      {selectedHighlightId && (
        <Box
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "40%",
            backgroundColor: "white",
            borderTop: "1px solid #ccc",
            zIndex: 5,
          }}
        >
          <NodeEditor />
        </Box>
      )}
    </Box>
  );
}
