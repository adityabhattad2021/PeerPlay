"use client";
import { Stack, useMediaQuery } from "@mui/material";
import logo from "../assets/logo.svg";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SearchBar from "./SearchBar";
import PushLogo from "@/assets/pushprotocol.svg";
import Image from "next/image";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { EmbedSDK } from "@pushprotocol/uiembed";

export default function Navbar() {
  const notSmallScreen = useMediaQuery("(min-width:870px)");
  const account = useAccount();
  useEffect(() => {
    if (account) {
      // 'your connected wallet address'
      EmbedSDK.init({
        headerText: "Notifications", // optional
        targetID: "sdk-trigger-id", // mandatory
        appName: "Peerplay", // mandatory
        user: account, // mandatory
        chainId: 80001, // mandatory
        viewOptions: {
          type: "sidebar", // optional [default: 'sidebar', 'modal']
          showUnreadIndicator: true, // optional
          unreadIndicatorColor: "#289935",
          unreadIndicatorPosition: "bottom-right",
        },
        theme: "dark",
        onOpen: () => {
          console.log("-> client dApp onOpen callback");
        },
        onClose: () => {
          console.log("-> client dApp onClose callback");
        },
      });
    }

    return () => {
      EmbedSDK.cleanup();
    };
  }, []);

  return (
    <Stack
      direction={notSmallScreen ? "row" : "column"}
      alignItems={notSmallScreen ? "center" : "flex-start"}
      p={2}
      sx={{
        position: "sticky",
        background: "#000",
        top: 0,
        justifyContent: "space-between",
        borderBottom: "1px solid #3d3d3d",
        zIndex: 10,
      }}
    >
      <Link href={"/"}>
        {/* <div style={{ width: "100px", height: "40px" }}>
          <h1
            style={{
              color: "#fff",
              fontSize: "2rem",
              fontWeight: "bold",
              cursor: "pointer",
              margin: 0,
              textDecoration: "none",
            }}
          >
            PeerPlay
          </h1>
        </div> */}
        <Image src={logo} alt="logo" width={150} height={40} />
      </Link>
      <Stack
        direction={notSmallScreen ? "row" : "column"}
        alignItems="center"
        justifyContent={notSmallScreen ? "flex-end" : "center"}
        sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}
      >
        <SearchBar />
        <ConnectButton chainStatus="full" />

        <button className="push-btn" id="sdk-trigger-id">
          <Image src={PushLogo} alt="push logo" width={50} height={50} />
        </button>
      </Stack>
    </Stack>
  );
}
