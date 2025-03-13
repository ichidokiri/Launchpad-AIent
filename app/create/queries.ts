import { readAgentFactoryInitialAmount } from "@/ponder/generated";

import { readAgentManagerGetCreateFee } from "@/ponder/generated";
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
