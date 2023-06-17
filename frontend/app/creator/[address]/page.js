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
import CustomButton from "@/components/CustomButton";
import { peerplayABI, peerplayAddress } from "@/constants";
import { useDebounce } from "usehooks-ts";
import { useStateContext } from "@/context";
import Link from "next/link";

export default function CreatorDetail({ params }) {
  const { address, isConnected } = useAccount();
  const [imageURL, setImageURL] = useState();
  const [isSupporter, setIsSupporter] = useState(true);
  const { checkIfSupporterFunc, fetchImageWithRateLimitHandling } =
    useStateContext();
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

  console.log(ensName,ensAvatar);

  const { data: creatorVideos, isLoading: isCreatorVideosLoading } =
    useContractRead({
      address: peerplayAddress,
      abi: peerplayABI,
      functionName: "getVideosList",
      args: [params?.address],
      enabled: Boolean(params?.address.length > 0),
      chainId: 80001,
    });

  const { data: creatorSupportPrice } = useContractRead({
    address: peerplayAddress,
    abi: peerplayABI,
    functionName: "calculateSupportPrice",
    args: [params?.address],
    enabled: Boolean(params?.address.length > 0),
    chainId: 80001,
  });

  const debouncedPrice = useDebounce(creatorSupportPrice, 10000);

  console.log(debouncedPrice, isSupporter);

  const { config } = usePrepareContractWrite({
    address: peerplayAddress,
    abi: peerplayABI,
    functionName: "supportCreator",
    enabled: Boolean(debouncedPrice) && !Boolean(isSupporter),
    args: [params?.address],
    value: creatorSupportPrice,
  });

  const { write } = useContractWrite(config);
  console.log(isSupporter);

  const avatarCache = new Map();

  async function setImageURLFunc() {
    if (ensAvatar.data) {
      return ensAvatar.data;
    } else {
      const randomNumber =
        Math.floor(Math.random() * (1000000000 - 100000 + 1)) + 100000;
      if (avatarCache.has(randomNumber)) {
        return avatarCache.get(randomNumber);
      }
      const image = await fetchImageWithRateLimitHandling(randomNumber);
      const buffer = new Buffer(image.data).toString("base64");
      avatarCache.set(randomNumber, `data:image/svg+xml;base64,${buffer}`);
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

  useState(() => {
    checkIfSupporterFunc(params?.address)
      .then((isSupporter) => {
        setIsSupporter(isSupporter);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params]);

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
            {!isSupporter ? (
              <CustomButton
                onClick={write}
                text="Support Creator"
                disabled={!write}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "50%",
                }}
              >
                <Link
                  href={{
                    pathname: "/push-protocol/chat",
                    query: {
                      creatorAddress: params?.address,
                    },
                  }}
                >
                  <CustomButton
                    // onClick={write}
                    text="Chat With Creator"
                    disabled={!write}
                    className="creator-page-btn"
                  />
                </Link>
                <Link
                  href={{
                    pathname: "/push-protocol/video",
                    query: {
                      creatorAddress: params?.address,
                    },
                  }}
                >
                  <CustomButton
                    // onClick={write}
                    text="Video Call"
                    disabled={!write}
                    className="creator-page-btn"
                  />
                </Link>
              </div>
            )}
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
