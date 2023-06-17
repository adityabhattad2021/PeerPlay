"use client";
import { Box, TextField, Typography } from "@mui/material";
import { Player, useCreateStream } from "@livepeer/react";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";

export default function Stream() {
  const [streamName, setStreamName] = useState("");
  const {
    mutate: createStream,
    data: createdStream,
    status: createStatus,
  } = useCreateStream(streamName ? { name: streamName } : null);

  console.log(createdStream);
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
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
        Create <span style={{ color: "#289935" }}>Livestreams</span>
      </Typography>
      <Box
        sx={{
          overflow: "auto",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box flex={1}>
          <Box sx={{ width: "55vw", position: "sticky", top: "15px" }}>
            {createdStream ? (
              <Player
                title={createdStream?.name}
                playbackId={createdStream?.playbackId}
                aspectRatio="16to9"
                controls={{
                  autohide: 3000,
                }}
                theme={{
                  borderStyles: { containerBorderStyle: "hidden" },
                  radii: { containerBorderRadius: "10px" },
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "65vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    mb={2}
                    sx={{ color: "white" }}
                  >
                    Once created, the{" "}
                    <span style={{ color: "#289935" }}>stream</span> will be
                    displayed here!
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            height: "80%",
            width: "20%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <TextField
            label="Title of your stream"
            variant="filled"
            value={streamName}
            onChange={(e) => setStreamName(e.target.value)}
            sx={{
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
              width: "100%",
            }}
          />
          <CustomButton
            className="stream-btn"
            text="Create a livestream"
            onClick={() => {
              createStream?.();
            }}
            disabled={createStatus === "loading" || !createStream}
          />

          {createdStream && (
            <>
              <Typography
                variant="p"
                fontWeight="bold"
                mb={2}
                sx={{ color: "white" }}
              >
                Ingest <span style={{ color: "#289935" }}> url</span>:{" "}
                {createdStream?.rtmpIngestUrl}
              </Typography>
              <Typography
                variant="p"
                fontWeight="bold"
                mb={2}
                sx={{ color: "white" }}
              >
                <span style={{ color: "#289935" }}>stream key</span>:{" "}
                {createdStream?.streamKey}
              </Typography>
              <Typography
                variant="p"
                fontWeight="bold"
                mb={2}
                sx={{ color: "white" }}
              >
                Playback <span style={{ color: "#289935" }}>url</span>:{" "}
                {createdStream?.playbackUrl}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
