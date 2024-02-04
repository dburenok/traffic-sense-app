import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function Settings({ props }) {
  const { dataMode, setDataMode } = props;

  return (
    <Card>
      <h5 style={{ margin: "10px" }}>Settings</h5>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", p: "10px" }}>
        <h5 style={{ margin: "10px" }}>Data Mode</h5>

        <ToggleButtonGroup color="primary" value={dataMode} exclusive onChange={(_, dataMode) => setDataMode(dataMode)}>
          <ToggleButton value="absolute">Absolute</ToggleButton>
          <ToggleButton value="relative">Relative</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Card>
  );
}
