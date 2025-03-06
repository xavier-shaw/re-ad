import { EdgeProps, BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow, MarkerType } from "@xyflow/react";

export default function TemporalEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
}: EdgeProps) {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ stroke: 'blue', strokeWidth: 2, strokeDasharray: '5,5' }}/>
            <EdgeLabelRenderer>
                <div
                    className="nodrag nopan"
                    style={{
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                    }}
                >
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
