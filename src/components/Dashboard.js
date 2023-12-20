import TrafficMap from "./TrafficMap";
import TrafficChart from "./TrafficChart";

function Dashboard({ props }) {
  const { chartDataSnapshot, chartData } = props;

  return (
    <div className="container">
      <TrafficMap chartDataSnapshot={chartDataSnapshot} />
      <TrafficChart chartData={chartData} />
    </div>
  );
}

export default Dashboard;
