import { useState, useEffect } from "react";

import { Chart as ChartJS, TimeScale } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

import Map from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { ColumnLayer } from "@deck.gl/layers";

import Axios from "axios";
import { map, toPairs, sortBy, last, values } from "lodash";
import "./App.css";

ChartJS.register(TimeScale);

const DATA_URL = process.env.REACT_APP_DATA_URL;

const initialViewState = {
  latitude: 49.25225056888473,
  longitude: -123.08041318992564,
  zoom: 11.5,
};

const chartOptions = {
  scales: {
    x: { type: "timeseries", stacked: true },
    y: { min: 0, max: 8000, stacked: true },
  },
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
};

function App() {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [chartDataSnapshot, setChartDataSnapshot] = useState([]);
  const [maxVehicleCount, setMaxVehicleCount] = useState(Number.NEGATIVE_INFINITY);

  const layer = new ColumnLayer({
    id: "intersections-column-layer",
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

  useEffect(() => {
    Axios.get(DATA_URL)
      .then((res) => res.data["data"] ?? {})
      .then((data) => {
        const pairs = toPairs(data);

        const maxCount = Math.max(...map(pairs, ([_, { data }]) => Math.max(...map(data, "vehicleCount"))));
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
            lineTension: 0.0,
          })),
        });
      });
  }, []);

  return (
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
      <div className="chartContainer">
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
