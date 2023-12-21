import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ mr: "50px" }}>
          TrafficSense AI
        </Typography>
        <Button color="inherit">Map</Button>
        <Button color="inherit">About</Button>
      </Toolbar>
    </AppBar>
  );
}
