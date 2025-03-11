import React, { useLayoutEffect, useRef, useState } from "react";
import CommentForm from "./CommentForm";
import {
  GhostHighlight,
  PdfSelection,
  usePdfHighlighterContext,
} from "react-pdf-highlighter-extended";
import "../../styles/ExpandableTip.css";

interface ExpandableTipProps {
  addHighlight: (highlight: GhostHighlight) => void;
  color: string;
}

const ExpandableTip = ({ addHighlight }: ExpandableTipProps) => {
  const selectionRef = useRef<PdfSelection | null>(null);

  const {
    getCurrentSelection,
    removeGhostHighlight,
    setTip,
    updateTipPosition,
    getGhostHighlight,
  } = usePdfHighlighterContext();

  return (
    <div className="Tip">
        <button
          className="Tip__compact"
          onClick={() => {
            selectionRef.current = getCurrentSelection();
            addHighlight(
              {
                content: selectionRef.current!.content,
                type: selectionRef.current!.type,
                position: selectionRef.current!.position,
              },
            );
            removeGhostHighlight();
            setTip(null);
          }}
        >
          Add highlight
        </button>
    </div>
  );
};

export default ExpandableTip;