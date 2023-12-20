import { Chart as ChartJS, TimeScale } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
ChartJS.register(TimeScale);

const chartOptions = getChartOptions();

function TrafficChart({ props }) {
  const { chartData } = props;

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
      x: { type: "timeseries", stacked: true },
      y: { min: 0, max: 8000, stacked: true },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };
}
