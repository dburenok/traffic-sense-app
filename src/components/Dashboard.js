import { useState, useMemo } from "react";
import { map, toPairs, forEach, filter, values, flatten, reduce } from "lodash";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
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

  const [selectedPage, setSelectedPage] = useState("map");
  const [snapshotIndex, setSnapshotIndex] = useState(0);
  const [dataMode, setDataMode] = useState("relative");

  const maxNumVehicles = useMemo(() => getMaxNumVehicles(trafficData), [trafficData]);
  const chartData = useMemo(() => getChartData(trafficData, snapshotIndex), [trafficData, snapshotIndex]);
  const mapData = useMemo(
    () => getMapData(trafficData, snapshotIndex, dataMode, maxNumVehicles),
    [trafficData, snapshotIndex, dataMode, maxNumVehicles]
  );

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
            <Grid item lg={10} xs={12}>
              <TrafficChart props={{ chartData, setSnapshotIndex }} />
            </Grid>
            <Grid item lg={2} xs={12}>
              <Settings props={{ dataMode, setDataMode }} />
            </Grid>
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
    const msPerQuarterHour = 15 * 60 * 1000;
    let timestamp = Date.parse(`${date}T00:00:00.000-08:00`);
    forEach(counts, (count) => {
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

function getMapData(trafficData, snapshotIndex, dataMode, maxNumVehicles) {
  const pairs = filter(toPairs(trafficData), ([intersectionName]) => intersectionName !== "*");

  return map(pairs, ([intersection, { data, location }]) => ({
    intersection,
    location,
    trafficLoad: getTrafficLoad(data, snapshotIndex, dataMode, maxNumVehicles),
  }));
}

function getMaxNumVehicles(trafficData) {
  return reduce(
    map(
      map(
        map(
          filter(toPairs(trafficData), ([intersectionName]) => intersectionName !== "*"),
          1
        ),
        "data"
      ),
      (d) => flatten(values(d))
    ),
    (pv, cv) => Math.max(pv, ...cv),
    0
  );
}

function getTrafficLoad(data, snapshotIndex, dataMode, maxNumVehicles) {
  const pairs = toPairs(data);
  const continuousCounts = [];

  for (const [, counts] of pairs) {
    continuousCounts.push(...counts);
  }

  if (snapshotIndex >= continuousCounts.length) {
    return -1;
  }

  if (dataMode === "relative") {
    const max = Math.max(...continuousCounts);
    if (max === 0) {
      return 0;
    }

    return continuousCounts[snapshotIndex] / max;
  }

  return continuousCounts[snapshotIndex] / maxNumVehicles;
}
