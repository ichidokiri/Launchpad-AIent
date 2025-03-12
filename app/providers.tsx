"use client";

import type React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { useState } from "react";
import { getWagmiConfig } from "@/lib/web3";
import { client } from "@/lib/ponder";
import { PonderProvider } from "@ponder/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <PonderProvider client={client}>
      <WagmiProvider config={getWagmiConfig()}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </PonderProvider>
  );
}
