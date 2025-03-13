"use client";
import type React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { wagmiConfig } from "@/lib/web3";
import { client } from "@/lib/ponder";
import { PonderProvider } from "@ponder/react";
import { getQueryClient } from "@/lib/utils";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <PonderProvider client={client}>
        <QueryClientProvider client={getQueryClient()}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </PonderProvider>
    </WagmiProvider>
  );
}
