"use client";
import { Box, Stack } from "@mui/material";
import VideoCard from "./VideoCard";

const dummyVideos = [1, 2, 34, 1, 2, 3, 3, 4, 4, 5, 5, 7, 8, 9, 1, 121, 12];

export default function Videos() {
  return (
    <Stack
      direction={"row"}
      flexWrap="wrap"
      justifyContent="start"
      alignItems="start"
      gap={2}
      sx={{ flexDirection: { xs: "column", sm: "row" } }}
      overflow={"auto"}
    >
      {dummyVideos.map((item, idx) => (
        <Box key={idx}>
          <VideoCard video={item} />
        </Box>
      ))}
    </Stack>
  );
}
