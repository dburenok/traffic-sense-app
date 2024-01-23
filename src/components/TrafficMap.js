import Map from "react-map-gl";
import { map, values } from "lodash";
import DeckGL from "@deck.gl/react";
import { ColumnLayer } from "@deck.gl/layers";

const initialViewState = getInitialViewState();

function TrafficMap({ props }) {
  const { mapData } = props;

  const layer = getColumnIntersectionLayer(mapData);

  return (
    <DeckGL style={{ position: "relative" }} initialViewState={initialViewState} controller={true} layers={[layer]}>
      <Map
        reuseMaps={true}
        attributionControl={false}
        antialias={true}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
      />
    </DeckGL>
  );
}

export default TrafficMap;

function getInitialViewState() {
  return {
    latitude: 49.24,
    longitude: -123.1,
    zoom: 11.4,
    pitch: 45,
    bearing: 0,
  };
}

function getColumnIntersectionLayer(mapData) {
  return new ColumnLayer({
    data: map(values(mapData), ({ location, trafficLoad }) => ({
      location: [parseFloat(location.long), parseFloat(location.lat)],
      trafficLoad,
    })),
    diskResolution: 12,
    radius: 75,
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
