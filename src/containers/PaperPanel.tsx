import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { Box } from "@mui/material";
import "../styles/PaperPanel.css";
import { AreaHighlight, Highlight, PdfHighlighter, PdfLoader, Popup, Tip } from "react-pdf-highlighter";
import type { IHighlight } from "react-pdf-highlighter";

import { Sidebar } from "../components/paper-components/Sidebar";
import { Spinner } from "../components/paper-components/Spinner";
import { PaperContext } from "../contexts/PaperContext";

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

  const HighlightPopup = ({ comment }: { comment: { text: string; emoji: string } }) =>
    comment.text ? (
      <div className="Highlight__popup">
        {comment.emoji} {comment.text}
      </div>
    ) : null;

  const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021";

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const searchParams = new URLSearchParams(document.location.search);
  const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;

  const [url, setUrl] = useState(initialUrl);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setUrl(url);
      resetHighlights();
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const scrollViewerTo = useRef((highlight: IHighlight) => {});

  const scrollToHighlight = useCallback(() => {
    if (selectedHighlightId) {
      const highlight = getHighlightById(selectedHighlightId);
      if (highlight) {
        scrollViewerTo.current(highlight);
      }
    }
  }, [selectedHighlightId]);

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
      <Sidebar highlights={highlights} resetHighlights={resetHighlights} />
      <div
        style={{
          height: "100%",
          width: "75%",
          position: "relative",
        }}
        className="help"
      >
        <PdfLoader url={url} beforeLoad={<Spinner />}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={(event) => event.altKey}
              onScrollChange={resetHash}
              scrollRef={(scrollTo) => {
                scrollViewerTo.current = scrollTo;
                scrollToHighlight();
              }}
              onSelectionFinished={(position, content, hideTipAndSelection, transformSelection) => (
                <Tip
                  onOpen={transformSelection}
                  onConfirm={(comment) => {
                    addHighlight({ content, position, comment, color: currentColor ? currentColor : "yellow" });
                    hideTipAndSelection();
                  }}
                />
              )}
              highlightTransform={(highlight, index, setTip, hideTip, viewportToScaled, screenshot, isScrolledTo) => {
                const isTextHighlight = !highlight.content?.image;

                console.log("highlight");
                const component = isTextHighlight ? (
                  <Highlight isScrolledTo={isScrolledTo} position={highlight.position} comment={highlight.comment} />
                ) : (
                  <AreaHighlight
                    isScrolledTo={isScrolledTo}
                    highlight={highlight}
                    onChange={(boundingRect) => {
                      updateHighlight(
                        highlight.id,
                        { boundingRect: viewportToScaled(boundingRect) },
                        { image: screenshot(boundingRect) }
                      );
                    }}
                  />
                );

                return (
                  <Popup
                    popupContent={<HighlightPopup {...highlight} />}
                    onMouseOver={(popupContent) => setTip(highlight, (highlight) => popupContent)}
                    onMouseOut={hideTip}
                    key={index}
                  >
                    <div className={`highlight ${highlight.color}`}>{component}</div>
                  </Popup>
                );
              }}
              highlights={highlights}
            />
          )}
        </PdfLoader>
      </div>
    </Box>
  );
}

export default PaperPanel;
