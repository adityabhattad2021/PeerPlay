"use client";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygonMumbai, polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import {jsonRpcProvider} from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { StateContextProvider } from "@/context";
import Feed from "@/components/Feed";

const { chains, publicClient } = configureChains(
  [mainnet, polygonMumbai],
  [
    jsonRpcProvider({
      rpc:(chain)=>{
        const rpcLookup = {
          [polygonMumbai.id]:process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
          [mainnet.id]:process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
        }
        return {
          http: rpcLookup[chain.id],
        }
      }
    }),
    publicProvider(),
  ]
);

const theme = createTheme({
  palette: {
    primary: {
      main: "#289935",
    },
  },
});

const { connectors } = getDefaultWallets({
  appName: "PeerPlay",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={chains}
            theme={darkTheme({
              accentColor: "#289935",
              accentColorForeground: "white",
              borderRadius: "large",
              fontStack: "system",
              overlayBlur: "small",
            })}
          >
            <ThemeProvider theme={theme}>
              <StateContextProvider>
                {mounted && (
                  <Box sx={{ backgroundColor: "#000", height: "100%" }}>
                    <Navbar />
                    <Feed>{children}</Feed>
                  </Box>
                )}
              </StateContextProvider>
            </ThemeProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
