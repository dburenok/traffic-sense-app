import { Chart as ChartJS, TimeScale } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { map, toPairs, entries } from "lodash";
ChartJS.register(TimeScale);

const chartOptions = getChartOptions();

function TrafficChart({ props }) {
  const { trafficData } = props;
  const chartData = getChartData(trafficData);

  return <Line data={chartData} options={chartOptions} />;
}

export default TrafficChart;

function getChartOptions() {
  return {
    scales: {
      x: {
        type: "timeseries",
        stacked: true,
        ticks: {
          display: true,
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90,
        },
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };
}

function getChartData(trafficData) {
  const mergedCounts = getMergedCounts(trafficData);
  const mergedCountsData = map(entries(mergedCounts), ([t, c]) => ({ x: new Date(Date.parse(t)), y: c }));

  return {
    datasets: [
      {
        label: "hourly-traffic",
        data: mergedCountsData,
      },
    ],
  };
}

function getMergedCounts(trafficData) {
  const mergedCounts = new Map();
  const pairs = toPairs(trafficData);

  for (const [, { data }] of pairs) {
    for (const { t, c } of data) {
      if (mergedCounts.has(t)) {
        mergedCounts.set(t, mergedCounts.get(t) + c);
      } else {
        mergedCounts.set(t, c);
      }
    }
  }

  return mergedCounts;
}
