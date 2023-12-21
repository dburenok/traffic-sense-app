import { useState } from "react";
import Map from "react-map-gl";
import { map, values, toPairs, sortBy, last } from "lodash";
import DeckGL from "@deck.gl/react";
import { ColumnLayer } from "@deck.gl/layers";

// import Box from "@mui/material/Box";
// import Slider from "@mui/material/Slider";

const initialViewState = getInitialViewState();

function TrafficMap({ props }) {
  const { trafficData } = props;
  const mapData = getMapData(trafficData);

  const [columnRadius, setColumnRadius] = useState(100);
  const layer = getColumnIntersectionLayer(mapData, columnRadius);

  return (
    <>
      <DeckGL
        style={{ position: "relative" }}
        height={500}
        initialViewState={initialViewState}
        controller={true}
        layers={[layer]}
      >
        <Map
          reuseMaps={true}
          attributionControl={false}
          antialias={true}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
        />
      </DeckGL>
      {/* <Box sx={{ width: 600 }}>
        <Slider
          aria-label="column-radius"
          valueLabelDisplay="auto"
          defaultValue={10}
          step={2}
          min={6}
          max={14}
          marks={true}
          scale={calculateRepresentationValue}
          onChange={(_, newValue) => handleSliderChange(newValue, setColumnRadius)}
        />
      </Box> */}
    </>
  );
}

export default TrafficMap;

function getMapData(trafficData) {
  const pairs = toPairs(trafficData);
  const maxCount = getMaxCount(pairs);

  return map(pairs, ([intersection, { data, location }]) => ({
    intersection,
    location,
    trafficLoad: getLatestCount(data) / maxCount,
  }));
}

function getLatestCount(data) {
  const sortedData = sortBy(data, ({ t }) => Date.parse(t));
  const latestData = last(sortedData);

  return latestData["c"];
}

function getMaxCount(pairs) {
  return Math.max(...map(pairs, ([_, { data }]) => Math.max(...map(data, "c"))));
}

function getInitialViewState() {
  return {
    latitude: 49.25225056888473,
    longitude: -123.08041318992564,
    zoom: 11.25,
    pitch: 45,
    bearing: 0,
  };
}

function getColumnIntersectionLayer(chartDataSnapshot, columnRadius) {
  return new ColumnLayer({
    data: map(values(chartDataSnapshot), ({ location, trafficLoad }) => ({
      location: [parseFloat(location.long), parseFloat(location.lat)],
      trafficLoad,
    })),
    diskResolution: 15,
    radius: columnRadius,
    extruded: true,
    elevationScale: 4000,
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
