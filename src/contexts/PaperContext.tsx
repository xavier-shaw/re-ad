import { createContext, useCallback, useEffect, useState } from "react";
import { Content, IHighlight, NewHighlight, ScaledPosition } from "react-pdf-highlighter";
import { type Node, type Edge, useNodesState, useEdgesState, type OnNodesChange, type OnEdgesChange, addEdge, Connection } from "@xyflow/react";

type PaperContextData = {
    highlights: Array<IHighlight>
    addHighlight: (highlight: NewHighlight) => void
    updateHighlight: (highlightId: string, position: Partial<ScaledPosition>, content: Partial<Content>) => void
    resetHighlights: () => void
    // Graph
    nodes: Array<Node>
    setNodes: (nodes: Array<Node>) => void
    onNodesChange: OnNodesChange
    edges: Array<Edge>
    setEdges: (edges: Array<Edge>) => void
    onEdgesChange: OnEdgesChange
    onConnect: (connection: Connection) => void
}

export const PaperContext = createContext<PaperContextData | null>(null);

export const PaperContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [highlights, setHighlights] = useState<Array<IHighlight>>([]);
    const [readId, setReadId] = useState(0);
    const [temporalSeq, setTemporalSeq] = useState(0);

    // Graph
    const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
    const NODE_OFFSET_X = 150;
    const NODE_OFFSET_Y = 150;

    const onConnect = useCallback((connection: Connection) => {
        console.log("Connect", connection);
        const edge = { ...connection, type: 'relation' };
        setEdges(prevEdges => addEdge(edge, prevEdges));
    }, []);

    useEffect(() => {
        setTemporalSeq(highlights.filter(h => h.id.startsWith(readId.toString())).length);
    }, [readId]);

    const addHighlight = (highlight: NewHighlight) => {
        console.log("Add highlight", highlight);
        setHighlights((prevHighlights: Array<IHighlight>) => [
            ...prevHighlights,
            {
                ...highlight,
                id: `${readId}-${temporalSeq}`,
            },
        ]);
        setTemporalSeq(prevTemporalSeq => prevTemporalSeq + 1);

        // add a node to the graph
        const isFirstHighlight = (temporalSeq === 0);
        setNodes((prevNodes: Array<Node>) => [
            ...prevNodes,
            {
                id: `${readId}-${temporalSeq}`,
                type: 'highlight',
                data: {
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
                    id: `temporal-${readId}-${temporalSeq}`,
                    type: 'temporal',
                    source: highlights[highlights.length - 1]?.id,
                    target: `${readId}-${temporalSeq}`,
                },
            ]);
        }
    };

    const updateHighlight = (
        highlightId: string,
        position: Partial<ScaledPosition>,
        content: Partial<Content>,
    ) => {
        console.log("Update highlight", highlightId, position, content);
        setHighlights((prevHighlights: Array<IHighlight>) =>
            prevHighlights.map((h) => {
                const {
                    id,
                    position: originalPosition,
                    content: originalContent,
                    ...rest
                } = h;
                return id === highlightId
                    ? {
                        id,
                        position: { ...originalPosition, ...position },
                        content: { ...originalContent, ...content },
                        ...rest,
                    }
                    : h;
            }),
        );
    };

    const resetHighlights = () => {
        setHighlights([]);
    };

    return (
        <PaperContext.Provider value={{
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
            onConnect
        }}>
            {children}
        </PaperContext.Provider>
    );
};
