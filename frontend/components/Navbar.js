"use client";
import { Stack } from "@mui/material";
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
  const { address, connector, isConnected } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ address });
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  console.log("address", address);
  console.log("connector", connector);
  console.log("isConnected", isConnected);
  console.log("ensAvatar", ensAvatar);
  console.log("ensName", ensName);
  console.log("connect", connect);
  console.log("connectors", connectors);
  console.log("error", error);
  console.log("isLoading", isLoading);
  console.log("pendingConnector", pendingConnector);
  console.log("disconnect", disconnect);
  return (
    <Stack
      direction="row"
      alignItems="center"
      p={2}
      sx={{
        position: "sticky",
        background: "#000",
        top: 0,
        justifyContent: "space-between",
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
        direction="row"
        alignItems="center"
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <SearchBar />
        <ConnectButton chainStatus="full" />
      </Stack>
    </Stack>
  );
}
