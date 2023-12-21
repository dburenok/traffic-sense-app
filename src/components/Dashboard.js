import TrafficMap from "./TrafficMap";
import TrafficChart from "./TrafficChart";

function Dashboard({ props }) {
  const { trafficData } = props;

  return (
    <div className="container">
      <TrafficMap props={{ trafficData }} />
      <TrafficChart props={{ trafficData }} />
    </div>
  );
}

export default Dashboard;
