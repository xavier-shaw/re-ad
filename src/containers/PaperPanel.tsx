import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Button, IconButton } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";

import "../styles/PaperPanel.css";
import {
  PdfHighlighter,
  PdfHighlighterUtils,
  PdfLoader,
} from "react-pdf-highlighter-extended";

import HighlightContainer from "../components/paper-components/HighlightContainer";
import Sidebar from "../components/paper-components/Sidebar";
import { PaperContext } from "../contexts/PaperContext";
import ExpandableTip from "../components/paper-components/ExpandableTip";
import { ArrowForward, UploadFile } from "@mui/icons-material";

function PaperPanel() {
  const paperContext = useContext(PaperContext);
  if (!paperContext) {
    throw new Error("PaperContext not found");
  }
  const {
    paperUrl,
    setPaperUrl,
    highlights,
    addHighlight,
    resetHighlights,
    selectedHighlightId,
    currentReadId,
    readRecords,
    displayedReads,
  } = paperContext;

  const parseIdFromHash = () => document.location.hash.slice("#highlight-".length);

  const resetHash = () => {
    document.location.hash = "";
  };

  // const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021";
  // const searchParams = new URLSearchParams(document.location.search);
  // const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;

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

  const [sideBarOpen, setSideBarOpen] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPaperUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <Box style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row" }}>
      {!paperUrl ?
        <Box sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
          {/* Hidden Input for File Upload */}
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            id="pdf-upload"
          />

          {/* Button to Trigger File Upload */}
          <label htmlFor="pdf-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadFile />}
            >
              Upload PDF
            </Button>
          </label>
        </Box>
        :
        <>
          {sideBarOpen && <Sidebar highlights={highlights} resetHighlights={resetHighlights} />}
          {sideBarOpen && (
            <IconButton
              sx={{
                position: "absolute",
                left: "calc(15% - 10px)", // Adjust based on your left panel width
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "white",
                "&:hover": { backgroundColor: "#f0f0f0" },
                boxShadow: 2,
                zIndex: 1000,
                width: "24px",
                height: "48px",
                borderRadius: "0 4px 4px 0",
              }}
              onClick={() => setSideBarOpen(false)}
            >
              <ArrowBack />
            </IconButton>
          )}
          {!sideBarOpen && (
            <IconButton
              sx={{
                position: "fixed",
                left: "0",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "white",
                "&:hover": { backgroundColor: "#f0f0f0" },
                boxShadow: 2,
                zIndex: 1000,
                width: "24px",
                height: "48px",
                borderRadius: "0 4px 4px 0",
              }}
              onClick={() => setSideBarOpen(true)}
            >
              <ArrowForward />
            </IconButton>
          )}

          <div
            style={{
              height: "100%",
              width: sideBarOpen ? "calc(75%)" : "100%",
              position: "relative",
            }}
            className="pdf"
          >
            <PdfLoader document={paperUrl}>
              {(pdfDocument) => (
                <PdfHighlighter
                  enableAreaSelection={(event) => event.altKey}
                  pdfDocument={pdfDocument}
                  onScrollAway={resetHash}
                  utilsRef={(_pdfHighlighterUtils) => {
                    highlighterUtilsRef.current = _pdfHighlighterUtils;
                  }}
                  // pdfScaleValue={pdfScaleValue}
                  // textSelectionColor={undefined}
                  // onSelection={undefined}
                  selectionTip={
                    Object.keys(readRecords).length > 0 ? (
                      <ExpandableTip addHighlight={addHighlight} color={readRecords[currentReadId]?.color} />
                    ) : null
                  }
                  highlights={highlights}
                  textSelectionColor={readRecords[currentReadId]?.color}
                >
                  <HighlightContainer readRecords={readRecords} displayedReads={displayedReads} />
                </PdfHighlighter>
              )}
            </PdfLoader>
          </div>
        </>
      }
    </Box>
  );
}

export default PaperPanel;
