import { Chart as ChartJS, TimeScale } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { map, toPairs } from "lodash";
ChartJS.register(TimeScale);

const chartOptions = getChartOptions();

function TrafficChart({ props }) {
  const { trafficData } = props;
  const chartData = getChartData(trafficData);

  return (
    <div className="chart-container">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

export default TrafficChart;

function getChartOptions() {
  return {
    scales: {
      x: {
        type: "timeseries",
        stacked: true,
        ticks: {
          display: false,
        },
      },
      y: {
        stacked: true,
        ticks: {
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
  const pairs = toPairs(trafficData);

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
