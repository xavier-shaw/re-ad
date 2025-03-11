import React, { useState, useContext } from "react";
import "../../styles/NavBar.css";
import { PaperContext } from "../../contexts/PaperContext";
import { Box, Button, Checkbox, FormControl, Icon, IconButton, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import { Add } from "@mui/icons-material";

export default function NavBar() {
  const paperContext = useContext(PaperContext);
  if (!paperContext) {
    throw new Error("PaperContext not found");
  }
  const { readRecords, currentReadId, setCurrentReadId, setIsAddingNewRead } = paperContext;

  return (
    <div className="NavBar">
      <Typography variant="h4" sx={{ mx: 3 }}>
        RE:AD
      </Typography>
      <Box className="highlights" sx={{ mx: 2 }}>
        {Object.values(readRecords).length > 0 && Object.values(readRecords).map((readRecord) => (
          <div key={readRecord.id}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={() => { }}
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

        {Object.values(readRecords).length > 0 ?
          <IconButton onClick={() => setIsAddingNewRead(true)}>
            <Add />
          </IconButton>
          :
          <Button size="small" variant="contained" startIcon={<Add />} onClick={() => setIsAddingNewRead(true)}>
            New Read
          </Button>
        }
      </Box>
      <Box sx={{ mx: 3, display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
        <h4>Active Read:</h4>
        {Object.values(readRecords).length > 0 ?
          (
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
          ) : (
            <div>
              <p>None</p>
            </div>
          )}
      </Box>
    </div>
  );
}
