import { useEffect, useState, useRef, useMemo } from "react";
import { map, toPairs, forEach, dropRight, filter } from "lodash";
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

const ANIMATION_INTERVAL = 1000 / 60;

function Dashboard({ props }) {
  const { trafficData } = props;

  const [selectedPage, setSelectedPage] = useState("map");
  const [snapshotIndex, setSnapshotIndex] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(30);
  const [playing, setPlaying] = useState(false);

  const chartData = useMemo(() => getChartData(trafficData, snapshotIndex), [trafficData, snapshotIndex]);
  const mapData = useMemo(() => getMapData(trafficData, snapshotIndex), [trafficData, snapshotIndex]);
  const numSnapshots = chartData.datasets[0].data.length;

  const delay = 5 * ANIMATION_INTERVAL * (1 - animationSpeed / 100);
  useInterval(() => setSnapshotIndex((snapshotIndex + 1) % numSnapshots), playing ? delay : null);

  return (
    <ThemeProvider theme={darkTheme}>
      <Navbar props={{ setSelectedPage }} />
      <Container maxWidth="100%">
        {selectedPage === "map" ? (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box sx={{ height: "75vh" }}>
                <TrafficMap props={{ mapData }} />
              </Box>
            </Grid>
            <Grid item lg={10} xs={12}>
              <TrafficChart props={{ chartData }} />
            </Grid>
            <Grid item lg={2} xs={12}>
              <Settings
                props={{
                  playing,
                  setPlaying,
                  resetIndex: () => setSnapshotIndex(0),
                  animationSpeed,
                  setAnimationSpeed,
                }}
              />
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
    const normalizedCounts = counts.length !== 96 ? dropRight(counts) : counts; // don't show current, incomplete quarter-hour
    const msPerQuarterHour = 15 * 60 * 1000;
    let timestamp = Date.parse(`${date}T00:00:00.000-08:00`);
    forEach(normalizedCounts, (count) => {
      data.push({
        x: new Date(timestamp),
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

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
