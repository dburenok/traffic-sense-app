const MIN_LOAD_TIME_MS = 1000;

function LoadingState({ props }) {
  const { setReady } = props;

  setTimeout(() => setReady(true), MIN_LOAD_TIME_MS);

  return (
    <div className="loading-text">
      <h2>Loading traffic data...</h2>
    </div>
  );
}

export default LoadingState;
