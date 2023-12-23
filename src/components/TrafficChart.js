import { Chart as ChartJS, TimeScale } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

ChartJS.register(TimeScale);

const chartOptions = getChartOptions();

function TrafficChart({ props }) {
  const { chartData, numSnapshots, snapshotIndex, setSnapshotIndex } = props;

  function valueLabelFormat(selectedIndex) {
    const { x } = chartData.datasets[0].data[selectedIndex - 1];

    return new Date(Date.parse(x)).toLocaleString("en-US", {
      hour: "numeric",
      hour12: true,
    });
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ height: "15vh", width: "97%", ml: "8px" }}>
        <Line data={chartData} options={chartOptions} />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "55px",
          width: "95%",
        }}
      >
        <Slider
          aria-label="time-selector"
          valueLabelDisplay="auto"
          value={snapshotIndex + 1}
          step={1}
          min={1}
          max={numSnapshots}
          marks={true}
          valueLabelFormat={valueLabelFormat}
          onChange={(_, newIndex) => setSnapshotIndex(newIndex - 1)}
        />
      </Box>
    </Box>
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
