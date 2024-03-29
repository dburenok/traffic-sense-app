import { useState, useEffect } from "react";
import Axios from "axios";
import { isEmpty, isNil } from "lodash";
import "./App.css";
import LoadingState from "./components/LoadingState";
import Dashboard from "./components/Dashboard";

const DATA_URL =
  process.env.REACT_APP_ENV === "dev" ? "http://localhost:3001/api/data/" : process.env.REACT_APP_DATA_URL;

function App() {
  const [trafficData, setTrafficData] = useState({});
  const [trafficInfo, setTrafficInfo] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchTrafficData().then(({ data, info }) => {
      setTrafficData(data);
      setTrafficInfo(info);
    });
  }, []);

  if (isEmpty(trafficData) || !ready) {
    return <LoadingState props={{ setReady }} />;
  }

  return <Dashboard props={{ trafficData, trafficInfo }} />;
}

export default App;

async function fetchTrafficData() {
  return Axios.get(DATA_URL).then((res) => (isNil(res.data) ? {} : res.data));
}
