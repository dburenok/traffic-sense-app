import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export default function Settings({ props }) {
  const { playing, setPlaying } = props;

  return (
    <Box sx={{ m: "15px" }}>
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          startIcon={!playing ? <PlayArrowIcon /> : <PauseIcon />}
          onClick={() => setPlaying(!playing)}
        >
          {!playing ? "Play" : "Pause"}
        </Button>
        <Button variant="contained" endIcon={<RestartAltIcon />}>
          Reset
        </Button>
      </Stack>
    </Box>
  );
}
