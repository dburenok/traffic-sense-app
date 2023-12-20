import { map, toPairs, sortBy, last } from "lodash";
import TrafficMap from "./TrafficMap";
import TrafficChart from "./TrafficChart";

function Dashboard({ props }) {
  const { trafficData } = props;

  const pairs = toPairs(trafficData);
  const mapData = getMapData(pairs);
  const chartData = getChartData(pairs);

  return (
    <div className="container">
      <TrafficMap props={{ mapData }} />
      <TrafficChart props={{ chartData }} />
    </div>
  );
}

export default Dashboard;

function getMapData(pairs) {
  const maxCount = getMaxCount(pairs);

  return map(pairs, ([intersection, { data, location }]) => ({
    intersection,
    location,
    trafficLoad: getLatestCount(data) / maxCount,
  }));
}

function getLatestCount(data) {
  const sortedData = sortBy(data, ({ t }) => Date.parse(t));
  const latestData = last(sortedData);

  return latestData["c"];
}

function getMaxCount(pairs) {
  return Math.max(...map(pairs, ([_, { data }]) => Math.max(...map(data, "c"))));
}

function getChartData(pairs) {
  return {
    datasets: map(pairs, ([intersection, { data }]) => ({
      label: intersection,
      data: map(data, ({ t, c }) => ({
        x: new Date(Date.parse(t)),
        y: c,
      })),
    })),
  };
}
