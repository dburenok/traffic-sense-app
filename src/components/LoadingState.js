function LoadingState({ setWelcomeDone }) {
  setTimeout(() => setWelcomeDone(true), 1000);

  return (
    <div className="loading-text">
      <h2>Loading traffic data...</h2>
    </div>
  );
}

export default LoadingState;
