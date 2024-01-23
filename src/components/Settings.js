import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function Settings({ props }) {
  const { dataMode, setDataMode } = props;

  return (
    <Card>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <Typography gutterBottom>Data Mode</Typography>
        <ToggleButtonGroup
          color="primary"
          value={dataMode}
          exclusive
          onChange={(_, dataMode) => setDataMode(dataMode)}
          aria-label="Platform"
        >
          <ToggleButton value="relative">Relative</ToggleButton>
          <ToggleButton value="absolute">Absolute</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Card>
  );
}
