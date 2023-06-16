"use client";
import Videos from "@/components/Videos";
import { peerplayABI, peerplayAddress } from "@/constants";
import { useStateContext } from "@/context";
import isZeroAddress from "@/utils/isZeroAddress";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useAccount,
} from "wagmi";
import { connect } from "@wagmi/core";
import { InjectedConnector } from "@wagmi/core/connectors/injected";

export default function MyMintedNFTs() {
  const { isConnected } = useAccount();
  const { getUserMintedVideos } = useStateContext();
  const [formattedData, setFormattedData] = useState();

  async function connectWallet() {
    await connect({
      connector: new InjectedConnector(),
    });
  }

  useEffect(() => {
    if (!isConnected) {
      connectWallet();
      getUserMintedVideos()
        .then((data) => {
          let newData = [];
          for (let x = 0; x < data.length; x++) {
            if (!isZeroAddress(data[x].creator)) {
              newData.push(data[x]);
            }
          }
          setFormattedData(newData);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      getUserMintedVideos()
        .then((data) => {
          let newData = [];
          for (let x = 0; x < data.length; x++) {
            if (!isZeroAddress(data[x].creator)) {
              newData.push(data[x]);
            }
          }
          setFormattedData(newData);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

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
        Your <span style={{ color: "#289935" }}>minted</span> videos
      </Typography>
      <Videos videos={formattedData} isLoading={false} direction={"row"} />
    </Box>
  );
}
