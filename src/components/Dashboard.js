import { useState, useMemo } from "react";
import {
  map,
  toPairs,
  forEach,
  filter,
  values,
  flatten,
  head,
  flattenDepth,
  sortBy,
  reverse,
  take,
  keys,
} from "lodash";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TrafficMap from "./TrafficMap";
import TrafficChart from "./TrafficChart";
import Navbar from "./Navbar";
import About from "./About";
import Settings from "./Settings";

const GRANULARITY_INTERVAL_MS = 20 * 60 * 1000;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Dashboard({ props }) {
  const { trafficData } = props;

  const [selectedPage, setSelectedPage] = useState("map");
  const [snapshotIndex, setSnapshotIndex] = useState(0);
  const [dataMode, setDataMode] = useState("absolute");

  const maxNumVehicles = useMemo(() => getMaxNumVehicles(trafficData), [trafficData]);
  const chartDatas = useMemo(() => getChartDatas(trafficData, snapshotIndex), [trafficData, snapshotIndex]);
  const mapData = useMemo(
    () => getMapData(trafficData, snapshotIndex, dataMode, maxNumVehicles),
    [trafficData, snapshotIndex, dataMode, maxNumVehicles],
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Navbar props={{ setSelectedPage }} />
      <Container maxWidth="100%">
        {selectedPage === "map" ? (
          <Grid container>
            <Grid item xs={12}>
              <Box sx={{ height: "70vh" }}>
                <TrafficMap props={{ mapData }} />
              </Box>
            </Grid>
            <Grid item lg={10} xs={12}>
              {map(chartDatas, (chartData, i) => (
                <TrafficChart key={i} props={{ chartData, setSnapshotIndex }} />
              ))}
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

function getChartDatas(trafficData, snapshotIndex) {
  const localities = take(reverse(sortBy(toPairs(trafficData), ([_, data]) => data.length)), 10);

  const chartDatas = [];
  forEach(localities, ([locality, data]) => {
    const localityData = getLocalityData(data);

    chartDatas.push({
      datasets: [
        {
          label: locality,
          data: localityData,
          backgroundColor: map(localityData, (_, i) => (i === snapshotIndex ? "red" : "cyan")),
        },
      ],
    });
  });

  return chartDatas;
}

function getLocalityData(data) {
  const localityData = [];
  const localityIntersections = map(data, "data");
  const localityIntersectionCounts = [];

  for (const localityIntersection of localityIntersections) {
    const localityIntersectionPairs = toPairs(localityIntersection);

    for (const [_, counts] of localityIntersectionPairs) {
      for (let j = 0; j < counts.length; j++) {
        localityIntersectionCounts[j] = counts[j] + (localityIntersectionCounts[j] ?? 0);
      }
    }
  }

  const dataStartDate = head(keys(localityIntersections[0]).sort());
  let timestamp = Date.parse(`${dataStartDate}T00:00:00.000-08:00`);
  forEach(localityIntersectionCounts, (count) => {
    localityData.push({
      x: timestamp,
      y: count,
    });

    timestamp += GRANULARITY_INTERVAL_MS;
  });

  return localityData;
}

function getMapData(trafficData, snapshotIndex, dataMode, maxNumVehicles) {
  const pairs = filter(toPairs(trafficData), ([locality]) => locality !== "*");
  const allIntersections = flatten(map(pairs, (v) => v[1]));

  return map(allIntersections, ({ lat, long, data }) => ({
    location: { lat, long },
    trafficLoad: getTrafficLoad(data, snapshotIndex, dataMode, maxNumVehicles),
  }));
}

function getMaxNumVehicles(trafficData) {
  const granularPairs = filter(toPairs(trafficData), ([localityName, _]) => localityName !== "*");
  const intersections = map(granularPairs, (v) => v[1]);
  const intersectionsData = map(flatten(intersections), "data");
  const allCounts = flattenDepth(
    map(intersectionsData, (v) => values(v)),
    2,
  );

  return Math.max(...allCounts);
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
