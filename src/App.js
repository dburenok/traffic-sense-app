import { useState, useEffect } from "react";
import { Chart as ChartJS, TimeScale } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import Axios from "axios";
import Map, { Marker } from "react-map-gl";
import { map, toPairs, sortBy, last } from "lodash";
import "./App.css";

const DATA_URL = process.env.REACT_APP_DATA_URL;

const SHOW_OPTIONS = {
  map: true,
  chart: true,
};

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
ChartJS.register(TimeScale);

function App() {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [chartDataSnapshot, setChartDataSnapshot] = useState([]);

  useEffect(() => {
    Axios.get(DATA_URL)
      .then((res) => res.data["data"] ?? {})
      .then((data) => {
        const pairs = toPairs(data);

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
      <h2>Traffic Flow Chart</h2>
      {SHOW_OPTIONS.chart && (
        <div className="chartContainer">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}

      <h2>Traffic Flow Map</h2>
      {SHOW_OPTIONS.map && (
        <Map
          mapLib={import("mapbox-gl")}
          reuseMaps={true}
          attributionControl={false}
          antialias={true}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          initialViewState={initialViewState}
          style={{ width: "100%", height: 720 }}
        >
          {map(chartDataSnapshot, ({ intersection, location, vehicleCount }, i) => {
            const { lat, long } = location;
            return (
              <Marker
                key={i}
                latitude={lat}
                longitude={long}
                onClick={() => alert(`${vehicleCount} vehicles at ${intersection} (${lat}, ${long})`)}
              ></Marker>
            );
          })}
        </Map>
      )}
    </div>
  );
}

export default App;

function getLatestCount(data) {
  const sortedData = sortBy(data, ({ timestamp }) => Date.parse(timestamp));
  const latestData = last(sortedData);

  return latestData["vehicleCount"];
}
