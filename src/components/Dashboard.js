import { useState } from "react";
import TrafficMap from "./TrafficMap";
import TrafficChart from "./TrafficChart";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Navbar from "./Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Dashboard({ props }) {
  const { trafficData } = props;

  const [snapshotIndex, setSnapshotIndex] = useState(0);

  return (
    <ThemeProvider theme={darkTheme}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: "15px" }}>
        <Stack spacing={0.5}>
          <Card variant="outlined">
            <TrafficMap props={{ trafficData, snapshotIndex }} />
          </Card>

          <Card variant="outlined">
            <Box>
              <TrafficChart props={{ trafficData, setSnapshotIndex }} />
            </Box>
          </Card>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default Dashboard;
