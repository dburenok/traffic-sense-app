import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

export default function About() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start", mt: "15px" }}>
        <Typography variant="h4" gutterBottom>
          <b>Traffic Sense</b> is a real-time visualization of vehicle traffic data.
        </Typography>

        <Typography variant="p" lineHeight={"1.5em"} gutterBottom sx={{ mb: "15px" }}>
          We collect and analyze high-fidelity traffic data, drawing insights about city trends, traffic patterns, and
          unusual events. Our current architecture only supports Vancouver, Canada, but we have plans to expand into
          other cities. Our distributed service is capable of scaling to traffic camera datasets all over the world, and
          we currently capture thousands of vehicle data points every day.
        </Typography>

        <Typography variant="p" lineHeight={"1.5em"} gutterBottom sx={{ mb: "15px" }}>
          Real-time, rolling 3-day traffic data is available at the following{" "}
          <a href="https://os47h27e7vcx67ax4qfeqsfrou0bdxze.lambda-url.us-west-2.on.aws/">link</a>. Data is grouped by
          intersection (ex. "alma-st-and-w-10th-av"), and the vehicle counts are stored compactly under the "data"
          field, with all days except the last one containing exactly 96 data points, one for each quarter-hour period
          starting at midnight. The "location" field contains the GPS coordinates of the intersection. Additionally, a
          wildcard ("*") data series is provided, which aggregates all intersections in Vancouver under a single
          time-series.
        </Typography>

        <Typography variant="p" lineHeight={"1.5em"} gutterBottom sx={{ mb: "15px" }}>
          Our map is a high-performance visualization of this data, and allows you to replay the traffic flow over the
          entire week. You are, however, free to use the data in any way you wish.
        </Typography>

        <img width={"500px"} src={"./example.jpg"} alt="Traffic camera example" />
        <Typography variant="p" lineHeight={"1.5em"} gutterBottom sx={{ mb: "15px" }}>
          We source image data directly from publicly-available traffic cameras.
        </Typography>

        <img width={"500px"} src={"./inference-result.jpg"} alt="Object detection example" />
        <Typography variant="p" lineHeight={"1.5em"} gutterBottom sx={{ mb: "15px" }}>
          Using a state-of-the-art object-detection model (YOLOv8, we process thousands of images every hour to count
          the number of vehicles at various intersections. Further processing is done to smooth and heal the data, so
          that useful insights can be drawn from it.
        </Typography>

        <Typography variant="body1" textAlign={"left"} gutterBottom>
          Traffic Sense is a personal project created and maintained by Dmitriy B. (
          <a href="https://github.com/dburenok">GitHub</a>, <a href="https://www.linkedin.com/in/dburenok/">LinkedIn</a>
          ).
        </Typography>
      </Box>
    </Container>
  );
}
