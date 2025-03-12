import { http } from "wagmi";
import { sepolia, monadTestnet } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const getWagmiConfig = () =>
  getDefaultConfig({
    appName: "AIent",
    projectId: "9b01211a55d46bd31cb53ebf29698882",
    chains: [monadTestnet],
    transports: {
      [monadTestnet.id]: http(),
    },
    ssr: true,
  });

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getWagmiConfig>;
  }
}
