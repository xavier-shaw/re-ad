import React, { MouseEvent, useContext } from "react";
import HighlightPopup from "./HighlightPopUp";

import {
    AreaHighlight,
    MonitoredHighlightContainer,
    TextHighlight,
    Tip,
    ViewportHighlight,
    useHighlightContainerContext,
    usePdfHighlighterContext,
} from "react-pdf-highlighter-extended";
import { Content, Highlight } from "react-pdf-highlighter-extended";
import { PaperContext } from "../../contexts/PaperContext";

export interface CommentedHighlight extends Highlight {
    id: string;
    readRecordId: string;
    content: Content;
    comment?: string;
}

interface HighlightContainerProps {
    readRecords: any;
    displayedReads: Array<string>;
    // editHighlight: (
    //     idToUpdate: string,
    //     edit: Partial<CommentedHighlight>,
    // ) => void;
    // onContextMenu?: (
    //     event: MouseEvent<HTMLDivElement>,
    //     highlight: ViewportHighlight<CommentedHighlight>,
    // ) => void;
}

function HighlightContainer({
    readRecords,
    displayedReads,
    // editHighlight,
    // onContextMenu,
}: HighlightContainerProps) {
    const {
        highlight,
        isScrolledTo,
        highlightBindings,
    } = useHighlightContainerContext<CommentedHighlight>();

    // Transparent Colors: #f2f2f2, #e6e6e6, #d9d9d9
    const color = displayedReads.includes(highlight.readRecordId) ? readRecords[highlight.readRecordId].color : "#e6e6e6";

    return (
        highlight.type === "text" ?
            <TextHighlight
                isScrolledTo={isScrolledTo}
                highlight={highlight}
                style={{
                    background: color,
                }}
            />
            :
            <AreaHighlight
                isScrolledTo={isScrolledTo}
                highlight={highlight}
                bounds={highlightBindings.textLayer}
                style={{
                    background: color,
                    pointerEvents: "none",
                }}
            />
    );
};

export default HighlightContainer;