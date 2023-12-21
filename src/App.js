import { useState, useEffect } from "react";
import Axios from "axios";
import { isEmpty, isNil } from "lodash";
import "./App.css";
import LoadingState from "./components/LoadingState";
import Dashboard from "./components/Dashboard";

const DATA_URL = process.env.REACT_APP_DATA_URL;

function App() {
  const [trafficData, setTrafficData] = useState({});
  const [loadingDone, setLoadingDone] = useState(false);

  useEffect(() => {
    fetchTrafficData().then((data) => setTrafficData(data));
  }, []);

  if (isEmpty(trafficData) || !loadingDone) {
    return <LoadingState props={{ setLoadingDone }} />;
  }

  return <Dashboard props={{ trafficData }} />;
}

export default App;

async function fetchTrafficData() {
  return Axios.get(DATA_URL).then((res) => (isNil(res.data) ? {} : res.data["data"] ?? {}));
}
