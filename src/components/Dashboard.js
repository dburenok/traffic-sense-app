import { useState, useMemo } from "react";
import { map, toPairs, forEach, dropRight, filter } from "lodash";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TrafficMap from "./TrafficMap";
import TrafficChart from "./TrafficChart";
import Navbar from "./Navbar";
import About from "./About";
// import Settings from "./Settings";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Dashboard({ props }) {
  const { trafficData } = props;

  const [selectedPage, setSelectedPage] = useState("map");
  const [snapshotIndex, setSnapshotIndex] = useState(0);

  const chartData = useMemo(() => getChartData(trafficData, snapshotIndex), [trafficData, snapshotIndex]);
  const mapData = useMemo(() => getMapData(trafficData, snapshotIndex), [trafficData, snapshotIndex]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Navbar props={{ setSelectedPage }} />
      <Container maxWidth="100%">
        {selectedPage === "map" ? (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box sx={{ height: "70vh" }}>
                <TrafficMap props={{ mapData }} />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TrafficChart props={{ chartData, setSnapshotIndex }} />
            </Grid>
            {/* <Grid item lg={2} xs={12}>
              <Settings props={{}} />
            </Grid> */}
          </Grid>
        ) : (
          <About />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default Dashboard;

function getChartData(trafficData, snapshotIndex) {
  const mergedCounts = trafficData["*"].data;
  const pairs = toPairs(mergedCounts);
  const data = [];

  for (const [date, counts] of pairs) {
    const normalizedCounts = counts.length !== 96 ? dropRight(counts) : counts; // don't show current, incomplete quarter-hour
    const msPerQuarterHour = 15 * 60 * 1000;
    let timestamp = Date.parse(`${date}T00:00:00.000-08:00`);
    forEach(normalizedCounts, (count) => {
      data.push({
        x: timestamp,
        y: count,
      });

      timestamp += msPerQuarterHour;
    });
  }

  return {
    datasets: [
      {
        label: "live-traffic",
        data,
        backgroundColor: map(data, (_, i) => (i === snapshotIndex ? "red" : "cyan")),
      },
    ],
  };
}

function getMapData(trafficData, snapshotIndex) {
  const pairs = filter(toPairs(trafficData), ([intersectionName]) => intersectionName !== "*");

  return map(pairs, ([intersection, { data, location }]) => {
    return {
      intersection,
      location,
      trafficLoad: getTrafficLoad(data, snapshotIndex),
    };
  });
}

function getTrafficLoad(data, snapshotIndex) {
  const pairs = toPairs(data);
  const continuousCounts = [];

  for (const [, counts] of pairs) {
    const normalizedCounts = counts.length !== 96 ? dropRight(counts) : counts; // don't show current, incomplete quarter-hour
    continuousCounts.push(...normalizedCounts);
  }

  if (snapshotIndex >= continuousCounts.length) {
    return -1;
  }

  const max = Math.max(...continuousCounts);
  if (max === 0) {
    return 0;
  }

  return continuousCounts[snapshotIndex] / max;
}
