import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Button, IconButton } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useTour } from "../contexts/TourContext";


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

  const steps = [
    {
      target: '.upload-pdf',
      content: 'Get started by uploading your first PDF!',
    },
    {
      target: '.start-highlight',
      content: 'Get started by highlighting your first highlight! You can also hold option and take a screenshot as a highlight',
      placementBeacon: 'top',

    },
    {
      target: '.start-highlight',
      content: 'Each highlight you make will create a node corresponding to that node and the current read you are on. With this node, you are able to link them to other nodes, generate summaries & definitions, as well as take your own notes.',
      placementBeacon: 'top',
    },
  ];

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
    setSelectedHighlightId,
    currentReadId,
    readRecords,
    displayedReads,
    onSelectNode
  } = paperContext;

  // Refs for PdfHighlighter utilities
  const highlighterUtilsRef = useRef<PdfHighlighterUtils>(null);

  // Scroll to highlight based on hash in the URL
  const scrollToHighlightOnSelect = () => {
    const highlight = getHighlightById(selectedHighlightId as string);

    if (highlight && highlighterUtilsRef.current) {
      console.log("sceroll to highlight", highlight);
      highlighterUtilsRef.current.scrollToHighlight(highlight);
    }
  };

  useEffect(() => {
    console.log("onSelectNode", onSelectNode);
    console.log("selectedHighlightId", selectedHighlightId);
    if (selectedHighlightId && onSelectNode) {
      scrollToHighlightOnSelect();
    }
  }, [onSelectNode, selectedHighlightId]);

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  useEffect(() => {
    console.log("selectedHighlightId", selectedHighlightId);
  }, [selectedHighlightId]);

  const [sideBarOpen, setSideBarOpen] = useState(false);

  const { paperPanelRun, setPaperPanelRun, setNavBarRun } = useTour();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPaperUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      console.log("here")
      setNavBarRun(true)
      setPaperPanelRun(false)
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleTourCallback = (data: CallBackProps) => {
    console.log("called handleTourCallback!!!")
    if ((data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED)) {
      // setRun(true);
  }
}
  return (
    <Box style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row" }}>
      {paperPanelRun && <Joyride continuous steps={steps} run={paperPanelRun} callback={handleTourCallback} />}
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
            className="upload-pdf"
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
            className="pdf start-highlight"
          >
            <PdfLoader document={paperUrl}>
              {(pdfDocument) => (
                <PdfHighlighter
                  
                  enableAreaSelection={(event) => event.altKey}
                  pdfDocument={pdfDocument}
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
                  <HighlightContainer setSelectedHighlightId={setSelectedHighlightId} readRecords={readRecords} displayedReads={displayedReads} />
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
