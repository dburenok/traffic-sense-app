import { useState, useMemo } from "react";
import {
  map,
  toPairs,
  forEach,
  filter,
  values,
  flatten,
  head,
  sortBy,
  reverse,
  take,
  keys,
  flattenDeep,
  sum,
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
  const { trafficData, maxNumVehicles } = props;

  const [selectedPage, setSelectedPage] = useState("map");
  const [snapshotIndex, setSnapshotIndex] = useState(0);
  const [dataMode, setDataMode] = useState("absolute");

  const allChartData = useMemo(() => getAllChartData(trafficData, snapshotIndex), [trafficData, snapshotIndex]);
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
            <Grid item xs={12}>
              {map(allChartData, (chartData, i) => (
                <TrafficChart key={i} props={{ chartData, setSnapshotIndex }} />
              ))}
            </Grid>
            <Grid item xs={12}>
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

function getAllChartData(trafficData, snapshotIndex) {
  const localities = take(
    reverse(
      sortBy(toPairs(trafficData), ([_, data]) => {
        return sum(flattenDeep(map(map(data, "data"), (v) => values(v))));
      }),
    ),
    6,
  );

  return map(localities, ([locality, rawData]) => {
    let data;
    if (locality === "*") {
      data = getOverallData(rawData);
    } else {
      data = getLocalityData(rawData);
    }

    return {
      datasets: [
        {
          label: locality === "*" ? "British Columbia" : locality,
          data,
          backgroundColor: map(data, (_, i) => (i === snapshotIndex ? "red" : "cyan")),
        },
      ],
    };
  });
}

function getOverallData(rawData) {
  const [{ data }] = rawData;

  const countsArray = map(
    sortBy(toPairs(data), (v) => v[0]),
    ([date, counts]) => counts,
  );
  const flattenedCounts = flatten(countsArray);

  const dataStartDate = head(keys(data).sort());
  let timestamp = Date.parse(`${dataStartDate}T00:00:00.000-08:00`);

  const overallData = [];
  forEach(flattenedCounts, (count) => {
    overallData.push({
      x: timestamp,
      y: count,
    });

    timestamp += GRANULARITY_INTERVAL_MS;
  });
  return overallData;
}

function getLocalityData(rawData) {
  const localityData = [];
  const localityIntersections = map(rawData, "data");

  const numCounts = flatten(values(localityIntersections[0])).length;
  const localityIntersectionCounts = new Array(numCounts).fill(0);

  for (const localityIntersection of localityIntersections) {
    const counts = map(
      sortBy(toPairs(localityIntersection), (v) => v[0]),
      ([date, counts]) => counts,
    );
    const flattenedCounts = flatten(counts);
    forEach(flattenedCounts, (val, i) => (localityIntersectionCounts[i] += val));
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
