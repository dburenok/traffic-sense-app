import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function Settings({ props }) {
  const [alignment, setAlignment] = useState("web");

  const handleChange = (_, newAlignment) => {
    setAlignment(newAlignment);
    console.log(newAlignment);
  };

  return (
    <Card>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <Typography gutterBottom>Data Mode</Typography>
          <ToggleButtonGroup color="primary" value={alignment} exclusive onChange={handleChange} aria-label="Platform">
            <ToggleButton value="web">15 min</ToggleButton>
            <ToggleButton value="android">Daily</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
    </Card>
  );
}
