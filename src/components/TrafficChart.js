import { Chart as ChartJS, TimeScale } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { map, toPairs, entries } from "lodash";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";

ChartJS.register(TimeScale);

const chartOptions = getChartOptions();

function TrafficChart({ props }) {
  const { trafficData } = props;
  const chartData = getChartData(trafficData);
  const numSnapshots = chartData.datasets[0].data.length;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ height: "200px", width: "100%" }}>
        <Line data={chartData} options={chartOptions} />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "55px",
          width: "93%",
        }}
      >
        <Slider
          aria-label="time-selector"
          valueLabelDisplay="auto"
          defaultValue={Math.floor(numSnapshots / 2)}
          step={1}
          min={1}
          max={numSnapshots}
          marks={true}
          // scale={calculateRepresentationValue}
          // onChange={(_, newValue) => handleSliderChange(newValue, setColumnRadius)}
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
