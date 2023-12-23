import { useEffect, useState, useCallback } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { map, toPairs, entries } from "lodash";
import TrafficMap from "./TrafficMap";
import TrafficChart from "./TrafficChart";
import Navbar from "./Navbar";
import About from "./About";
import Settings from "./Settings";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Dashboard({ props }) {
  const { trafficData } = props;
  const chartData = getChartData(trafficData);
  const numSnapshots = chartData.datasets[0].data.length;

  const [selectedPage, setSelectedPage] = useState("map");
  const [snapshotIndex, setSnapshotIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

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
              <TrafficChart props={{ chartData, numSnapshots, snapshotIndex, setSnapshotIndex }} />
            </Card>

            {/* <Card variant="outlined">
              <Settings props={{ playing, setPlaying }} />
            </Card> */}
          </Stack>
        ) : (
          <About />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default Dashboard;

function getChartData(trafficData) {
  const mergedCounts = getMergedCounts(trafficData);
  const mergedCountsData = map(entries(mergedCounts), ([t, c]) => ({ x: new Date(Date.parse(t)), y: c }));

  return {
    datasets: [
      {
        label: "hourly-traffic",
        data: mergedCountsData,
      },
    ],
  };
}

function getMergedCounts(trafficData) {
  const mergedCounts = new Map();
  const pairs = toPairs(trafficData);

  for (const [, { data }] of pairs) {
    for (const { t, c } of data) {
      if (mergedCounts.has(t)) {
        mergedCounts.set(t, mergedCounts.get(t) + c);
      } else {
        mergedCounts.set(t, c);
      }
    }
  }

  return mergedCounts;
}
