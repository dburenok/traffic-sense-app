import { useState } from "react";
import Map from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { ColumnLayer } from "@deck.gl/layers";
import { map, values } from "lodash";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const initialViewState = getInitialViewState();

function TrafficMap({ props }) {
  const { mapData } = props;
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
          mapStyle="mapbox://styles/mapbox/streets-v9"
        />
      </DeckGL>
      <Box sx={{ width: 600 }}>
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
      </Box>
    </>
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

function calculateRepresentationValue(value) {
  if (value === 6) {
    return "Wiry";
  }

  if (value === 8) {
    return "Slim";
  }

  if (value === 10) {
    return "Standard";
  }

  if (value === 12) {
    return "Thick";
  }

  return "Chonky";
}

function handleSliderChange(newValue, setColumnRadius) {
  setColumnRadius(newValue * newValue);
}
