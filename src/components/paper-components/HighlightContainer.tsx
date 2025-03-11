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
    // editHighlight,
    // onContextMenu,
}: HighlightContainerProps) {
    const {
        highlight,
        viewportToScaled,
        screenshot,
        isScrolledTo,
        highlightBindings,
    } = useHighlightContainerContext<CommentedHighlight>();

    return (
        highlight.type === "text" ?
            <TextHighlight
                isScrolledTo={isScrolledTo}
                highlight={highlight}
                style={{
                    background: readRecords[highlight.readRecordId].color,
                }}
            />
            :
            <AreaHighlight
                isScrolledTo={isScrolledTo}
                highlight={highlight}
                bounds={highlightBindings.textLayer}
                style={{
                    background: readRecords[highlight.readRecordId].color,
                }}
            />
    );

    // const highlightTip: Tip = {
    //     position: highlight.position,
    //     content: <HighlightPopup highlight={highlight} />,
    // };

    // return (
    //     <MonitoredHighlightContainer
    //         highlightTip={highlightTip}
    //         key={highlight.id}
    //         children={component}
    //     />
    // );
};

export default HighlightContainer;