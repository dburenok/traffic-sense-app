import { useState, useEffect } from "react";
import Axios from "axios";
import { map, toPairs, sortBy, last, isEmpty, isNil } from "lodash";
import "./App.css";
import LoadingState from "./components/LoadingState";
import Dashboard from "./components/Dashboard";

const DATA_URL = process.env.REACT_APP_DATA_URL;

function App() {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [chartDataSnapshot, setChartDataSnapshot] = useState([]);
  const [welcomeDone, setWelcomeDone] = useState(false);

  useEffect(() => {
    fetchTrafficData().then((data) => {
      const pairs = toPairs(data);

      setChartDataSnapshot(getChartDataSnapshot(pairs));
      setChartData(getChartData(pairs));
    });
  }, []);

  return isEmpty(chartData.datasets) || !welcomeDone ? (
    <LoadingState props={{ setWelcomeDone }} />
  ) : (
    <Dashboard props={{ chartDataSnapshot, chartData }} />
  );
}

export default App;

async function fetchTrafficData() {
  return Axios.get(DATA_URL).then((res) => (isNil(res.data) ? {} : res.data["data"] ?? {}));
}

function getChartDataSnapshot(pairs) {
  const maxCount = getMaxCount(pairs);

  return map(pairs, ([intersection, { data, location }]) => ({
    intersection,
    location,
    trafficLoad: getLatestCount(data) / maxCount,
  }));
}

function getLatestCount(data) {
  const sortedData = sortBy(data, ({ timestamp }) => Date.parse(timestamp));
  const latestData = last(sortedData);

  return latestData["vehicleCount"];
}

function getMaxCount(pairs) {
  return Math.max(...map(pairs, ([_, { data }]) => Math.max(...map(data, "vehicleCount"))));
}

function getChartData(pairs) {
  return {
    datasets: map(pairs, ([intersection, { data }]) => ({
      label: intersection,
      data: map(data, ({ timestamp, vehicleCount }) => ({
        x: new Date(Date.parse(timestamp)),
        y: vehicleCount,
      })),
    })),
  };
}
