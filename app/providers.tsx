"use client";
import type React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { getWagmiConfig } from "@/lib/web3";
import { client } from "@/lib/ponder";
import { PonderProvider } from "@ponder/react";
import { getQueryClient } from "@/lib/utils";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PonderProvider client={client}>
      <WagmiProvider config={getWagmiConfig()}>
        <QueryClientProvider client={getQueryClient()}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </PonderProvider>
  );
}
