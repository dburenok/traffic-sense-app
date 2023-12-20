import Map from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { ColumnLayer } from "@deck.gl/layers";
import { map, values } from "lodash";

const initialViewState = getInitialViewState();

function TrafficMap({ props }) {
  const { mapData } = props;

  const layer = getColumnIntersectionLayer(mapData);

  return (
    <DeckGL
      style={{ position: "relative" }}
      height={500}
      initialViewState={initialViewState}
      controller={true}
      layers={[layer]}
    >
      <Map reuseMaps={true} attributionControl={false} antialias={true} mapStyle="mapbox://styles/mapbox/streets-v9" />
    </DeckGL>
  );
}

export default TrafficMap;

function getInitialViewState() {
  return {
    latitude: 49.25225056888473,
    longitude: -123.08041318992564,
    zoom: 11.25,
    pitch: 45,
    bearing: 0,
  };
}

function getColumnIntersectionLayer(chartDataSnapshot) {
  return new ColumnLayer({
    data: map(values(chartDataSnapshot), ({ location, trafficLoad }) => ({
      location: [parseFloat(location.long), parseFloat(location.lat)],
      trafficLoad,
    })),
    diskResolution: 15,
    radius: 100,
    extruded: true,
    elevationScale: 4000,
    getPosition: (d) => d.location,
    getElevation: (d) => d.trafficLoad,
    getFillColor: (d) => [d.trafficLoad * 255, (1 - d.trafficLoad) * 255, 0],
  });
}
