import { useState } from "react";
import TrafficMap from "./TrafficMap";
import TrafficChart from "./TrafficChart";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Navbar from "./Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Dashboard({ props }) {
  const { trafficData } = props;

  const [selectedPage, setSelectedPage] = useState("map");
  const [snapshotIndex, setSnapshotIndex] = useState(-1);

  return (
    <ThemeProvider theme={darkTheme}>
      <Navbar props={{ setSelectedPage }} />
      <Container maxWidth="lg" sx={{ mt: "15px" }}>
        {selectedPage === "map" ? (
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
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
            <Typography variant="h4" textAlign={"left"} gutterBottom>
              <b>TrafficSense</b> is a (near) real-time visualization of traffic patterns in Vancouver, BC, Canada.
            </Typography>
            <Typography variant="body1" textAlign={"left"}>
              Although traffic trends can be easily accessed through Google Maps (or similar tools), the source data and
              the algorithms used to compile it are proprietary. TrafficSense aims to provide free, open access to
              real-time traffic data by leveraging the power of machine learning paired with public-domain traffic
              cameras available in most cities.
            </Typography>
            <img
              width={"33%"}
              style={{ margin: "20px" }}
              src={"./example.jpg"}
              alt={"traffic camera images example page"}
              loading="lazy"
            />
            <Typography variant="body1" textAlign={"left"}>
              Publicly-available traffic camera images are run through an object-detection model in real-time to count
              the number of vehicles in the frame. These values are matched to their respective location of the
              intersection on a map.
            </Typography>
            <img
              width={"33%"}
              style={{ margin: "20px" }}
              src={"./inference-result.jpg"}
              alt={"inference result example"}
              loading="lazy"
            />
            <Typography variant="body1" textAlign={"left"} gutterBottom>
              Currently, we only support Vancouver, BC.
            </Typography>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default Dashboard;
