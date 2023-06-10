"use client";
import {
  Box,
  TextField,
  Stack,
  InputAdornment,
  Typography,
  CardMedia,
} from "@mui/material";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";

export default function upload() {
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const router = useRouter();
  const { isConnected } = useAccount();
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
  } = useDropzone({ onDrop: onDropVideo,accept:"video/mp4" });

  const {
    getRootProps: getRootPropsThumb,
    getInputProps: getInputPropsThumb,
    isDragActive: isDragActiveThumb,
  } = useDropzone({ onDrop: onDropThumbnail, accept: "image/png" });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !description || !price || !video || !thumbnail) {
      alert("Please fill all the fields!");
      return;
    }
    // TODO: Upload video to Livepeer and thumbnail to IPFS
    alert("Video uploaded successfully!");
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
                <p>Drag 'n' drop some image files here, or click to select image</p>
              )}
            </div>
          ) : (
            <div style={{position:"relative"}}>
              <ClearIcon
                onClick={() => setThumbnail(null)}
                sx={{ position: "absolute", right: "235px", top: "7px",zIndex:1 ,color:"white"}}
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
            <button className="submit-btn">Submit</button>
          </Stack>
        </Stack>
        <Stack direction="column" gap={6} sx={{ width: "45%" }}>
          {!video ? (
            <div {...getRootPropsVid()} className="dropzone-video">
              <input {...getInputPropsVid()} />
              {isDragActiveVid ? (
                <p>Drop the video here ...</p>
              ) : (
                <p>Drag 'n' drop some video files here, or click to select video</p>
              )}
            </div>
          ) : (
            <div style={{position:"relative"}}>
              <ClearIcon
                onClick={() => setVideo(null)}
                sx={{ position: "absolute", right: "7px", top: "7px",zIndex:1 ,color:"white"}}
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
