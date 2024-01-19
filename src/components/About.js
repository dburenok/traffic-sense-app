import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

export default function About() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start", mt: "15px" }}>
        <Typography variant="h4" gutterBottom>
          <b>Traffic Sense</b> is a real-time visualization of vehicle traffic.
        </Typography>

        <Typography variant="p" lineHeight={"1.5em"} gutterBottom sx={{ mb: "15px" }}>
          Traffic data holds immense value and has numerous use-cases, such as enhancing road safety, alleviating
          congestion, and determining insurance premiums to name a few. Typically, companies bear substantial costs to
          acquire proprietary historical traffic data and no easy way exists to procure such data. Once it's gone, it's
          gone.
        </Typography>

        <Typography variant="p" lineHeight={"1.5em"} gutterBottom sx={{ mb: "15px" }}>
          At Traffic Sense, our mission is to retain high-fidelty historical traffic data, draw intelligent insights
          from this data, and provide a substantial portion of it for free. Currently, we operate exclusively in
          Vancouver, Canada, with plans for expansion to other cities in the pipeline. We've meticulously designed a
          distributed service capable of scaling to hundreds of cities all over the world, and our system already
          captures thousands of vehicle data points every single day.
        </Typography>

        <Typography variant="p" lineHeight={"1.5em"} gutterBottom sx={{ mb: "15px" }}>
          Real-time, rolling 7-day traffic data is available at the following{" "}
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
          Using a state-of-the-art object-detection model, we process thousands of images every hour to count the number
          of vehicles at various intersections. Further processing is done to smooth and heal the data, so that useful
          insights can be drawn from it.
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
