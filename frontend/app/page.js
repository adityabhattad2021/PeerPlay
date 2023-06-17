"use client";
import Videos from "@/components/Videos";
import { Box, Typography } from "@mui/material";
import { useContractRead } from "wagmi";
import { peerplayAddress, peerplayABI } from "@/constants";
import { useStateContext } from "@/context";
import { useEffect } from "react";

export default function Home() {
  const { data, isLoading } = useContractRead({
    address: peerplayAddress,
    abi: peerplayABI,
    functionName: "getAllVideos",
    chainId: 80001,
  });
  const { searchedVideos, setSearchedVideos, keyword } = useStateContext();

  useEffect(() => {
    if(keyword===''){
      setSearchedVideos(data)
    }else {
      if(!data) return;
      const results = data.filter((item) =>
        item.title.toLowerCase().includes(keyword.toLowerCase())
      );
      setSearchedVideos(results);
    }
  }, [keyword]);


  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        height: { sx: "calc(100vh - 80px)", md: "calc(100vh)" },
        marginLeft: { sx: 0, md: "13%" },
        marginTop: { sx: "80px", md: 0 },
        px: { sx: 2, md: 4 },
        overflow: "auto",
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
        All <span style={{ color: "#289935" }}>videos</span>
      </Typography>
      <Videos
        videos={searchedVideos || data}
        isLoading={isLoading}
        direction={"row"}
      />
    </Box>
  );
}
