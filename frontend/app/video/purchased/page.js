"use client";
import Videos from "@/components/Videos";
import { peerplayABI, peerplayAddress } from "@/constants";
import { useStateContext } from "@/context";
import isZeroAddress from "@/utils/isZeroAddress";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAccount, useContractRead, useWalletClient } from "wagmi";

export default function MyMintedNFTs() {
  const { isConnected, connect } = useAccount();
  const { getUserMintedVideos } = useStateContext();
  const [formattedData, setFormattedData] = useState();

  useEffect(() => {
    if (!isConnected) {
      connect();
      getUserMintedVideos()
        .then((data) => {
          console.log(data[0].creator);
          setFormattedData(data);
          if (isZeroAddress(data[0].creator)) {
            setFormattedData([]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      getUserMintedVideos()
        .then((data) => {
          console.log(data[0].creator);
          setFormattedData(data);
          if (isZeroAddress(data[0].creator)) {
            setFormattedData([]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  console.log(formattedData);

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
        Your <span style={{ color: "#289935" }}>minted</span> Videos
      </Typography>
      <Videos videos={formattedData} isLoading={false} direction={"row"} />
    </Box>
  );
}
