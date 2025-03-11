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
import { ReadHighlight } from "../components/paper-components/HighlightContainer";
import { NodeData } from "../components/node-components/NodeEditor";

type PaperContextData = {
  // Paper
  paperUrl: string | null;
  setPaperUrl: (paperUrl: string | null) => void;
  highlights: Array<ReadHighlight>;
  addHighlight: (highlight: GhostHighlight) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  deleteHighlight: (highlightId: string) => void;
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
  const [highlights, setHighlights] = useState<Array<ReadHighlight>>([]);
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
    const edge = { ...connection, type: "relation", markerEnd: { type: MarkerType.Arrow } };
    setEdges((prevEdges) => addEdge(edge, prevEdges));
  }, []);

  useEffect(() => {
    setTemporalSeq(highlights.filter((h) => h.id.startsWith(currentReadId.toString())).length);
  }, [currentReadId]);

  const processHighlightText = (highlight: GhostHighlight) => {
    if (highlight.type === "text") {
      const text = highlight.content.text?.trim() ?? "";
      const words = text.split(/\s+/);
      const truncatedText = words.length > 10 ? words.slice(0, 10).join(" ") + "..." : text;
      return {
        type: highlight.type,
        label: truncatedText,
        content: highlight.content.text,
      };
    }
    else if (highlight.type === "area") {
      return {
        type: highlight.type,
        label: "Image",
        content: highlight.content.image,
      };
    }
  }

  const addHighlight = (highlight: GhostHighlight) => {
    console.log("Add highlight", highlight, highlights);
    const id = `${currentReadId}-${temporalSeq}`;
    setTemporalSeq((prevTemporalSeq) => prevTemporalSeq + 1);

    setHighlights((prevHighlights: Array<ReadHighlight>) => [
      ...prevHighlights,
      {
        ...highlight,
        id: id,
        readRecordId: currentReadId,
      },
    ]);

    // add a node to the graph
    const isFirstHighlight = temporalSeq === 0;
    setNodes((prevNodes: Array<Node>) => [
      ...prevNodes,
      {
        id: id,
        type: "highlight",
        data: {
          id: id,
          readRecordId: currentReadId,
          ...processHighlightText(highlight),
          // user notes
          summary: "",
          references: [],
          notes: "Write your notes here...",
        },
        position: {
          x: isFirstHighlight
            ? Object.keys(readRecords).findIndex((id) => id === currentReadId) * NODE_OFFSET_X
            : nodes[nodes.length - 1].position.x,
          y: isFirstHighlight ? NODE_OFFSET_Y : nodes[nodes.length - 1].position.y + NODE_OFFSET_Y,
        },
      },
    ]);

    console.log("Nodes", nodes);

    // add an edge to the graph
    if (!isFirstHighlight) {
      // TODO: should temporal link capture the switch between reads?
      const lastHighlightId = highlights[highlights.length - 1]?.id;
      setEdges((prevEdges: Array<Edge>) => [
        ...prevEdges,
        {
          id: id,
          source: lastHighlightId,
          target: id,
          type: "temporal",
          markerEnd: { type: MarkerType.Arrow },
        },
      ]);
    }

    // set current node to be selected and open the node editor
    setSelectedHighlightId(id);
  };

  const updateNodeData = (nodeId: string, data: Partial<NodeData>) => {
    let currentNodes = [...nodes];
    currentNodes = currentNodes.map((node) => {
      if (node.id === nodeId) {
        return { ...node, data: { ...node.data, ...data } };
      }
      return node;
    });

    console.log("Updated nodes", currentNodes);
    setNodes(currentNodes);
  };

  const deleteHighlight = (highlightId: string) => {
    console.log("Delete highlight", highlightId);
    setHighlights(highlights.filter((h) => h.id !== highlightId));
    setNodes(nodes.filter((n) => n.id !== highlightId));
    // TODO: connnect prev and next node
    setEdges(edges.filter((e) => e.id !== highlightId && e.source !== highlightId && e.target !== highlightId));
    setSelectedHighlightId(null);
  };

  const resetHighlights = () => {
    console.log("Reset highlights");
    setHighlights([]);
    setNodes([]);
    setEdges([]);
    setSelectedHighlightId(null);
    setTemporalSeq(0);
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
  };

  const showRead = (readId: string) => {
    setDisplayedReads((prevDisplayedReads) => [...prevDisplayedReads, readId]);
  };

  return (
    <PaperContext.Provider
      value={{
        // Paper
        paperUrl,
        setPaperUrl,
        highlights,
        addHighlight,
        updateNodeData,
        deleteHighlight,
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
