import { createConfig, NetworkConfig, rateLimit } from "ponder";
import { http } from "viem";

const agentManagerAddress = {
  10143: "0x64188097A75788471Bb468353C581adA59bB823A",
  11155111: "0xa8CBa74726686462039C015161237E7abE3Be516",
} as const;
const agentManagerAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "feeRecipientAddress", internalType: "address", type: "address" },
      { name: "feeAmt", internalType: "uint256", type: "uint256" },
      { name: "basisFee", internalType: "uint256", type: "uint256" },
      { name: "router", internalType: "address", type: "address" },
      { name: "agentFactoryAddress", internalType: "address", type: "address" },
    ],
    stateMutability: "nonpayable",
  },
  { type: "error", inputs: [], name: "ReentrancyGuardReentrantCall" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "user", internalType: "address", type: "address", indexed: true },
      { name: "mint", internalType: "address", type: "address", indexed: true },
      {
        name: "timestamp",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Complete",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "mint", internalType: "address", type: "address", indexed: true },
      { name: "user", internalType: "address", type: "address", indexed: true },
      {
        name: "virtualEthReserves",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "virtualTokenReserves",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      { name: "name", internalType: "string", type: "string", indexed: false },
      {
        name: "ticker",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "description",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "imageUrl",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "socialLinks",
        internalType: "struct SocialLinks",
        type: "tuple",
        components: [
          { name: "x", internalType: "string", type: "string" },
          { name: "youtube", internalType: "string", type: "string" },
          { name: "discord", internalType: "string", type: "string" },
          { name: "github", internalType: "string", type: "string" },
        ],
        indexed: false,
      },
    ],
    name: "CreatePool",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "token",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "uniswapV2Pair",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "ethReserves",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "tokenReserves",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "timestamp",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "OpenTradingOnUniswap",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "mint", internalType: "address", type: "address", indexed: true },
      {
        name: "ethAmount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "tokenAmount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      { name: "isBuy", internalType: "bool", type: "bool", indexed: false },
      { name: "user", internalType: "address", type: "address", indexed: true },
      {
        name: "timestamp",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "virtualEthReserves",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "virtualTokenReserves",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Trade",
  },
  {
    type: "function",
    inputs: [],
    name: "agentFactory",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "bondingCurve",
    outputs: [
      { name: "agentMint", internalType: "address", type: "address" },
      {
        name: "virtualTokenReserves",
        internalType: "uint256",
        type: "uint256",
      },
      { name: "virtualEthReserves", internalType: "uint256", type: "uint256" },
      { name: "realTokenReserves", internalType: "uint256", type: "uint256" },
      { name: "realEthReserves", internalType: "uint256", type: "uint256" },
      { name: "tokenTotalSupply", internalType: "uint256", type: "uint256" },
      { name: "mcapLimit", internalType: "uint256", type: "uint256" },
      { name: "agentOwner", internalType: "address", type: "address" },
      { name: "complete", internalType: "bool", type: "bool" },
      { name: "uniswapV2Pair", internalType: "address", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "agentAddress", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "maxEthCost", internalType: "uint256", type: "uint256" },
    ],
    name: "buy",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      {
        name: "agent",
        internalType: "struct AgentManager.Agent",
        type: "tuple",
        components: [
          { name: "agentMint", internalType: "address", type: "address" },
          {
            name: "virtualTokenReserves",
            internalType: "uint256",
            type: "uint256",
          },
          {
            name: "virtualEthReserves",
            internalType: "uint256",
            type: "uint256",
          },
          {
            name: "realTokenReserves",
            internalType: "uint256",
            type: "uint256",
          },
          { name: "realEthReserves", internalType: "uint256", type: "uint256" },
          {
            name: "tokenTotalSupply",
            internalType: "uint256",
            type: "uint256",
          },
          { name: "mcapLimit", internalType: "uint256", type: "uint256" },
          { name: "agentOwner", internalType: "address", type: "address" },
          { name: "complete", internalType: "bool", type: "bool" },
          { name: "uniswapV2Pair", internalType: "address", type: "address" },
        ],
      },
      { name: "tokenAmount", internalType: "uint256", type: "uint256" },
    ],
    name: "calculateEthCost",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [
      { name: "agentAddress", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "agentOwnerAddress", internalType: "address", type: "address" },
      { name: "name", internalType: "string", type: "string" },
      { name: "ticker", internalType: "string", type: "string" },
      { name: "description", internalType: "string", type: "string" },
      { name: "imageUrl", internalType: "string", type: "string" },
      {
        name: "socialLinks",
        internalType: "struct SocialLinks",
        type: "tuple",
        components: [
          { name: "x", internalType: "string", type: "string" },
          { name: "youtube", internalType: "string", type: "string" },
          { name: "discord", internalType: "string", type: "string" },
          { name: "github", internalType: "string", type: "string" },
        ],
      },
    ],
    name: "createPool",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [{ name: "mint", internalType: "address", type: "address" }],
    name: "getBondingCurve",
    outputs: [
      {
        name: "",
        internalType: "struct AgentManager.Agent",
        type: "tuple",
        components: [
          { name: "agentMint", internalType: "address", type: "address" },
          {
            name: "virtualTokenReserves",
            internalType: "uint256",
            type: "uint256",
          },
          {
            name: "virtualEthReserves",
            internalType: "uint256",
            type: "uint256",
          },
          {
            name: "realTokenReserves",
            internalType: "uint256",
            type: "uint256",
          },
          { name: "realEthReserves", internalType: "uint256", type: "uint256" },
          {
            name: "tokenTotalSupply",
            internalType: "uint256",
            type: "uint256",
          },
          { name: "mcapLimit", internalType: "uint256", type: "uint256" },
          { name: "agentOwner", internalType: "address", type: "address" },
          { name: "complete", internalType: "bool", type: "bool" },
          { name: "uniswapV2Pair", internalType: "address", type: "address" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "getCreateFee",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "agentAddress", internalType: "address", type: "address" },
    ],
    name: "openTradingOnUniswap",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "agentAddress", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "minEthOutput", internalType: "uint256", type: "uint256" },
    ],
    name: "sell",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "_agentFactory", internalType: "address", type: "address" },
    ],
    name: "setAgentFactory",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "newBasisPoint", internalType: "uint256", type: "uint256" },
      { name: "newCreateFee", internalType: "uint256", type: "uint256" },
    ],
    name: "setFeeAmount",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "newAddr", internalType: "address", type: "address" }],
    name: "setFeeRecipient",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "initToken", internalType: "uint256", type: "uint256" },
      { name: "initEth", internalType: "uint256", type: "uint256" },
    ],
    name: "setInitialVirtualReserves",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "newLimit", internalType: "uint256", type: "uint256" }],
    name: "setMcapLimit",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "newAddr", internalType: "address", type: "address" }],
    name: "setOwner",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "newSupply", internalType: "uint256", type: "uint256" }],
    name: "setTotalSupply",
    outputs: [],
    stateMutability: "nonpayable",
  },
  { type: "receive", stateMutability: "payable" },
] as const;
import { monadTestnet, sepolia } from "viem/chains";
const networks = {
  [sepolia.id]: {
    chainId: sepolia.id,
    transport: http(process.env[`PONDER_RPC_URL_${sepolia.id}`]),
    pollingInterval: 5000,
  },
  [monadTestnet.id]: {
    chainId: monadTestnet.id,
    transport: rateLimit(
      http(process.env[`PONDER_RPC_URL_${monadTestnet.id}`]),
      {
        requestsPerSecond: 10,
      }
    ),
    pollingInterval: 5000,
  },
} as const satisfies Record<number, NetworkConfig>;

export default createConfig({
  networks,
  database: {
    kind: "postgres",
    connectionString: process.env.PONDER_DATABASE_URL,
  },

  contracts: {
    agentManager: {
      abi: agentManagerAbi,
      network: {
        [monadTestnet.id]: {
          address: agentManagerAddress[monadTestnet.id],
          // startBlock: 7513000,
          // endBlock: 7445000,
          startBlock: "latest",
        },
        // [sepolia.id]: {
        //   address: agentManagerAddress[sepolia.id],
        //   startBlock: 7878113,
        // },
      },
    },
  },
});

export type SupportedChainIds = keyof typeof networks;
