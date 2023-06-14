"use client";
import { Typography, Box, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Player } from "@livepeer/react";
import { useAsset } from "@livepeer/react";
import Videos from "@/components/Videos";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { useStateContext } from "@/context";
import { useContractRead } from "wagmi";
import { peerplayABI, peerplayAddress } from "@/constants";

export default function Watch({ params }) {
  const [videoDetail, setVideoDetail] = useState(null);
  const [assetId, setAssetId] = useState(null);
  const { getVideoDetailsFunc } = useStateContext();

  const { data:creatorVideos, isLoading:isCreatorVideosLoading } = useContractRead({
    address: peerplayAddress,
    abi: peerplayABI,
    functionName: 'getVideosList',
    args:[videoDetail?.creator],
    enabled:Boolean(videoDetail),
    chainId:80001,
  });


  useEffect(() => {
    getVideoDetailsFunc(params.id)
      .then((video) => {
        setVideoDetail(video);
        setAssetId(video.livepeerId);
        console.log(video);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const asset = useAsset({
    enabled: Boolean(videoDetail),
    assetId,
  });

  // console.log(assetId);
  // console.log(asset);


  if (!asset) {
    return (
      <Box
        p={2}
        sx={{
          width: "100%",
          height: { sx: "calc(100vh - 80px)", md: "calc(100vh)" },
          px: { sx: 2, md: 4 },
          overflow: "auto",
        }}
      >
        <Loader />
      </Box>
    );
  }

  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        height: { sx: "calc(100vh - 80px)", md: "calc(100vh)" },
        px: { sx: 2, md: 4 },
        overflow: "auto",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Box flex={1}>
          <Box sx={{ width: "55vw", position: "sticky", top: "15px" }}>
            <Player
              title={`${videoDetail?.title}`}
              playbackId={asset?.data?.playbackId}
              aspectRatio="16to9"
              controls={{
                autohide: 3000,
              }}
              theme={{
                borderStyles: { containerBorderStyle: "hidden" },
                radii: { containerBorderRadius: "10px" },
              }}
            />
            <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
              {videoDetail?.title}
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ color: "#fff" }}
              py={1}
              px={2}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
                sx={{ color: "white" }}
              >
                {videoDetail?.description}
                <CheckCircleIcon
                  sx={{ fontSize: "12px", color: "gray", ml: "5px" }}
                />
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Box
          px={2}
          py={{ md: 1, xs: 5 }}
          display="flex"
          flexDirection="column"
  
          alignItems="center"
          sx={{
            width:"25vw"
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
            sx={{ color: "white",display:"inline-block",height:"50px",textAlign:"center"}}
          >
            More from <span style={{ color: "#289935" }}>Creator</span>
          </Typography>
          <Videos videos={creatorVideos} isLoading={isCreatorVideosLoading} direction={"column"} justifyContent={"center"}/>
        </Box>
      </Stack>
    </Box>
  );
}
