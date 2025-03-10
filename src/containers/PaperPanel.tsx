import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { Box } from "@mui/material";
import "../styles/PaperPanel.css";
import {
  GhostHighlight,
  Highlight,
  PdfHighlighter,
  PdfHighlighterUtils,
  PdfLoader,
  Tip,
  ViewportHighlight,
} from "react-pdf-highlighter-extended";

import HighlightContainer, { CommentedHighlight } from "../components/paper-components/HighlightContainer";
import Sidebar from "../components/paper-components/Sidebar";
import { PaperContext } from "../contexts/PaperContext";
import CommentForm from "../components/paper-components/CommentForm";
import ExpandableTip from "../components/paper-components/ExpandableTip";

function PaperPanel() {
  const paperContext = useContext(PaperContext);
  if (!paperContext) {
    throw new Error("PaperContext not found");
  }
  const {
    highlights,
    addHighlight,
    updateHighlight,
    resetHighlights,
    selectedHighlightId,
    setSelectedHighlightId,
    currentColor,
  } = paperContext;

  const parseIdFromHash = () => document.location.hash.slice("#highlight-".length);

  const resetHash = () => {
    document.location.hash = "";
  };

  const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021";

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const searchParams = new URLSearchParams(document.location.search);
  const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;

  const [url, setUrl] = useState(initialUrl);

  const [highlightPen, setHighlightPen] = useState<boolean>(false);

  // Refs for PdfHighlighter utilities
  const highlighterUtilsRef = useRef<PdfHighlighterUtils>(null);


  // Scroll to highlight based on hash in the URL
  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight && highlighterUtilsRef.current) {
      highlighterUtilsRef.current.scrollToHighlight(highlight);
    }
  };

  // Hash listeners for autoscrolling to highlights
  useEffect(() => {
    window.addEventListener("hashchange", scrollToHighlightFromHash);

    return () => {
      window.removeEventListener("hashchange", scrollToHighlightFromHash);
    };
  }, [scrollToHighlightFromHash]);

  // useEffect(() => {
  //     window.addEventListener("hashchange", scrollToHighlight, false);
  //     return () => {
  //         window.removeEventListener(
  //             "hashchange",
  //             scrollToHighlight,
  //             false,
  //         );
  //     };
  // }, [scrollToHighlight]);

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  useEffect(() => {
    console.log("selectedHighlightId", selectedHighlightId);
  }, [selectedHighlightId]);


  // const editHighlight = (
  //   idToUpdate: string,
  //   edit: Partial<CommentedHighlight>,
  // ) => {
  //   console.log(`Editing highlight ${idToUpdate} with `, edit);
  //   // setHighlights(
  //   //   highlights.map((highlight) =>
  //   //     highlight.id === idToUpdate ? { ...highlight, ...edit } : highlight,
  //   //   ),
  //   // );
  // };

  // Open comment tip and update highlight with new user input
  // const editComment = (highlight: ViewportHighlight<CommentedHighlight>) => {
  //   if (!highlighterUtilsRef.current) return;

  //   const editCommentTip: Tip = {
  //     position: highlight.position,
  //     content: (
  //       <CommentForm
  //         placeHolder={highlight.comment}
  //         onSubmit={(input) => {
  //           editHighlight(highlight.id, { comment: input });
  //           highlighterUtilsRef.current!.setTip(null);
  //           highlighterUtilsRef.current!.toggleEditInProgress(false);
  //         }}
  //       ></CommentForm>
  //     ),
  //   };

  //   highlighterUtilsRef.current.setTip(editCommentTip);
  //   highlighterUtilsRef.current.toggleEditInProgress(true);
  // };

  return (
    <Box style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row" }}>
      {/* <div>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="mb-4"
                />
            </div> */}
      <Sidebar highlights={highlights} resetHighlights={resetHighlights} toggleDocument={() => {}} />
      <div
        style={{
          height: "100%",
          width: "75%",
          position: "relative",
        }}
        className="help"
      >
        <PdfLoader document={url}>
          {(pdfDocument) => (
            <PdfHighlighter
              enableAreaSelection={(event) => event.altKey}
              pdfDocument={pdfDocument}
              onScrollAway={resetHash}
              utilsRef={(_pdfHighlighterUtils) => {
                highlighterUtilsRef.current = _pdfHighlighterUtils;
              }}
              // pdfScaleValue={pdfScaleValue}
              textSelectionColor={highlightPen ? "rgba(255, 226, 143, 1)" : undefined}
              onSelection={highlightPen ? (selection) => addHighlight(selection.makeGhostHighlight()) : undefined}
              selectionTip={highlightPen ? undefined : <ExpandableTip addHighlight={addHighlight} />}
              highlights={highlights}
            >
              <HighlightContainer
                // editHighlight={editHighlight}
                // onContextMenu={handleContextMenu}
              />
            </PdfHighlighter>
          )}
        </PdfLoader>
      </div>
    </Box>
  );
}

export default PaperPanel;
