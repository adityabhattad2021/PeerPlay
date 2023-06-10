"use client";
import Videos from "@/components/Videos";
import { Box, Stack, Typography } from "@mui/material";

export default function Home() {
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
      <Videos />
    </Box>
  );
}
