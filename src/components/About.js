import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function About({ props }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start", mt: "15px" }}>
      <Typography variant="h4" textAlign={"left"} gutterBottom>
        <b>TrafficSense</b> is a (near) real-time visualization of traffic patterns in Vancouver, BC, Canada.
      </Typography>
      <Typography variant="body1" textAlign={"left"}>
        Although traffic trends can be easily accessed through Google Maps (or similar tools), the source data and the
        algorithms used to compile it are proprietary. TrafficSense aims to provide free, open access to real-time
        traffic data by leveraging the power of machine learning paired with public-domain traffic cameras available in
        most cities.
      </Typography>
      <Box sx={{ width: "20vw", m: "20px", display: "flex", flexDirection: "column" }}>
        <img
          height={"100%"}
          width={"100%"}
          src={"./example.jpg"}
          alt={"traffic camera images example page"}
          loading="lazy"
        />
        <Typography variant="h6" textAlign={"left"}>
          Traffic Images Example
        </Typography>
      </Box>
      <Typography variant="body1" textAlign={"left"}>
        Publicly-available traffic camera images are run through an object-detection model (
        <a href="https://github.com/WongKinYiu/yolov7">YOLOv7</a>) in real-time to count the number of vehicles in the
        frame. These values are matched to their respective location of the intersection on a map.
      </Typography>
      <Box sx={{ width: "20vw", m: "20px", display: "flex", flexDirection: "column" }}>
        <img
          height={"100%"}
          width={"100%"}
          src={"./inference-result.jpg"}
          alt={"inference result example"}
          loading="lazy"
        />
        <Typography variant="h6" textAlign={"left"}>
          Object Detection Inference Example
        </Typography>
      </Box>
      <Typography variant="body1" textAlign={"left"} gutterBottom>
        Currently, we only support Vancouver, BC.
      </Typography>
    </Box>
  );
}
