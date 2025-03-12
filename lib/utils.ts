import { QueryClient } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatEther } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
      },
    },
  });
}

export function calculateMarketCap(agent: {
  virtualEthReserves: bigint;
  virtualTokenReserves: bigint;
}) {
  return formatEther(
    10n ** 27n * (agent.virtualEthReserves / agent.virtualTokenReserves)
  );
}

export function calculatePrice(agent: {
  virtualEthReserves: bigint;
  virtualTokenReserves: bigint;
}) {
  return formatEther(agent.virtualEthReserves / agent.virtualTokenReserves);
}
