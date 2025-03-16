import React, { useState, useContext, useEffect } from "react";
import "../../styles/NavBar.css";
import { PaperContext } from "../../contexts/PaperContext";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { FormControlLabel } from "@mui/material";
import { Add } from "@mui/icons-material";
import logo from "../../assets/re-ad-logo.png";

import Joyride, { Step } from "react-joyride";
import { useTour } from "../../contexts/TourContext";


export default function NavBar() {
    const steps = [
      {
        target: '.setting-up-first-read',
        content: 'Get started with setting up your first read here! Different reads should be mapped to different intentions.',
      },
      {
        target: '.active-read',
        content: 'You can see what read you are currently on. Any highlight will be associated with the selected read. Use this to also toggle between your reads.',
      },
    ];

  const paperContext = useContext(PaperContext);
  if (!paperContext) {
    throw new Error("PaperContext not found");
  }
  const { paperUrl, readRecords, currentReadId, setCurrentReadId, setIsAddingNewRead, displayedReads, hideRead, showRead } =
    paperContext;

  const handleAddRead = () => {
    if (!paperUrl) {
      alert("Please upload a paper first");
      return;
    }

    setIsAddingNewRead(true);
  };

  const { run } = useTour();

  return (
    <div className="NavBar">
      {/* <Joyride steps={steps} run={run} /> */}
      {run && <Joyride steps={steps} run={run} />}
      <div className="logo-text">
        <img src={logo} height={40} />
        <h3>e:ad</h3>
      </div>

      <Box className="highlights" sx={{ mx: 2 }}>
        {Object.values(readRecords).length > 0 &&
          Object.values(readRecords).map((readRecord) => (
            <Box className="read" key={readRecord.id} sx={{ borderBottom: currentReadId === readRecord.id ? `2px solid ${readRecord.color}` : "none" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => {
                      if (displayedReads.includes(readRecord.id)) {
                        hideRead(readRecord.id);
                      } else {
                        showRead(readRecord.id);
                      }
                    }}
                    sx={{
                      color: readRecord.color,
                      "&.Mui-checked": {
                        color: readRecord.color,
                      },
                    }}
                    checked={displayedReads.includes(readRecord.id)}
                    disabled={currentReadId === readRecord.id}
                  />
                }
                label={readRecord.title}
              />
            </Box>
          ))}

        {Object.values(readRecords).length > 0 ? (
          <IconButton onClick={handleAddRead}>
            <Add />
          </IconButton>
        ) : (
          <Button
            className="mui-button"
            size="small"
            variant="text"
            startIcon={<Add />}
            onClick={handleAddRead}
          >
            {/* for some ungodly reason this text refuses to be centered so this will do */}
            <span className="setting-up-first-read" style={{ lineHeight: 0 }}>NEW READ</span>
          </Button>
        )}
      </Box>
      <Box className="active-read" sx={{ mx: 3, display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
        <h4>Active Read:</h4>
        {Object.values(readRecords).length > 0 ? (
          <div>
            <FormControl size="small" fullWidth>
              <Select
                value={currentReadId}
                onChange={(e) => setCurrentReadId(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: readRecords[currentReadId].color,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: readRecords[currentReadId].color,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: readRecords[currentReadId].color,
                  },
                }}
              >
                {Object.values(readRecords).map((record) => (
                  <MenuItem key={record.id} value={record.id}>
                    {record.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        ) : (
          <div>
            <p>None</p>
          </div>
        )}
      </Box>
    </div>
  );
}
