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
import { CommentedHighlight } from "../components/paper-components/HighlightContainer";

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
  readRecords: Record<string, ReadRecord>;
  isAddingNewRead: boolean;
  setIsAddingNewRead: (isAddingNewRead: boolean) => void;
  createRead: (title: string, color: string) => void;
  currentReadId: string;
  setCurrentReadId: (readId: string) => void;
  displayedReads: Array<string>;
  hideRead: (readId: string) => void;
  showRead: (readId: string) => void;
  selectedHighlightId: string | null;
  setSelectedHighlightId: (highlightId: string | null) => void;
};

export const PaperContext = createContext<PaperContextData | null>(null);

type ReadRecord = {
  id: string;
  title: string;
  color: string;
};

export const PaperContextProvider = ({ children }: { children: React.ReactNode }) => {
  // Paper
  const [paperUrl, setPaperUrl] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Array<CommentedHighlight>>([]);
  const [temporalSeq, setTemporalSeq] = useState(0);

  // Shared
  const [readRecords, setReadRecords] = useState<Record<string, ReadRecord>>({});
  const [isAddingNewRead, setIsAddingNewRead] = useState(false);
  const [currentReadId, setCurrentReadId] = useState("0");
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);
  const [displayedReads, setDisplayedReads] = useState<Array<string>>([]);

  // Graph
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const NODE_OFFSET_X = 150;
  const NODE_OFFSET_Y = 150;

  const onConnect = useCallback((connection: Connection) => {
    console.log("Connect", connection);
    const edge = { ...connection, type: "relation" };
    setEdges((prevEdges) => addEdge(edge, prevEdges));
  }, []);

  useEffect(() => {
    setTemporalSeq(highlights.filter((h) => h.id.startsWith(currentReadId.toString())).length);
  }, [currentReadId]);

  const addHighlight = (highlight: GhostHighlight) => {
    console.log("Add highlight", highlight, highlights);
    setHighlights((prevHighlights: Array<CommentedHighlight>) => [
      ...prevHighlights,
      {
        ...highlight,
        id: `${currentReadId}-${temporalSeq}`,
        readRecordId: currentReadId,
      },
    ]);
    setTemporalSeq((prevTemporalSeq) => prevTemporalSeq + 1);

    // add a node to the graph
    const isFirstHighlight = temporalSeq === 0;
    setNodes((prevNodes: Array<Node>) => [
      ...prevNodes,
      {
        id: `${currentReadId}-${temporalSeq}`,
        type: "highlight",
        data: {
          id: `${currentReadId}-${temporalSeq}`,
          readRecordId: currentReadId,
          label: highlight.content.text,
          content: highlight.content.text
        },
        position: {
          x: isFirstHighlight ? Object.keys(readRecords).findIndex(id => id === currentReadId) * NODE_OFFSET_X : nodes[nodes.length - 1].position.x,
          y: isFirstHighlight ? NODE_OFFSET_Y : nodes[nodes.length - 1].position.y + NODE_OFFSET_Y,
        },
      },
    ]);

    // add an edge to the graph
    if (!isFirstHighlight) {
      setEdges((prevEdges: Array<Edge>) => [
        ...prevEdges,
        {
          id: `${currentReadId}-${temporalSeq}`,
          source: highlights[highlights.length - 1]?.id,
          target: `${currentReadId}-${temporalSeq}`,
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

  const createRead = (title: string, color: string) => {
    const newReadId = Object.keys(readRecords).length.toString();
    setReadRecords((prevReadRecords) => ({
      ...prevReadRecords,
      [newReadId]: { id: newReadId, title, color },
    }));
    setCurrentReadId(newReadId);
    showRead(newReadId);
  };

  const hideRead = (readId: string) => {
    setDisplayedReads((prevDisplayedReads) => prevDisplayedReads.filter((id) => id !== readId));
  }

  const showRead = (readId: string) => {
    setDisplayedReads((prevDisplayedReads) => [...prevDisplayedReads, readId]);
  }

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
        readRecords,
        isAddingNewRead,
        setIsAddingNewRead,
        currentReadId,
        setCurrentReadId,
        selectedHighlightId,
        setSelectedHighlightId,
        createRead,
        displayedReads,
        hideRead,
        showRead,
      }}
    >
      {children}
    </PaperContext.Provider>
  );
};
