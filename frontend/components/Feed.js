"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Avatar,
  IconButton,
  Divider,
  InputAdornment,
  useTheme,
} from "@mui/material";
import Sidebar from "./Sidebar";
import { useDisconnect,useAccount } from "wagmi";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Feed({children}) {
  const [selectedPage, setSelectedPage] = useState("New");
  const notSmallScreen = useMediaQuery("(min-width:1100px)");
  const { disconnect } = useDisconnect();
  const {isConnected} = useAccount();

  return (
    <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
      <Box
        sx={{
          height: { sx: "auto", md: "89vh" },
          width: { sx: "100%", md: "12%" },
          borderRight: "1px solid #3d3d3d",
          px: { sx: 0, md: 2 },
        }}
      >
        <Sidebar
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
        {(notSmallScreen && isConnected) && (
          <Stack direction="column">
            <button
              className="category-btn"
              style={{
                background: "#289935",
                height: "40px",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => disconnect()}
            >
              <span
                style={{
                  white: "#289935",
                }}
              >
                Disconnect
              </span>
            </button>
          </Stack>
        )}
      </Box>
      {children}
    </Stack>
  );
}
