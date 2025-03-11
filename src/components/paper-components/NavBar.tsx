import React, { useState, useContext } from "react";
import "../../styles/NavBar.css";
import { PaperContext } from "../../contexts/PaperContext";
import { Box, Checkbox, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FormControlLabel } from "@mui/material";

export default function NavBar() {
  const paperContext = useContext(PaperContext);
  if (!paperContext) {
    throw new Error("PaperContext not found");
  }
  const { readRecords, currentReadId, setCurrentReadId } = paperContext;

  return (
    <div className="NavBar">
      <h3>RE:AD</h3>
      <div className="highlights">
        {Object.values(readRecords).map((readRecord) => (
          <div key={readRecord.id}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={() => {}}
                  sx={{
                    color: readRecord.color,
                    '&.Mui-checked': {
                      color: readRecord.color,
                    },
                  }}
                />
              }
              label={readRecord.title}
            />
          </div>
        ))}
        <div>
          <button onClick={() => {}} style={{ border: "none", cursor: "pointer" }}>
            +
          </button>
        </div>
      </div>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
        <h4>Active Read</h4>
        <div>
          <FormControl size="small" fullWidth>
            <Select
              value={currentReadId}
              onChange={(e) => setCurrentReadId(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: readRecords[currentReadId].color,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: readRecords[currentReadId].color,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
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
      </Box>
    </div>
  );
}
