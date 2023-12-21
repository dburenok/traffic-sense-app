import TrafficMap from "./TrafficMap";
import TrafficChart from "./TrafficChart";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Navbar from "./Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Dashboard({ props }) {
  const { trafficData } = props;

  return (
    <ThemeProvider theme={darkTheme}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: "10px" }}>
        <Stack spacing={0.5}>
          <Card variant="outlined">
            <TrafficMap props={{ trafficData }} />
          </Card>

          <Card variant="outlined">
            <Box sx={{ height: "200px" }}>
              <TrafficChart props={{ trafficData }} />
            </Box>
          </Card>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default Dashboard;
