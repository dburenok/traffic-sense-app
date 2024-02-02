import { useState } from "react";
import Map from "react-map-gl";
import { map, values } from "lodash";
import DeckGL from "@deck.gl/react";
import { ColumnLayer } from "@deck.gl/layers";

const TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function TrafficMap({ props }) {
  const { mapData } = props;

  const [columnsRadius, setColumnsRadius] = useState(11.4 * 7);

  const layer = getColumnIntersectionLayer(mapData, columnsRadius);

  function handleZoomChange(viewState) {
    const { zoom } = viewState;
    setColumnsRadius((20 - zoom) ** 5 / 500);
  }

  return (
    <DeckGL
      style={{ position: "relative" }}
      initialViewState={getInitialViewState()}
      controller={true}
      layers={[layer]}
      onViewStateChange={({ viewState }) => handleZoomChange(viewState)}
    >
      <Map
        reuseMaps={true}
        attributionControl={false}
        antialias={true}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={TOKEN}
      />
    </DeckGL>
  );
}

export default TrafficMap;

function getInitialViewState() {
  return {
    latitude: 49.2,
    longitude: -123,
    zoom: 10,
    pitch: 45,
    bearing: 0,
  };
}

function getColumnIntersectionLayer(mapData, columnRadius) {
  return new ColumnLayer({
    data: map(values(mapData), ({ location, trafficLoad }) => ({
      location: [parseFloat(location.long), parseFloat(location.lat)],
      trafficLoad,
    })),
    diskResolution: 12,
    radius: columnRadius,
    extruded: true,
    elevationScale: 2000,
    getPosition: ({ location }) => location,
    getElevation: ({ trafficLoad }) => trafficLoad,
    getFillColor,
  });
}

function getFillColor({ trafficLoad }) {
  if (trafficLoad < 0.5) {
    return [trafficLoad * 2 * 255, 255, 0];
  }

  return [255, (1 - (trafficLoad * 2 - 1)) * 255, 0];
}
