"use client";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygonMumbai, polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { StateContextProvider } from "@/context";
import Feed from "@/components/Feed";
import { Toaster } from "react-hot-toast";

// Livepeer Config
const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_API_KEY,
  }),
});

const livepeerTheme = {
  colors: {
    accent: "#289935",
    containerBorderColor: "rgba(40, 153, 53, 0.9)",
  },
  fonts: {
    display: "Inter",
  },
};

// Livepeer Config End

// Wagmi Config
const { chains, publicClient } = configureChains(
  [mainnet, polygonMumbai],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        const rpcLookup = {
          [polygonMumbai.id]: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
          [mainnet.id]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
        };
        return {
          http: rpcLookup[chain.id],
        };
      },
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

// Wagmi Config End.

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en">
      <title>Peerplay</title>
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
            <LivepeerConfig client={livepeerClient} theme={livepeerTheme}>
              <ThemeProvider theme={theme}>
                <StateContextProvider>
                  {mounted && (
                    <Box sx={{ backgroundColor: "#000", height: "100%" }}>
                      <div>
                        <Toaster />
                      </div>
                      <Navbar />
                      <Feed>{children}</Feed>
                    </Box>
                  )}
                </StateContextProvider>
              </ThemeProvider>
            </LivepeerConfig>
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
