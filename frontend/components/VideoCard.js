import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Modal,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  useAccount,
  useContractWrite,
  useEnsName,
  usePrepareContractWrite,
} from "wagmi";
import { getFilesFromPath } from "web3.storage";
// import { create } from "ipfs-http-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { connect } from "@wagmi/core";
import { InjectedConnector } from "@wagmi/core/connectors/injected";
import { useStateContext } from "@/context";
import { peerplayABI, peerplayAddress } from "@/constants";

const style = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  color: "white",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#000",
  border: "2px solid #000",
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
};

export default function VideoCard({ video }) {
  const [hasMinted, setHasMinted] = useState(false);

  const { address, isConnected } = useAccount();
  const { checkIfUserHasMintedVideo } = useStateContext();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    checkIfUserHasMintedVideo()
      .then((value) => {
        setHasMinted(value);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  async function connectWallet() {
    await connect({
      connector: new InjectedConnector(),
    });
  }

  function handleCreatorAddressClicked() {
    if (!isConnected) {
      console.log("working");
      connectWallet();
    } else {
      // console.log(hasMinted);
      router.push(`/creator/${video?.creator}`);
    }
  }

  const ensName = useEnsName({
    address: video?.creator,
    chainId: 1,
  });

  function handleVideoClicked() {
    if (!isConnected) {
      // console.log("working");
      connectWallet();
    } else {
      console.log(hasMinted);
      // if (hasMinted) {
      //   log
      //   // router.push(`/video/watch/${video.videoId.toString()}`);
      // } else {
      //   // handleOpen();
      // }
    }
  }

  function waitForIsSuccess() {
    return new Promise((resolve) => {
      if (isSuccess) {
        resolve();
      } else {
        const interval = setInterval(() => {
          if (isSuccess) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      }
    });
  }

  function handleMint() {
    write();
    Promise.all([waitForIsSuccess()]).then(() => {
      router.push(`/video/watch/${video.videoId.toString()}`);
    });
  }

  return (
    <Card
      sx={{
        width: { xs: "300px", sm: "305px", md: "305px" },
        height: "250px",
        boxShadow: "none",
        borderRadius: 3,
      }}
    >
      <button className="link-btn" onClick={handleVideoClicked}>
        <CardMedia
          image={`${process.env.NEXT_PUBLIC_IPFS_START_URL}/${video.thumbnailHash}/thumbnail.png`}
          alt={"dmeo tilt"}
          sx={{ width: { xs: "100%", sm: "358px" }, height: 180 }}
        />
      </button>
      <CardContent
        sx={{
          backgroundColor: "#1E1E1E",
          height: "106px",
          display: "flex",
          mt:"-4px",
          flexDirection: "column",
          alignItems: "flex-start",
          mb: "2px",
        }}
      >
        <button className="link-btn" onClick={handleVideoClicked}>
          <Typography variant="subtitle1" fontWeight="bold" color="#FFF">
            {video.title}
          </Typography>
        </button>
        {video && (
          <button className="link-btn" onClick={handleCreatorAddressClicked}>
            <Typography variant="subtitle2" color="gray">
              {ensName.data
                ? ensName.data
                : (video?.creator).slice(0, 4) +
                  "..." +
                  (video?.creator).slice(-5, -1)}
              <CheckCircleIcon
                sx={{ fontSize: "12px", color: "gray", ml: "5px" }}
              />
            </Typography>
          </button>
        )}
      </CardContent>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Mint Video Access NFT
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 1 }}>
              {video.title}
            </Typography>
          </Box>
          <Box
            sx={{
              m: "15px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button onClick={()=>{}} className="contract-btn">
              Mint NFT
            </button>
          </Box>
        </Box>
      </Modal>
    </Card>
  );
}
