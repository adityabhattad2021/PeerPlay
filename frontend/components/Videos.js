"use client";
import { Box, Stack } from "@mui/material";
import VideoCard from "./VideoCard";
import { useContractRead } from 'wagmi'
import { peerplayAddress,peerplayABI } from "@/constants";
import Loader from "./Loader";

const dummyVideos = [1, 2, 34, 1, 2, 3, 3, 4, 4, 5, 5, 7, 8, 9, 1, 121, 12];

export default function Videos() {

  const { data, isError, isLoading,isSuccess } = useContractRead({
    address: peerplayAddress,
    abi: peerplayABI,
    functionName: 'getAllVideos',
  });

  if(isLoading){
    return (
      <div>
        <Loader/>
      </div>
    )
  }

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
      {data.map((data, idx) => (
        <Box key={idx}>
          <VideoCard video={data} />
        </Box>
      ))}
    </Stack>
  );
}
