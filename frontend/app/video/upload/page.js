"use client";
import {
  Box,
  TextField,
  Stack,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useAccount, useWaitForTransaction } from "wagmi";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useStateContext } from "@/context";
import { toast } from "react-hot-toast";
import ClearIcon from "@mui/icons-material/Clear";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { useDebounce } from "usehooks-ts";
import { peerplayAddress, peerplayABI } from "@/constants";
import { ethers } from "ethers";
import CustomButton from "@/components/CustomButton";
import sendNotificationPush from "@/utils/sendNotification";

export default function upload() {
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [cid, setCid] = useState("");
  const [assetId, setAssetId] = useState("");
  const { uploadVideo } = useStateContext();

  const router = useRouter();
  const { address, isConnected } = useAccount();
  const onDropVideo = useCallback((acceptedFiles) => {
    setVideo(acceptedFiles[0]);
  }, []);
  const onDropThumbnail = useCallback((acceptedFiles) => {
    setThumbnail(acceptedFiles[0]);
  }, []);

  const {
    getRootProps: getRootPropsVid,
    getInputProps: getInputPropsVid,
    isDragActive: isDragActiveVid,
  } = useDropzone({
    onDrop: onDropVideo,
    maxFiles: 1,
  });

  const {
    getRootProps: getRootPropsThumb,
    getInputProps: getInputPropsThumb,
    isDragActive: isDragActiveThumb,
  } = useDropzone({
    onDrop: onDropThumbnail,
    maxFiles: 1,
  });

  const { uploadToIpfsPromise, uploadVideoPromise } = useStateContext();

  function writeToSmartContractPromise() {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          title.length > 0 &&
          description.length > 0 &&
          assetId.length > 0 &&
          cid.length > 0 &&
          price
        ) {
          await uploadVideo(title, description , assetId, cid, price);
          await sendNotificationPush({
            messageTitle: `New Video Uploaded!`,
            messageBody: `${address} just uploaded a new video`,
          });
        }
        resolve();
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  function writeToSmartContract() {
    toast.promise(writeToSmartContractPromise(), {
      loading: "Updating the state on the smart contract 📝",
      success: "Done updating!",
      error: "Error writing to the Smart Contract",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !description || !price || !video || !thumbnail) {
      alert("Please fill all the fields!");
      return;
    }

    toast.promise(uploadToIpfsPromise(thumbnail), {
      loading: "Uploading Thumbnail to IPFS 🖼️",
      success: (cid) => {
        setCid(cid);
        return `Successfully uploaded! CID: ${cid}`;
      },
      error: "There was an unexected error while uploading",
    });

    toast.promise(uploadVideoPromise(video, title), {
      loading: "Uploading Video to Livepeer 📺",
      success: (assetId) => {
        setAssetId(assetId);
        return `Successfully uploaded! Asset Id: ${assetId}`;
      },
      error: "Error uploading the video",
    });
  }

  if (!isConnected) {
    router.push("/");
  }
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
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
        Upload <span style={{ color: "#289935" }}>video</span>
      </Typography>
      <form className="form-box" onSubmit={(e) => handleSubmit(e)}>
        <Stack direction="column" gap={3} sx={{ width: "45%" }}>
          {!thumbnail ? (
            <div {...getRootPropsThumb()} className="dropzone-thumbnail">
              <input {...getInputPropsThumb()} />
              {isDragActiveThumb ? (
                <p>Drop the thumbnail here ...</p>
              ) : (
                <p>
                  Drag 'n' drop some image files here, or click to select image
                </p>
              )}
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <ClearIcon
                onClick={() => setThumbnail(null)}
                sx={{
                  position: "absolute",
                  right: "235px",
                  top: "7px",
                  zIndex: 1,
                  color: "white",
                }}
              />
              <img
                src={URL.createObjectURL(thumbnail)}
                className="upload-thumbnail"
              />
            </div>
          )}
          <TextField
            label="Video Title"
            variant="filled"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ backgroundColor: "whitesmoke", borderRadius: "10px" }}
          />
          <TextField
            label="Video Description"
            variant="filled"
            sx={{ backgroundColor: "whitesmoke", borderRadius: "10px" }}
            multiline
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxRows={7}
          />
          <Stack direction="row" gap={6}>
            <TextField
              label="Mint Price"
              variant="filled"
              sx={{ backgroundColor: "whitesmoke", borderRadius: "10px" }}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">ETH</InputAdornment>
                ),
              }}
            />
            <button type="submit" className="submit-btn">
              Upload
            </button>
            <CustomButton
              type="button"
              onClick={writeToSmartContract}
              className={"contract-btn"}
              text="Save to Smart Contract"
            />
          </Stack>
        </Stack>
        <Stack direction="column" gap={6} sx={{ width: "45%" }}>
          {!video ? (
            <div {...getRootPropsVid()} className="dropzone-video">
              <input {...getInputPropsVid()} />
              {isDragActiveVid ? (
                <p>Drop the video here ...</p>
              ) : (
                <p>
                  Drag 'n' drop some video files here, or click to select video
                </p>
              )}
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <ClearIcon
                onClick={() => setVideo(null)}
                sx={{
                  position: "absolute",
                  right: "7px",
                  top: "7px",
                  zIndex: 1,
                  color: "white",
                }}
              />
              <video
                controls
                src={URL.createObjectURL(video)}
                className="upload-video"
              />
            </div>
          )}
        </Stack>
      </form>
    </Box>
  );
}
