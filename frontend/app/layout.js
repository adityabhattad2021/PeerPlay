"use client";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygonMumbai,polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { useState,useEffect } from "react";

const { chains, publicClient } = configureChains(
  [polygonMumbai,polygon],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_POLYGON_RPC_URL }),
    publicProvider(),
  ]
);

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
  const [mounted,setMounted]=useState(false);

  useEffect(()=>{
    setMounted(true);
  },[]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <Navbar />
            {mounted && children}
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
