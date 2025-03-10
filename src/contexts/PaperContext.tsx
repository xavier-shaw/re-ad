import { createContext, useCallback, useEffect, useState } from "react";
import { Content, GhostHighlight, ScaledPosition } from "react-pdf-highlighter-extended";
import {
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  type OnNodesChange,
  type OnEdgesChange,
  addEdge,
  Connection,
  MarkerType,
} from "@xyflow/react";
import { CommentedHighlight } from "../types";

type PaperContextData = {
  highlights: Array<CommentedHighlight>;
  addHighlight: (highlight: GhostHighlight) => void;
  updateHighlight: (highlightId: string, position: Partial<ScaledPosition>, content: Partial<Content>) => void;
  resetHighlights: () => void;
  // Graph
  nodes: Array<Node>;
  setNodes: (nodes: Array<Node>) => void;
  onNodesChange: OnNodesChange;
  edges: Array<Edge>;
  setEdges: (edges: Array<Edge>) => void;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  // Shared
  selectedHighlightId: string | null;
  setSelectedHighlightId: (highlightId: string | null) => void;
  currentColor: string | null;
  setCurrentColor: (color: string) => void;
};

export const PaperContext = createContext<PaperContextData | null>(null);

export const PaperContextProvider = ({ children }: { children: React.ReactNode }) => {
  // Paper
  const [paperUrl, setPaperUrl] = useState<string | null>(null);
  const [readId, setReadId] = useState(0);
  const [highlights, setHighlights] = useState<Array<CommentedHighlight>>([]);
  const [temporalSeq, setTemporalSeq] = useState(0);

  // Shared
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);

  // Graph
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const NODE_OFFSET_X = 150;
  const NODE_OFFSET_Y = 150;

  const [currentColor, setCurrentColor] = useState<string | null>(null);

  const onConnect = useCallback((connection: Connection) => {
    console.log("Connect", connection);
    const edge = { ...connection, type: "relation" };
    setEdges((prevEdges) => addEdge(edge, prevEdges));
  }, []);

  useEffect(() => {
    setTemporalSeq(highlights.filter((h) => h.id.startsWith(readId.toString())).length);
  }, [readId]);

  const addHighlight = (highlight: GhostHighlight) => {
    console.log("Add highlight", highlight);
    setHighlights((prevHighlights: Array<CommentedHighlight>) => [
      ...prevHighlights,
      {
        ...highlight,
        id: `${readId}-${temporalSeq}`,
      },
    ]);
    setTemporalSeq((prevTemporalSeq) => prevTemporalSeq + 1);

    // add a node to the graph
    const isFirstHighlight = temporalSeq === 0;
    setNodes((prevNodes: Array<Node>) => [
      ...prevNodes,
      {
        id: `${readId}-${temporalSeq}`,
        type: "highlight",
        data: {
          id: `${readId}-${temporalSeq}`,
          label: highlight.content.text,
          content: highlight.content.text,
        },
        position: {
          x: isFirstHighlight ? readId * NODE_OFFSET_X : nodes[nodes.length - 1].position.x,
          y: isFirstHighlight ? NODE_OFFSET_Y : nodes[nodes.length - 1].position.y + NODE_OFFSET_Y,
        },
      },
    ]);

    // add an edge to the graph
    if (!isFirstHighlight) {
      setEdges((prevEdges: Array<Edge>) => [
        ...prevEdges,
        {
          id: `${readId}-${temporalSeq}`,
          source: highlights[highlights.length - 1]?.id,
          target: `${readId}-${temporalSeq}`,
          type: "temporal",
          markerEnd: { type: MarkerType.Arrow },
        },
      ]);
    }
  };

  const updateHighlight = (highlightId: string, position: Partial<ScaledPosition>, content: Partial<Content>) => {
    console.log("Update highlight", highlightId, position, content);
    setHighlights((prevHighlights: Array<CommentedHighlight>) =>
      prevHighlights.map((h) => {
        const { id, position: originalPosition, content: originalContent, ...rest } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      })
    );
  };

  const resetHighlights = () => {
    setHighlights([]);
  };

  return (
    <PaperContext.Provider
      value={{
        highlights,
        addHighlight,
        updateHighlight,
        resetHighlights,
        // Graph
        nodes,
        setNodes,
        onNodesChange,
        edges,
        setEdges,
        onEdgesChange,
        onConnect,
        // Shared
        selectedHighlightId,
        setSelectedHighlightId,
        currentColor,
        setCurrentColor,
      }}
    >
      {children}
    </PaperContext.Provider>
  );
};
