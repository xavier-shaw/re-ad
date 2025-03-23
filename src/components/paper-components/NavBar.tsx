import { useContext } from "react";
import "../../styles/NavBar.css";
import { PaperContext } from "../../contexts/PaperContext";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  MenuItem,
  Select
} from "@mui/material";
import { FormControlLabel } from "@mui/material";
import { Add } from "@mui/icons-material";
import logo from "/re-ad-logo.svg";
import { TourContext } from "../../contexts/TourContext";

export default function NavBar() {
  const paperContext = useContext(PaperContext);
  if (!paperContext) {
    throw new Error("PaperContext not found");
  }
  const {
    paperUrl,
    readRecords,
    currentReadId,
    setCurrentReadId,
    setIsAddingNewRead,
    displayedReads,
    hideRead,
    showRead,
  } = paperContext;

  const tourContext = useContext(TourContext);
  if (!tourContext) {
    throw new Error("TourContext not found");
  }

  const handleAddRead = () => {
    if (!paperUrl) {
      alert("Please upload a paper first");
      return;
    }

    setIsAddingNewRead(true);
  };

  return (
    <div className="NavBar">
      <div className="logo-text">
        <img src={logo} height={40} alt="re:ad" />
      </div>

      <Box className="highlights" sx={{ mx: 2 }}>
        {Object.values(readRecords).length > 0 &&
          Object.values(readRecords).map((readRecord) => (
            <Box
              className="read"
              key={readRecord.id}
              sx={{ borderBottom: currentReadId === readRecord.id ? `2px solid ${readRecord.color}` : "none" }}
            >
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
          <Button className="mui-button add-new-read-btn" size="small" variant="text" startIcon={<Add />} onClick={handleAddRead}>
            {/* for some ungodly reason this text refuses to be centered so this will do */}
            <span style={{ lineHeight: 0 }}>
              new read
            </span>
          </Button>
        )}
      </Box>
      <Box className="active-read" sx={{ mx: 3, display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
        <h4>active read:</h4>
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
            <p>none</p>
          </div>
        )}
      </Box>
    </div>
  );
}
