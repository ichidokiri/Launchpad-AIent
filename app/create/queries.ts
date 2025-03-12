import { readAgentFactoryInitialAmount } from "@/generated";

import { readAgentManagerGetCreateFee } from "@/generated";
import { getWagmiConfig } from "@/lib/web3";
async function getAgentCreateData() {
  const config = getWagmiConfig();
  const initialAmountPromise = readAgentFactoryInitialAmount(config, {});
  const createFeePromise = readAgentManagerGetCreateFee(config, {});

  const [initialAmount, createFee] = await Promise.all([
    initialAmountPromise,
    createFeePromise,
  ]);

  return { initialAmount, createFee };
}

export const getAgentCreateDataQueryOptions = {
  queryKey: ["agentCreateData"],
  queryFn: getAgentCreateData,
};
