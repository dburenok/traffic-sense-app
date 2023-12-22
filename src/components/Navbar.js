import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function Navbar({ props }) {
  const { setSelectedPage } = props;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ mr: "50px" }}>
          TrafficSense
        </Typography>
        <Button color="inherit" onClick={() => setSelectedPage("map")}>
          Map
        </Button>
        <Button color="inherit" onClick={() => setSelectedPage("about")}>
          About
        </Button>
      </Toolbar>
    </AppBar>
  );
}
