import { useState, useEffect } from "react";

import { Chart as ChartJS, TimeScale } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

import Map from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { ColumnLayer } from "@deck.gl/layers";

import Axios from "axios";
import { map, toPairs, sortBy, last, values, isEmpty } from "lodash";
import "./App.css";
import LoadingState from "./components/LoadingState";

ChartJS.register(TimeScale);

const DATA_URL = process.env.REACT_APP_DATA_URL;
const initialViewState = getInitialViewState();
const chartOptions = getChartOptions();

function App() {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [chartDataSnapshot, setChartDataSnapshot] = useState([]);
  const [maxVehicleCount, setMaxVehicleCount] = useState(0);
  const [welcomeDone, setWelcomeDone] = useState(false);

  const layer = getColumnIntersectionLayer(chartDataSnapshot, maxVehicleCount);

  useEffect(() => {
    Axios.get(DATA_URL)
      .then((res) => res.data["data"] ?? {})
      .then((data) => {
        const pairs = toPairs(data);

        const maxCount = getMaxCount(pairs);
        setMaxVehicleCount(maxCount);

        setChartDataSnapshot(
          map(pairs, ([intersection, { data, location }]) => ({
            intersection,
            location,
            vehicleCount: getLatestCount(data),
          }))
        );

        setChartData({
          datasets: map(pairs, ([intersection, { data }]) => ({
            label: intersection,
            data: map(data, ({ timestamp, vehicleCount }) => ({
              x: new Date(Date.parse(timestamp)),
              y: vehicleCount,
            })),
          })),
        });
      });
  }, []);

  return isEmpty(chartData.datasets) || !welcomeDone ? (
    <LoadingState setWelcomeDone={setWelcomeDone} />
  ) : (
    <div className="container">
      <DeckGL
        style={{ position: "relative" }}
        height={500}
        initialViewState={initialViewState}
        controller={true}
        layers={[layer]}
      >
        <Map
          reuseMaps={true}
          attributionControl={false}
          antialias={true}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        />
      </DeckGL>
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default App;

function getLatestCount(data) {
  const sortedData = sortBy(data, ({ timestamp }) => Date.parse(timestamp));
  const latestData = last(sortedData);

  return latestData["vehicleCount"];
}

function getInitialViewState() {
  return {
    latitude: 49.25225056888473,
    longitude: -123.08041318992564,
    zoom: 11.25,
    pitch: 45,
    bearing: 0,
  };
}

function getChartOptions() {
  return {
    scales: {
      x: { type: "timeseries", stacked: true },
      y: { min: 0, max: 8000, stacked: true },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };
}

function getColumnIntersectionLayer(chartDataSnapshot, maxVehicleCount) {
  return new ColumnLayer({
    data: map(values(chartDataSnapshot), ({ location, vehicleCount }) => ({
      location: [parseFloat(location.long), parseFloat(location.lat)],
      vehicleCount: vehicleCount / maxVehicleCount,
    })),
    diskResolution: 15,
    radius: 100,
    extruded: true,
    elevationScale: 4000,
    getPosition: (d) => d.location,
    getElevation: (d) => d.vehicleCount,
    getFillColor: (d) => [d.vehicleCount * 255, (1 - d.vehicleCount) * 255, 0],
  });
}

function getMaxCount(pairs) {
  return Math.max(...map(pairs, ([_, { data }]) => Math.max(...map(data, "vehicleCount"))));
}
