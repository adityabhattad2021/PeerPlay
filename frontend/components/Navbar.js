"use client";
import { Stack, useMediaQuery } from "@mui/material";
import logo from "../assets/logo.svg";
import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SearchBar from "./SearchBar";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";

export default function Navbar() {
  const notSmallScreen = useMediaQuery("(min-width:870px)");
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
    const ensName = useEnsName({
      address: address,
      chainId:1,
    })
    const ensAvatar = useEnsAvatar({
      name:ensName.data,
      chainId:1,
    })
  const { disconnect } = useDisconnect();

  // console.log("address", address);
  // console.log("connector", connector);
  // console.log("isConnected", isConnected);
  // console.log("ensAvatar", ensAvatar);
  // console.log("ensName", ensName);
  // console.log("connect", connect);
  // console.log("connectors", connectors);
  // console.log("error", error);
  // console.log("isLoading", isLoading);
  // console.log("pendingConnector", pendingConnector);
  // console.log("disconnect", disconnect);
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
        zIndex:10
      }}
    >
      <Link href={"/"}>
        <div style={{ width: "100px", height: "40px" }}>
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
        </div>
      </Link>
      <Stack
        direction={notSmallScreen ? "row" : "column"}
        alignItems="center"
        justifyContent={notSmallScreen ? "flex-end" : "center"}
        sx={{ display: { xs: "none", sm: "flex" } ,gap:2}}
      >
        <SearchBar />
        <ConnectButton chainStatus="full" />
      </Stack>
    </Stack>
  );
}
