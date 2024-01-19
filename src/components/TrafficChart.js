import { Chart as ChartJS, TimeScale } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

ChartJS.register(TimeScale);

const chartOptions = getChartOptions();

function TrafficChart({ props }) {
  const { chartData } = props;

  return (
    <Card>
      <Box
        sx={{
          minHeight: "17vh",
          display: "flex",
        }}
      >
        <Bar data={chartData} options={chartOptions} />
      </Box>
    </Card>
  );
}

export default TrafficChart;

function getChartOptions() {
  return {
    scales: {
      x: {
        type: "timeseries",
        ticks: {
          display: true,
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          display: true,
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
    animation: { duration: 0 },
  };
}
