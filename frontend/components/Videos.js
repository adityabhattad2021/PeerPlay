"use client";
import { Box, Stack } from "@mui/material";
import VideoCard from "./VideoCard";
import Loader from "./Loader";

export default function Videos({videos,isLoading}) {

  if(isLoading){
    return (
      <div>
        <Loader/>
      </div>
    )
  }

  return (
    <Stack
      direction={ "row"}
      flexWrap="wrap"
      justifyContent="start"
      alignItems="start"
      gap={2}
      sx={{ flexDirection: { xs: "column", sm: "row" } }}
      overflow={"auto"}
    >
      {videos.map((data, idx) => (
        <Box key={idx}>
          <VideoCard video={data} />
        </Box>
      ))}
    </Stack>
  );
}
