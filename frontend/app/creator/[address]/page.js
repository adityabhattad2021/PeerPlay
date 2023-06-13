"use client";
import { useState, useEffect } from "react";
import { Box, CardContent, CardMedia, Typography } from "@mui/material";
import Videos from "@/components/Videos";
import {
  useAccount,
  useContractRead,
  useEnsAvatar,
  useEnsName,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import CustomButton from "@/components/CustomButton";
import { peerplayABI, peerplayAddress } from "@/constants";
import { BigNumber, ethers } from "ethers";
import { useDebounce } from "usehooks-ts";

export default function CreatorDetail({ params }) {
  const [imageURL, setImageURL] = useState();
  const { isConnected } = useAccount();
  const ensName = useEnsName({
    enabled: Boolean(params?.address.length > 0),
    address: params?.address,
    chainId: 1,
  });

  const ensAvatar = useEnsAvatar({
    enabled: Boolean(params?.address.length > 0),
    address: params?.address,
    chainId: 1,
  });

  const { data: creatorVideos, isLoading: isCreatorVideosLoading } =
    useContractRead({
      address: peerplayAddress,
      abi: peerplayABI,
      functionName: "getVideosList",
      args: [params?.address],
      enabled: Boolean(params?.address.length > 0),
      chainId: 80001,
    });

  const { data: creatorSupportPrice, isLoading } = useContractRead({
    address: peerplayAddress,
    abi: peerplayABI,
    functionName: "calculateSupportPrice",
    args: [params?.address],
    enabled: Boolean(params?.address.length > 0),
    chainId: 80001,
  });

  const debouncedPrice = useDebounce(creatorSupportPrice, 10000);


  const { config } = usePrepareContractWrite({
    address: peerplayAddress,
    abi: peerplayABI,
    functionName: "supportCreator",
    enabled: Boolean(debouncedPrice),
    args: [params?.address],
    value:creatorSupportPrice
  });

  const { data, write } = useContractWrite(config);

  async function setImageURLFunc() {
    if (ensAvatar.data) {
      return ensAvatar.data;
    } else {
      const randomNumber =
        Math.floor(Math.random() * (1000000000 - 100000 + 1)) + 100000;
      const api = "https://api.multiavatar.com";
      const image = await axios.get(`${api}/${randomNumber}`);
      const buffer = new Buffer(image.data).toString("base64");
      return `data:image/svg+xml;base64,${buffer}`;
    }
  }

  useState(() => {
    setImageURLFunc()
      .then((image) => {
        setImageURL(image);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <Box minHeight="95vh" minWidth="100vw">
        <Box>
          <div
            style={{
              height: "200px",
              background:
                "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(196,163,77,1) 0%, rgba(40,153,53,1) 47%, rgba(0,185,255,1) 100%)",
              zIndex: 10,
            }}
          />
          <Box
            sx={{
              boxShadow: "none",
              borderRadius: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "356px", md: "320px" },
              height: "326px",
              margin: "auto",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                color: "#fff",
              }}
            >
              <CardMedia
                image={imageURL ? imageURL : ""}
                alt={"channelDetail?.snippet?.title"}
                sx={{
                  borderRadius: "50%",
                  height: "180px",
                  width: "180px",
                  mb: 2,
                  mt: "-295px",
                  border: "1px solid #e3e3e3",
                }}
                component="img"
              />
              <Typography variant="h6">
                {ensName.data
                  ? ensName.data
                  : params?.address
                  ? `${params?.address.slice(0, 4)}...${params?.address.slice(
                      -5,
                      -1
                    )}`
                  : ""}
                <CheckCircleIcon
                  sx={{ fontSize: "14px", color: "gray", ml: "5px" }}
                />
              </Typography>
            </CardContent>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: "-180px",
              mb: "50px",
            }}
          >
            <CustomButton
              onClick={() => write?.()}
              text="Support Creator"
              // disabled={!isConnected || !write}
            />
          </Box>
        </Box>
        <Box p={2} display="flex">
          <Box sx={{ mr: { sm: "100px" } }} />
          <Videos
            videos={creatorVideos}
            isLoading={isCreatorVideosLoading}
            direction={"column"}
          />
        </Box>
      </Box>
    </div>
  );
}