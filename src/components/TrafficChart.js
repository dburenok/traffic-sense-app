import { Chart as ChartJS, TimeScale } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

ChartJS.register(TimeScale);

function TrafficChart({ props }) {
  const { chartData, setSnapshotIndex } = props;
  const { label } = chartData.datasets[0];

  const chartOptions = getChartOptions(setSnapshotIndex);

  return (
    <Card>
      <h5 style={{ margin: "10px" }}>{label === "*" ? "British Columbia" : label}</h5>

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

function getChartOptions(setSnapshotIndex) {
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
      tooltip: {
        yAlign: "bottom",
        callbacks: {
          title: (chart) => {
            const { dataIndex } = chart[0];
            setSnapshotIndex(dataIndex);
            const date = new Date(chart[0].dataset.data[dataIndex].x);
            const weekday = date.toLocaleString("en-CA", { weekday: "short" });
            return `${weekday}, ${date.toLocaleTimeString("en-CA")}`;
          },
        },
      },
    },
    animation: { duration: 0 },
  };
}
