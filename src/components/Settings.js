import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Card from "@mui/material/Card";
// import ButtonGroup from "@mui/material/ButtonGroup";
import { Typography } from "@mui/material";
import Slider from "@mui/material/Slider";

export default function Settings({ props }) {
  const { playing, setPlaying, resetIndex, animationSpeed, setAnimationSpeed } = props;

  function handleChange(_, newValue) {
    setAnimationSpeed(newValue);
  }

  return (
    <Card>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <Typography gutterBottom>Animation Controls</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={!playing ? <PlayArrowIcon /> : <PauseIcon />}
              onClick={() => setPlaying(!playing)}
            >
              {!playing ? "Play" : "Pause"}
            </Button>
            <Button variant="outlined" endIcon={<RestartAltIcon />} onClick={resetIndex}>
              Reset
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: "10px", mb: "10px", width: "100%" }}
        >
          <Typography gutterBottom>Animation Speed</Typography>
          <Box sx={{ width: "75%" }}>
            <Slider value={animationSpeed} onChange={handleChange} />
          </Box>
        </Box>

        {/* <Box sx={{ mt: "5px" }}>
          <Typography gutterBottom>Data Mode</Typography>
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button>Absolute</Button>
            <Button>Relative</Button>
          </ButtonGroup>
        </Box> */}
      </Box>
    </Card>
  );
}
