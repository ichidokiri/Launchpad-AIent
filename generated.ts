import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from "wagmi/codegen";

import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from "wagmi/codegen";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Agent
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const agentAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "agentName_", internalType: "string", type: "string" },
      { name: "agentSymbol_", internalType: "string", type: "string" },
      { name: "initialSupply", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "error",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "allowance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" },
    ],
    name: "ERC20InsufficientAllowance",
  },
  {
    type: "error",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      { name: "balance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" },
    ],
    name: "ERC20InsufficientBalance",
  },
  {
    type: "error",
    inputs: [{ name: "approver", internalType: "address", type: "address" }],
    name: "ERC20InvalidApprover",
  },
  {
    type: "error",
    inputs: [{ name: "receiver", internalType: "address", type: "address" }],
    name: "ERC20InvalidReceiver",
  },
  {
    type: "error",
    inputs: [{ name: "sender", internalType: "address", type: "address" }],
    name: "ERC20InvalidSender",
  },
  {
    type: "error",
    inputs: [{ name: "spender", internalType: "address", type: "address" }],
    name: "ERC20InvalidSpender",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "spender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "from", internalType: "address", type: "address", indexed: true },
      { name: "to", internalType: "address", type: "address", indexed: true },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Transfer",
  },
  {
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "value", internalType: "uint256", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AgentFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const agentFactoryAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    inputs: [],
    name: "INITIAL_AMOUNT",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    name: "agents",
    outputs: [
      { name: "agentAddress", internalType: "address", type: "address" },
      { name: "agentName", internalType: "string", type: "string" },
      { name: "agentSymbol", internalType: "string", type: "string" },
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
      { name: "totalSupply", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "contractAddress",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "currentAgentIndex",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
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
    name: "deployERC20Token",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [],
    name: "owner",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "newAddr", internalType: "address", type: "address" }],
    name: "setPoolAddress",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "newOwner", internalType: "address", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

/**
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const agentFactoryAddress = {
  10143: "0xdBFF222D9fAA6e4Cce49F2988273e14ef891450f",
  11155111: "0x539d38511439C407DebE03e2cB0310b589039Fba",
} as const;

/**
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const agentFactoryConfig = {
  address: agentFactoryAddress,
  abi: agentFactoryAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AgentManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const agentManagerAbi = [
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

/**
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const agentManagerAddress = {
  10143: "0x64188097A75788471Bb468353C581adA59bB823A",
  11155111: "0xa8CBa74726686462039C015161237E7abE3Be516",
} as const;

/**
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const agentManagerConfig = {
  address: agentManagerAddress,
  abi: agentManagerAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20Abi = [
  {
    type: "error",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "allowance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" },
    ],
    name: "ERC20InsufficientAllowance",
  },
  {
    type: "error",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      { name: "balance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" },
    ],
    name: "ERC20InsufficientBalance",
  },
  {
    type: "error",
    inputs: [{ name: "approver", internalType: "address", type: "address" }],
    name: "ERC20InvalidApprover",
  },
  {
    type: "error",
    inputs: [{ name: "receiver", internalType: "address", type: "address" }],
    name: "ERC20InvalidReceiver",
  },
  {
    type: "error",
    inputs: [{ name: "sender", internalType: "address", type: "address" }],
    name: "ERC20InvalidSender",
  },
  {
    type: "error",
    inputs: [{ name: "spender", internalType: "address", type: "address" }],
    name: "ERC20InvalidSpender",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "spender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "from", internalType: "address", type: "address", indexed: true },
      { name: "to", internalType: "address", type: "address", indexed: true },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Transfer",
  },
  {
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20Burnable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20BurnableAbi = [
  {
    type: "error",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "allowance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" },
    ],
    name: "ERC20InsufficientAllowance",
  },
  {
    type: "error",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      { name: "balance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" },
    ],
    name: "ERC20InsufficientBalance",
  },
  {
    type: "error",
    inputs: [{ name: "approver", internalType: "address", type: "address" }],
    name: "ERC20InvalidApprover",
  },
  {
    type: "error",
    inputs: [{ name: "receiver", internalType: "address", type: "address" }],
    name: "ERC20InvalidReceiver",
  },
  {
    type: "error",
    inputs: [{ name: "sender", internalType: "address", type: "address" }],
    name: "ERC20InvalidSender",
  },
  {
    type: "error",
    inputs: [{ name: "spender", internalType: "address", type: "address" }],
    name: "ERC20InvalidSpender",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "spender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "from", internalType: "address", type: "address", indexed: true },
      { name: "to", internalType: "address", type: "address", indexed: true },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Transfer",
  },
  {
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "value", internalType: "uint256", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IAgentManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iAgentManagerAbi = [
  {
    type: "function",
    inputs: [
      { name: "token", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "tokenOwner", internalType: "address", type: "address" },
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
    inputs: [],
    name: "getCreateFee",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155ErrorsAbi = [
  {
    type: "error",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      { name: "balance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" },
      { name: "tokenId", internalType: "uint256", type: "uint256" },
    ],
    name: "ERC1155InsufficientBalance",
  },
  {
    type: "error",
    inputs: [{ name: "approver", internalType: "address", type: "address" }],
    name: "ERC1155InvalidApprover",
  },
  {
    type: "error",
    inputs: [
      { name: "idsLength", internalType: "uint256", type: "uint256" },
      { name: "valuesLength", internalType: "uint256", type: "uint256" },
    ],
    name: "ERC1155InvalidArrayLength",
  },
  {
    type: "error",
    inputs: [{ name: "operator", internalType: "address", type: "address" }],
    name: "ERC1155InvalidOperator",
  },
  {
    type: "error",
    inputs: [{ name: "receiver", internalType: "address", type: "address" }],
    name: "ERC1155InvalidReceiver",
  },
  {
    type: "error",
    inputs: [{ name: "sender", internalType: "address", type: "address" }],
    name: "ERC1155InvalidSender",
  },
  {
    type: "error",
    inputs: [
      { name: "operator", internalType: "address", type: "address" },
      { name: "owner", internalType: "address", type: "address" },
    ],
    name: "ERC1155MissingApprovalForAll",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20Abi = [
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "spender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "from", internalType: "address", type: "address", indexed: true },
      { name: "to", internalType: "address", type: "address", indexed: true },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Transfer",
  },
  {
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20ErrorsAbi = [
  {
    type: "error",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "allowance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" },
    ],
    name: "ERC20InsufficientAllowance",
  },
  {
    type: "error",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      { name: "balance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" },
    ],
    name: "ERC20InsufficientBalance",
  },
  {
    type: "error",
    inputs: [{ name: "approver", internalType: "address", type: "address" }],
    name: "ERC20InvalidApprover",
  },
  {
    type: "error",
    inputs: [{ name: "receiver", internalType: "address", type: "address" }],
    name: "ERC20InvalidReceiver",
  },
  {
    type: "error",
    inputs: [{ name: "sender", internalType: "address", type: "address" }],
    name: "ERC20InvalidSender",
  },
  {
    type: "error",
    inputs: [{ name: "spender", internalType: "address", type: "address" }],
    name: "ERC20InvalidSpender",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Metadata
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20MetadataAbi = [
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "spender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "from", internalType: "address", type: "address", indexed: true },
      { name: "to", internalType: "address", type: "address", indexed: true },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Transfer",
  },
  {
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC721Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc721ErrorsAbi = [
  {
    type: "error",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      { name: "tokenId", internalType: "uint256", type: "uint256" },
      { name: "owner", internalType: "address", type: "address" },
    ],
    name: "ERC721IncorrectOwner",
  },
  {
    type: "error",
    inputs: [
      { name: "operator", internalType: "address", type: "address" },
      { name: "tokenId", internalType: "uint256", type: "uint256" },
    ],
    name: "ERC721InsufficientApproval",
  },
  {
    type: "error",
    inputs: [{ name: "approver", internalType: "address", type: "address" }],
    name: "ERC721InvalidApprover",
  },
  {
    type: "error",
    inputs: [{ name: "operator", internalType: "address", type: "address" }],
    name: "ERC721InvalidOperator",
  },
  {
    type: "error",
    inputs: [{ name: "owner", internalType: "address", type: "address" }],
    name: "ERC721InvalidOwner",
  },
  {
    type: "error",
    inputs: [{ name: "receiver", internalType: "address", type: "address" }],
    name: "ERC721InvalidReceiver",
  },
  {
    type: "error",
    inputs: [{ name: "sender", internalType: "address", type: "address" }],
    name: "ERC721InvalidSender",
  },
  {
    type: "error",
    inputs: [{ name: "tokenId", internalType: "uint256", type: "uint256" }],
    name: "ERC721NonexistentToken",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IUniswapV2Factory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iUniswapV2FactoryAbi = [
  {
    type: "function",
    inputs: [
      { name: "tokenA", internalType: "address", type: "address" },
      { name: "tokenB", internalType: "address", type: "address" },
    ],
    name: "createPair",
    outputs: [{ name: "pair", internalType: "address", type: "address" }],
    stateMutability: "nonpayable",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IUniswapV2Router02
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iUniswapV2Router02Abi = [
  {
    type: "function",
    inputs: [],
    name: "WETH",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [
      { name: "token", internalType: "address", type: "address" },
      { name: "amountTokenDesired", internalType: "uint256", type: "uint256" },
      { name: "amountTokenMin", internalType: "uint256", type: "uint256" },
      { name: "amountETHMin", internalType: "uint256", type: "uint256" },
      { name: "to", internalType: "address", type: "address" },
      { name: "deadline", internalType: "uint256", type: "uint256" },
    ],
    name: "addLiquidityETH",
    outputs: [
      { name: "amountToken", internalType: "uint256", type: "uint256" },
      { name: "amountETH", internalType: "uint256", type: "uint256" },
      { name: "liquidity", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [],
    name: "factory",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [
      { name: "amountIn", internalType: "uint256", type: "uint256" },
      { name: "amountOutMin", internalType: "uint256", type: "uint256" },
      { name: "path", internalType: "address[]", type: "address[]" },
      { name: "to", internalType: "address", type: "address" },
      { name: "deadline", internalType: "uint256", type: "uint256" },
    ],
    name: "swapExactTokensForETHSupportingFeeOnTransferTokens",
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Lock
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const lockAbi = [
  {
    type: "constructor",
    inputs: [{ name: "_unlockTime", internalType: "uint256", type: "uint256" }],
    stateMutability: "payable",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "when",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Withdrawal",
  },
  {
    type: "function",
    inputs: [],
    name: "owner",
    outputs: [{ name: "", internalType: "address payable", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "unlockTime",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ReentrancyGuard
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const reentrancyGuardAbi = [
  { type: "error", inputs: [], name: "ReentrancyGuardReentrantCall" },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentAbi}__
 */
export const readAgent = /*#__PURE__*/ createReadContract({ abi: agentAbi });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"allowance"`
 */
export const readAgentAllowance = /*#__PURE__*/ createReadContract({
  abi: agentAbi,
  functionName: "allowance",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readAgentBalanceOf = /*#__PURE__*/ createReadContract({
  abi: agentAbi,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"decimals"`
 */
export const readAgentDecimals = /*#__PURE__*/ createReadContract({
  abi: agentAbi,
  functionName: "decimals",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"name"`
 */
export const readAgentName = /*#__PURE__*/ createReadContract({
  abi: agentAbi,
  functionName: "name",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"symbol"`
 */
export const readAgentSymbol = /*#__PURE__*/ createReadContract({
  abi: agentAbi,
  functionName: "symbol",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readAgentTotalSupply = /*#__PURE__*/ createReadContract({
  abi: agentAbi,
  functionName: "totalSupply",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentAbi}__
 */
export const writeAgent = /*#__PURE__*/ createWriteContract({ abi: agentAbi });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"approve"`
 */
export const writeAgentApprove = /*#__PURE__*/ createWriteContract({
  abi: agentAbi,
  functionName: "approve",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"burn"`
 */
export const writeAgentBurn = /*#__PURE__*/ createWriteContract({
  abi: agentAbi,
  functionName: "burn",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"burnFrom"`
 */
export const writeAgentBurnFrom = /*#__PURE__*/ createWriteContract({
  abi: agentAbi,
  functionName: "burnFrom",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"transfer"`
 */
export const writeAgentTransfer = /*#__PURE__*/ createWriteContract({
  abi: agentAbi,
  functionName: "transfer",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeAgentTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: agentAbi,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentAbi}__
 */
export const simulateAgent = /*#__PURE__*/ createSimulateContract({
  abi: agentAbi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"approve"`
 */
export const simulateAgentApprove = /*#__PURE__*/ createSimulateContract({
  abi: agentAbi,
  functionName: "approve",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"burn"`
 */
export const simulateAgentBurn = /*#__PURE__*/ createSimulateContract({
  abi: agentAbi,
  functionName: "burn",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"burnFrom"`
 */
export const simulateAgentBurnFrom = /*#__PURE__*/ createSimulateContract({
  abi: agentAbi,
  functionName: "burnFrom",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"transfer"`
 */
export const simulateAgentTransfer = /*#__PURE__*/ createSimulateContract({
  abi: agentAbi,
  functionName: "transfer",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateAgentTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: agentAbi,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link agentAbi}__
 */
export const watchAgentEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: agentAbi,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link agentAbi}__ and `eventName` set to `"Approval"`
 */
export const watchAgentApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: agentAbi,
  eventName: "Approval",
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link agentAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchAgentTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: agentAbi,
  eventName: "Transfer",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentFactoryAbi}__
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const readAgentFactory = /*#__PURE__*/ createReadContract({
  abi: agentFactoryAbi,
  address: agentFactoryAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"INITIAL_AMOUNT"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const readAgentFactoryInitialAmount = /*#__PURE__*/ createReadContract({
  abi: agentFactoryAbi,
  address: agentFactoryAddress,
  functionName: "INITIAL_AMOUNT",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"agents"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const readAgentFactoryAgents = /*#__PURE__*/ createReadContract({
  abi: agentFactoryAbi,
  address: agentFactoryAddress,
  functionName: "agents",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"contractAddress"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const readAgentFactoryContractAddress = /*#__PURE__*/ createReadContract(
  {
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "contractAddress",
  }
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"currentAgentIndex"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const readAgentFactoryCurrentAgentIndex =
  /*#__PURE__*/ createReadContract({
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "currentAgentIndex",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const readAgentFactoryOwner = /*#__PURE__*/ createReadContract({
  abi: agentFactoryAbi,
  address: agentFactoryAddress,
  functionName: "owner",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentFactoryAbi}__
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const writeAgentFactory = /*#__PURE__*/ createWriteContract({
  abi: agentFactoryAbi,
  address: agentFactoryAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"deployERC20Token"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const writeAgentFactoryDeployErc20Token =
  /*#__PURE__*/ createWriteContract({
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "deployERC20Token",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"setPoolAddress"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const writeAgentFactorySetPoolAddress =
  /*#__PURE__*/ createWriteContract({
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "setPoolAddress",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const writeAgentFactoryTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "transferOwnership",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentFactoryAbi}__
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const simulateAgentFactory = /*#__PURE__*/ createSimulateContract({
  abi: agentFactoryAbi,
  address: agentFactoryAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"deployERC20Token"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const simulateAgentFactoryDeployErc20Token =
  /*#__PURE__*/ createSimulateContract({
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "deployERC20Token",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"setPoolAddress"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const simulateAgentFactorySetPoolAddress =
  /*#__PURE__*/ createSimulateContract({
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "setPoolAddress",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const simulateAgentFactoryTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "transferOwnership",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentManagerAbi}__
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const readAgentManager = /*#__PURE__*/ createReadContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"agentFactory"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const readAgentManagerAgentFactory = /*#__PURE__*/ createReadContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
  functionName: "agentFactory",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"bondingCurve"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const readAgentManagerBondingCurve = /*#__PURE__*/ createReadContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
  functionName: "bondingCurve",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"calculateEthCost"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const readAgentManagerCalculateEthCost =
  /*#__PURE__*/ createReadContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "calculateEthCost",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"getBondingCurve"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const readAgentManagerGetBondingCurve = /*#__PURE__*/ createReadContract(
  {
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "getBondingCurve",
  }
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"getCreateFee"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const readAgentManagerGetCreateFee = /*#__PURE__*/ createReadContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
  functionName: "getCreateFee",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentManagerAbi}__
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const writeAgentManager = /*#__PURE__*/ createWriteContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"buy"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const writeAgentManagerBuy = /*#__PURE__*/ createWriteContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
  functionName: "buy",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"createPool"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const writeAgentManagerCreatePool = /*#__PURE__*/ createWriteContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
  functionName: "createPool",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"openTradingOnUniswap"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const writeAgentManagerOpenTradingOnUniswap =
  /*#__PURE__*/ createWriteContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "openTradingOnUniswap",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"sell"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const writeAgentManagerSell = /*#__PURE__*/ createWriteContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
  functionName: "sell",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setAgentFactory"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const writeAgentManagerSetAgentFactory =
  /*#__PURE__*/ createWriteContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setAgentFactory",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setFeeAmount"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const writeAgentManagerSetFeeAmount = /*#__PURE__*/ createWriteContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
  functionName: "setFeeAmount",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setFeeRecipient"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const writeAgentManagerSetFeeRecipient =
  /*#__PURE__*/ createWriteContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setFeeRecipient",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setInitialVirtualReserves"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const writeAgentManagerSetInitialVirtualReserves =
  /*#__PURE__*/ createWriteContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setInitialVirtualReserves",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setMcapLimit"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const writeAgentManagerSetMcapLimit = /*#__PURE__*/ createWriteContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
  functionName: "setMcapLimit",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setOwner"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const writeAgentManagerSetOwner = /*#__PURE__*/ createWriteContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
  functionName: "setOwner",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setTotalSupply"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const writeAgentManagerSetTotalSupply =
  /*#__PURE__*/ createWriteContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setTotalSupply",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentManagerAbi}__
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const simulateAgentManager = /*#__PURE__*/ createSimulateContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"buy"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const simulateAgentManagerBuy = /*#__PURE__*/ createSimulateContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
  functionName: "buy",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"createPool"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const simulateAgentManagerCreatePool =
  /*#__PURE__*/ createSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "createPool",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"openTradingOnUniswap"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const simulateAgentManagerOpenTradingOnUniswap =
  /*#__PURE__*/ createSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "openTradingOnUniswap",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"sell"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const simulateAgentManagerSell = /*#__PURE__*/ createSimulateContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
  functionName: "sell",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setAgentFactory"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const simulateAgentManagerSetAgentFactory =
  /*#__PURE__*/ createSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setAgentFactory",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setFeeAmount"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const simulateAgentManagerSetFeeAmount =
  /*#__PURE__*/ createSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setFeeAmount",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setFeeRecipient"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const simulateAgentManagerSetFeeRecipient =
  /*#__PURE__*/ createSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setFeeRecipient",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setInitialVirtualReserves"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const simulateAgentManagerSetInitialVirtualReserves =
  /*#__PURE__*/ createSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setInitialVirtualReserves",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setMcapLimit"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const simulateAgentManagerSetMcapLimit =
  /*#__PURE__*/ createSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setMcapLimit",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setOwner"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const simulateAgentManagerSetOwner =
  /*#__PURE__*/ createSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setOwner",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setTotalSupply"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const simulateAgentManagerSetTotalSupply =
  /*#__PURE__*/ createSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setTotalSupply",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link agentManagerAbi}__
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const watchAgentManagerEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: agentManagerAbi,
  address: agentManagerAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link agentManagerAbi}__ and `eventName` set to `"Complete"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const watchAgentManagerCompleteEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    eventName: "Complete",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link agentManagerAbi}__ and `eventName` set to `"CreatePool"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const watchAgentManagerCreatePoolEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    eventName: "CreatePool",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link agentManagerAbi}__ and `eventName` set to `"OpenTradingOnUniswap"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const watchAgentManagerOpenTradingOnUniswapEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    eventName: "OpenTradingOnUniswap",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link agentManagerAbi}__ and `eventName` set to `"Trade"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const watchAgentManagerTradeEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    eventName: "Trade",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const readErc20 = /*#__PURE__*/ createReadContract({ abi: erc20Abi });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const readErc20Allowance = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: "allowance",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readErc20BalanceOf = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const readErc20Decimals = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: "decimals",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const readErc20Name = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: "name",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const readErc20Symbol = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: "symbol",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const readErc20TotalSupply = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: "totalSupply",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const writeErc20 = /*#__PURE__*/ createWriteContract({ abi: erc20Abi });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const writeErc20Approve = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: "approve",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const writeErc20Transfer = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: "transfer",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const writeErc20TransferFrom = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const simulateErc20 = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const simulateErc20Approve = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: "approve",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const simulateErc20Transfer = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: "transfer",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateErc20TransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const watchErc20Event = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const watchErc20ApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
  eventName: "Approval",
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const watchErc20TransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
  eventName: "Transfer",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20BurnableAbi}__
 */
export const readErc20Burnable = /*#__PURE__*/ createReadContract({
  abi: erc20BurnableAbi,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"allowance"`
 */
export const readErc20BurnableAllowance = /*#__PURE__*/ createReadContract({
  abi: erc20BurnableAbi,
  functionName: "allowance",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readErc20BurnableBalanceOf = /*#__PURE__*/ createReadContract({
  abi: erc20BurnableAbi,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"decimals"`
 */
export const readErc20BurnableDecimals = /*#__PURE__*/ createReadContract({
  abi: erc20BurnableAbi,
  functionName: "decimals",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"name"`
 */
export const readErc20BurnableName = /*#__PURE__*/ createReadContract({
  abi: erc20BurnableAbi,
  functionName: "name",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"symbol"`
 */
export const readErc20BurnableSymbol = /*#__PURE__*/ createReadContract({
  abi: erc20BurnableAbi,
  functionName: "symbol",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readErc20BurnableTotalSupply = /*#__PURE__*/ createReadContract({
  abi: erc20BurnableAbi,
  functionName: "totalSupply",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20BurnableAbi}__
 */
export const writeErc20Burnable = /*#__PURE__*/ createWriteContract({
  abi: erc20BurnableAbi,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"approve"`
 */
export const writeErc20BurnableApprove = /*#__PURE__*/ createWriteContract({
  abi: erc20BurnableAbi,
  functionName: "approve",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"burn"`
 */
export const writeErc20BurnableBurn = /*#__PURE__*/ createWriteContract({
  abi: erc20BurnableAbi,
  functionName: "burn",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"burnFrom"`
 */
export const writeErc20BurnableBurnFrom = /*#__PURE__*/ createWriteContract({
  abi: erc20BurnableAbi,
  functionName: "burnFrom",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"transfer"`
 */
export const writeErc20BurnableTransfer = /*#__PURE__*/ createWriteContract({
  abi: erc20BurnableAbi,
  functionName: "transfer",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeErc20BurnableTransferFrom = /*#__PURE__*/ createWriteContract(
  { abi: erc20BurnableAbi, functionName: "transferFrom" }
);

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20BurnableAbi}__
 */
export const simulateErc20Burnable = /*#__PURE__*/ createSimulateContract({
  abi: erc20BurnableAbi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"approve"`
 */
export const simulateErc20BurnableApprove =
  /*#__PURE__*/ createSimulateContract({
    abi: erc20BurnableAbi,
    functionName: "approve",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"burn"`
 */
export const simulateErc20BurnableBurn = /*#__PURE__*/ createSimulateContract({
  abi: erc20BurnableAbi,
  functionName: "burn",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"burnFrom"`
 */
export const simulateErc20BurnableBurnFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: erc20BurnableAbi,
    functionName: "burnFrom",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"transfer"`
 */
export const simulateErc20BurnableTransfer =
  /*#__PURE__*/ createSimulateContract({
    abi: erc20BurnableAbi,
    functionName: "transfer",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateErc20BurnableTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: erc20BurnableAbi,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20BurnableAbi}__
 */
export const watchErc20BurnableEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20BurnableAbi,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20BurnableAbi}__ and `eventName` set to `"Approval"`
 */
export const watchErc20BurnableApprovalEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc20BurnableAbi,
    eventName: "Approval",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20BurnableAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchErc20BurnableTransferEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc20BurnableAbi,
    eventName: "Transfer",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iAgentManagerAbi}__
 */
export const readIAgentManager = /*#__PURE__*/ createReadContract({
  abi: iAgentManagerAbi,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iAgentManagerAbi}__ and `functionName` set to `"getCreateFee"`
 */
export const readIAgentManagerGetCreateFee = /*#__PURE__*/ createReadContract({
  abi: iAgentManagerAbi,
  functionName: "getCreateFee",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iAgentManagerAbi}__
 */
export const writeIAgentManager = /*#__PURE__*/ createWriteContract({
  abi: iAgentManagerAbi,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iAgentManagerAbi}__ and `functionName` set to `"createPool"`
 */
export const writeIAgentManagerCreatePool = /*#__PURE__*/ createWriteContract({
  abi: iAgentManagerAbi,
  functionName: "createPool",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iAgentManagerAbi}__
 */
export const simulateIAgentManager = /*#__PURE__*/ createSimulateContract({
  abi: iAgentManagerAbi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iAgentManagerAbi}__ and `functionName` set to `"createPool"`
 */
export const simulateIAgentManagerCreatePool =
  /*#__PURE__*/ createSimulateContract({
    abi: iAgentManagerAbi,
    functionName: "createPool",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const readIerc20 = /*#__PURE__*/ createReadContract({ abi: ierc20Abi });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"allowance"`
 */
export const readIerc20Allowance = /*#__PURE__*/ createReadContract({
  abi: ierc20Abi,
  functionName: "allowance",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readIerc20BalanceOf = /*#__PURE__*/ createReadContract({
  abi: ierc20Abi,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const readIerc20TotalSupply = /*#__PURE__*/ createReadContract({
  abi: ierc20Abi,
  functionName: "totalSupply",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const writeIerc20 = /*#__PURE__*/ createWriteContract({
  abi: ierc20Abi,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"approve"`
 */
export const writeIerc20Approve = /*#__PURE__*/ createWriteContract({
  abi: ierc20Abi,
  functionName: "approve",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transfer"`
 */
export const writeIerc20Transfer = /*#__PURE__*/ createWriteContract({
  abi: ierc20Abi,
  functionName: "transfer",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const writeIerc20TransferFrom = /*#__PURE__*/ createWriteContract({
  abi: ierc20Abi,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const simulateIerc20 = /*#__PURE__*/ createSimulateContract({
  abi: ierc20Abi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"approve"`
 */
export const simulateIerc20Approve = /*#__PURE__*/ createSimulateContract({
  abi: ierc20Abi,
  functionName: "approve",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transfer"`
 */
export const simulateIerc20Transfer = /*#__PURE__*/ createSimulateContract({
  abi: ierc20Abi,
  functionName: "transfer",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateIerc20TransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: ierc20Abi,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc20Abi}__
 */
export const watchIerc20Event = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc20Abi,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc20Abi}__ and `eventName` set to `"Approval"`
 */
export const watchIerc20ApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc20Abi,
  eventName: "Approval",
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const watchIerc20TransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc20Abi,
  eventName: "Transfer",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const readIerc20Metadata = /*#__PURE__*/ createReadContract({
  abi: ierc20MetadataAbi,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"allowance"`
 */
export const readIerc20MetadataAllowance = /*#__PURE__*/ createReadContract({
  abi: ierc20MetadataAbi,
  functionName: "allowance",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readIerc20MetadataBalanceOf = /*#__PURE__*/ createReadContract({
  abi: ierc20MetadataAbi,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"decimals"`
 */
export const readIerc20MetadataDecimals = /*#__PURE__*/ createReadContract({
  abi: ierc20MetadataAbi,
  functionName: "decimals",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"name"`
 */
export const readIerc20MetadataName = /*#__PURE__*/ createReadContract({
  abi: ierc20MetadataAbi,
  functionName: "name",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"symbol"`
 */
export const readIerc20MetadataSymbol = /*#__PURE__*/ createReadContract({
  abi: ierc20MetadataAbi,
  functionName: "symbol",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readIerc20MetadataTotalSupply = /*#__PURE__*/ createReadContract({
  abi: ierc20MetadataAbi,
  functionName: "totalSupply",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const writeIerc20Metadata = /*#__PURE__*/ createWriteContract({
  abi: ierc20MetadataAbi,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"approve"`
 */
export const writeIerc20MetadataApprove = /*#__PURE__*/ createWriteContract({
  abi: ierc20MetadataAbi,
  functionName: "approve",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transfer"`
 */
export const writeIerc20MetadataTransfer = /*#__PURE__*/ createWriteContract({
  abi: ierc20MetadataAbi,
  functionName: "transfer",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeIerc20MetadataTransferFrom =
  /*#__PURE__*/ createWriteContract({
    abi: ierc20MetadataAbi,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const simulateIerc20Metadata = /*#__PURE__*/ createSimulateContract({
  abi: ierc20MetadataAbi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"approve"`
 */
export const simulateIerc20MetadataApprove =
  /*#__PURE__*/ createSimulateContract({
    abi: ierc20MetadataAbi,
    functionName: "approve",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transfer"`
 */
export const simulateIerc20MetadataTransfer =
  /*#__PURE__*/ createSimulateContract({
    abi: ierc20MetadataAbi,
    functionName: "transfer",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateIerc20MetadataTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: ierc20MetadataAbi,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const watchIerc20MetadataEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc20MetadataAbi,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `eventName` set to `"Approval"`
 */
export const watchIerc20MetadataApprovalEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ierc20MetadataAbi,
    eventName: "Approval",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchIerc20MetadataTransferEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ierc20MetadataAbi,
    eventName: "Transfer",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iUniswapV2FactoryAbi}__
 */
export const writeIUniswapV2Factory = /*#__PURE__*/ createWriteContract({
  abi: iUniswapV2FactoryAbi,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iUniswapV2FactoryAbi}__ and `functionName` set to `"createPair"`
 */
export const writeIUniswapV2FactoryCreatePair =
  /*#__PURE__*/ createWriteContract({
    abi: iUniswapV2FactoryAbi,
    functionName: "createPair",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iUniswapV2FactoryAbi}__
 */
export const simulateIUniswapV2Factory = /*#__PURE__*/ createSimulateContract({
  abi: iUniswapV2FactoryAbi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iUniswapV2FactoryAbi}__ and `functionName` set to `"createPair"`
 */
export const simulateIUniswapV2FactoryCreatePair =
  /*#__PURE__*/ createSimulateContract({
    abi: iUniswapV2FactoryAbi,
    functionName: "createPair",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__
 */
export const readIUniswapV2Router02 = /*#__PURE__*/ createReadContract({
  abi: iUniswapV2Router02Abi,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__ and `functionName` set to `"WETH"`
 */
export const readIUniswapV2Router02Weth = /*#__PURE__*/ createReadContract({
  abi: iUniswapV2Router02Abi,
  functionName: "WETH",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__ and `functionName` set to `"factory"`
 */
export const readIUniswapV2Router02Factory = /*#__PURE__*/ createReadContract({
  abi: iUniswapV2Router02Abi,
  functionName: "factory",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__
 */
export const writeIUniswapV2Router02 = /*#__PURE__*/ createWriteContract({
  abi: iUniswapV2Router02Abi,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__ and `functionName` set to `"addLiquidityETH"`
 */
export const writeIUniswapV2Router02AddLiquidityEth =
  /*#__PURE__*/ createWriteContract({
    abi: iUniswapV2Router02Abi,
    functionName: "addLiquidityETH",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__ and `functionName` set to `"swapExactTokensForETHSupportingFeeOnTransferTokens"`
 */
export const writeIUniswapV2Router02SwapExactTokensForEthSupportingFeeOnTransferTokens =
  /*#__PURE__*/ createWriteContract({
    abi: iUniswapV2Router02Abi,
    functionName: "swapExactTokensForETHSupportingFeeOnTransferTokens",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__
 */
export const simulateIUniswapV2Router02 = /*#__PURE__*/ createSimulateContract({
  abi: iUniswapV2Router02Abi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__ and `functionName` set to `"addLiquidityETH"`
 */
export const simulateIUniswapV2Router02AddLiquidityEth =
  /*#__PURE__*/ createSimulateContract({
    abi: iUniswapV2Router02Abi,
    functionName: "addLiquidityETH",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__ and `functionName` set to `"swapExactTokensForETHSupportingFeeOnTransferTokens"`
 */
export const simulateIUniswapV2Router02SwapExactTokensForEthSupportingFeeOnTransferTokens =
  /*#__PURE__*/ createSimulateContract({
    abi: iUniswapV2Router02Abi,
    functionName: "swapExactTokensForETHSupportingFeeOnTransferTokens",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lockAbi}__
 */
export const readLock = /*#__PURE__*/ createReadContract({ abi: lockAbi });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lockAbi}__ and `functionName` set to `"owner"`
 */
export const readLockOwner = /*#__PURE__*/ createReadContract({
  abi: lockAbi,
  functionName: "owner",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lockAbi}__ and `functionName` set to `"unlockTime"`
 */
export const readLockUnlockTime = /*#__PURE__*/ createReadContract({
  abi: lockAbi,
  functionName: "unlockTime",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lockAbi}__
 */
export const writeLock = /*#__PURE__*/ createWriteContract({ abi: lockAbi });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lockAbi}__ and `functionName` set to `"withdraw"`
 */
export const writeLockWithdraw = /*#__PURE__*/ createWriteContract({
  abi: lockAbi,
  functionName: "withdraw",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lockAbi}__
 */
export const simulateLock = /*#__PURE__*/ createSimulateContract({
  abi: lockAbi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lockAbi}__ and `functionName` set to `"withdraw"`
 */
export const simulateLockWithdraw = /*#__PURE__*/ createSimulateContract({
  abi: lockAbi,
  functionName: "withdraw",
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lockAbi}__
 */
export const watchLockEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: lockAbi,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lockAbi}__ and `eventName` set to `"Withdrawal"`
 */
export const watchLockWithdrawalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: lockAbi,
  eventName: "Withdrawal",
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentAbi}__
 */
export const useReadAgent = /*#__PURE__*/ createUseReadContract({
  abi: agentAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadAgentAllowance = /*#__PURE__*/ createUseReadContract({
  abi: agentAbi,
  functionName: "allowance",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadAgentBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: agentAbi,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadAgentDecimals = /*#__PURE__*/ createUseReadContract({
  abi: agentAbi,
  functionName: "decimals",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"name"`
 */
export const useReadAgentName = /*#__PURE__*/ createUseReadContract({
  abi: agentAbi,
  functionName: "name",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadAgentSymbol = /*#__PURE__*/ createUseReadContract({
  abi: agentAbi,
  functionName: "symbol",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadAgentTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: agentAbi,
  functionName: "totalSupply",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentAbi}__
 */
export const useWriteAgent = /*#__PURE__*/ createUseWriteContract({
  abi: agentAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteAgentApprove = /*#__PURE__*/ createUseWriteContract({
  abi: agentAbi,
  functionName: "approve",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteAgentBurn = /*#__PURE__*/ createUseWriteContract({
  abi: agentAbi,
  functionName: "burn",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"burnFrom"`
 */
export const useWriteAgentBurnFrom = /*#__PURE__*/ createUseWriteContract({
  abi: agentAbi,
  functionName: "burnFrom",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteAgentTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: agentAbi,
  functionName: "transfer",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteAgentTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: agentAbi,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentAbi}__
 */
export const useSimulateAgent = /*#__PURE__*/ createUseSimulateContract({
  abi: agentAbi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateAgentApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: agentAbi,
  functionName: "approve",
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateAgentBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: agentAbi,
  functionName: "burn",
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"burnFrom"`
 */
export const useSimulateAgentBurnFrom = /*#__PURE__*/ createUseSimulateContract(
  { abi: agentAbi, functionName: "burnFrom" }
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateAgentTransfer = /*#__PURE__*/ createUseSimulateContract(
  { abi: agentAbi, functionName: "transfer" }
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateAgentTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agentAbi,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link agentAbi}__
 */
export const useWatchAgentEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: agentAbi,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link agentAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchAgentApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: agentAbi,
    eventName: "Approval",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link agentAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchAgentTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: agentAbi,
    eventName: "Transfer",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentFactoryAbi}__
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const useReadAgentFactory = /*#__PURE__*/ createUseReadContract({
  abi: agentFactoryAbi,
  address: agentFactoryAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"INITIAL_AMOUNT"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const useReadAgentFactoryInitialAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "INITIAL_AMOUNT",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"agents"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const useReadAgentFactoryAgents = /*#__PURE__*/ createUseReadContract({
  abi: agentFactoryAbi,
  address: agentFactoryAddress,
  functionName: "agents",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"contractAddress"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const useReadAgentFactoryContractAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "contractAddress",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"currentAgentIndex"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const useReadAgentFactoryCurrentAgentIndex =
  /*#__PURE__*/ createUseReadContract({
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "currentAgentIndex",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const useReadAgentFactoryOwner = /*#__PURE__*/ createUseReadContract({
  abi: agentFactoryAbi,
  address: agentFactoryAddress,
  functionName: "owner",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentFactoryAbi}__
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const useWriteAgentFactory = /*#__PURE__*/ createUseWriteContract({
  abi: agentFactoryAbi,
  address: agentFactoryAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"deployERC20Token"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const useWriteAgentFactoryDeployErc20Token =
  /*#__PURE__*/ createUseWriteContract({
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "deployERC20Token",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"setPoolAddress"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const useWriteAgentFactorySetPoolAddress =
  /*#__PURE__*/ createUseWriteContract({
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "setPoolAddress",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const useWriteAgentFactoryTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "transferOwnership",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentFactoryAbi}__
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const useSimulateAgentFactory = /*#__PURE__*/ createUseSimulateContract({
  abi: agentFactoryAbi,
  address: agentFactoryAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"deployERC20Token"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const useSimulateAgentFactoryDeployErc20Token =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "deployERC20Token",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"setPoolAddress"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const useSimulateAgentFactorySetPoolAddress =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "setPoolAddress",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0xdbff222d9faa6e4cce49f2988273e14ef891450f)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x539d38511439c407debe03e2cb0310b589039fba)
 */
export const useSimulateAgentFactoryTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agentFactoryAbi,
    address: agentFactoryAddress,
    functionName: "transferOwnership",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentManagerAbi}__
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useReadAgentManager = /*#__PURE__*/ createUseReadContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"agentFactory"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useReadAgentManagerAgentFactory =
  /*#__PURE__*/ createUseReadContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "agentFactory",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"bondingCurve"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useReadAgentManagerBondingCurve =
  /*#__PURE__*/ createUseReadContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "bondingCurve",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"calculateEthCost"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useReadAgentManagerCalculateEthCost =
  /*#__PURE__*/ createUseReadContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "calculateEthCost",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"getBondingCurve"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useReadAgentManagerGetBondingCurve =
  /*#__PURE__*/ createUseReadContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "getBondingCurve",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"getCreateFee"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useReadAgentManagerGetCreateFee =
  /*#__PURE__*/ createUseReadContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "getCreateFee",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentManagerAbi}__
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWriteAgentManager = /*#__PURE__*/ createUseWriteContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"buy"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWriteAgentManagerBuy = /*#__PURE__*/ createUseWriteContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
  functionName: "buy",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"createPool"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWriteAgentManagerCreatePool =
  /*#__PURE__*/ createUseWriteContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "createPool",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"openTradingOnUniswap"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWriteAgentManagerOpenTradingOnUniswap =
  /*#__PURE__*/ createUseWriteContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "openTradingOnUniswap",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"sell"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWriteAgentManagerSell = /*#__PURE__*/ createUseWriteContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
  functionName: "sell",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setAgentFactory"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWriteAgentManagerSetAgentFactory =
  /*#__PURE__*/ createUseWriteContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setAgentFactory",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setFeeAmount"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWriteAgentManagerSetFeeAmount =
  /*#__PURE__*/ createUseWriteContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setFeeAmount",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setFeeRecipient"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWriteAgentManagerSetFeeRecipient =
  /*#__PURE__*/ createUseWriteContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setFeeRecipient",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setInitialVirtualReserves"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWriteAgentManagerSetInitialVirtualReserves =
  /*#__PURE__*/ createUseWriteContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setInitialVirtualReserves",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setMcapLimit"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWriteAgentManagerSetMcapLimit =
  /*#__PURE__*/ createUseWriteContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setMcapLimit",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setOwner"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWriteAgentManagerSetOwner =
  /*#__PURE__*/ createUseWriteContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setOwner",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setTotalSupply"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWriteAgentManagerSetTotalSupply =
  /*#__PURE__*/ createUseWriteContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setTotalSupply",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentManagerAbi}__
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useSimulateAgentManager = /*#__PURE__*/ createUseSimulateContract({
  abi: agentManagerAbi,
  address: agentManagerAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"buy"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useSimulateAgentManagerBuy =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "buy",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"createPool"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useSimulateAgentManagerCreatePool =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "createPool",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"openTradingOnUniswap"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useSimulateAgentManagerOpenTradingOnUniswap =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "openTradingOnUniswap",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"sell"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useSimulateAgentManagerSell =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "sell",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setAgentFactory"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useSimulateAgentManagerSetAgentFactory =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setAgentFactory",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setFeeAmount"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useSimulateAgentManagerSetFeeAmount =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setFeeAmount",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setFeeRecipient"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useSimulateAgentManagerSetFeeRecipient =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setFeeRecipient",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setInitialVirtualReserves"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useSimulateAgentManagerSetInitialVirtualReserves =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setInitialVirtualReserves",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setMcapLimit"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useSimulateAgentManagerSetMcapLimit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setMcapLimit",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setOwner"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useSimulateAgentManagerSetOwner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setOwner",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link agentManagerAbi}__ and `functionName` set to `"setTotalSupply"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useSimulateAgentManagerSetTotalSupply =
  /*#__PURE__*/ createUseSimulateContract({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    functionName: "setTotalSupply",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link agentManagerAbi}__
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWatchAgentManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: agentManagerAbi,
    address: agentManagerAddress,
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link agentManagerAbi}__ and `eventName` set to `"Complete"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWatchAgentManagerCompleteEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    eventName: "Complete",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link agentManagerAbi}__ and `eventName` set to `"CreatePool"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWatchAgentManagerCreatePoolEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    eventName: "CreatePool",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link agentManagerAbi}__ and `eventName` set to `"OpenTradingOnUniswap"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWatchAgentManagerOpenTradingOnUniswapEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    eventName: "OpenTradingOnUniswap",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link agentManagerAbi}__ and `eventName` set to `"Trade"`
 *
 * - [__View Contract on Monad Testnet Monad Testnet Explorer__](https://testnet.monadexplorer.com/address/0x64188097a75788471bb468353c581ada59bb823a)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xa8cba74726686462039c015161237e7abe3be516)
 */
export const useWatchAgentManagerTradeEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: agentManagerAbi,
    address: agentManagerAddress,
    eventName: "Trade",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useReadErc20 = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadErc20Allowance = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: "allowance",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadErc20BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const useReadErc20Decimals = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: "decimals",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const useReadErc20Name = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: "name",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadErc20Symbol = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: "symbol",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadErc20TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: "totalSupply",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWriteErc20 = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteErc20Approve = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: "approve",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteErc20Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: "transfer",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteErc20TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useSimulateErc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateErc20Approve = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
  functionName: "approve",
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateErc20Transfer = /*#__PURE__*/ createUseSimulateContract(
  { abi: erc20Abi, functionName: "transfer" }
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateErc20TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20Abi,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWatchErc20Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc20Abi,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchErc20ApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
    eventName: "Approval",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchErc20TransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
    eventName: "Transfer",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20BurnableAbi}__
 */
export const useReadErc20Burnable = /*#__PURE__*/ createUseReadContract({
  abi: erc20BurnableAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadErc20BurnableAllowance =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20BurnableAbi,
    functionName: "allowance",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadErc20BurnableBalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20BurnableAbi,
    functionName: "balanceOf",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadErc20BurnableDecimals = /*#__PURE__*/ createUseReadContract(
  { abi: erc20BurnableAbi, functionName: "decimals" }
);

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"name"`
 */
export const useReadErc20BurnableName = /*#__PURE__*/ createUseReadContract({
  abi: erc20BurnableAbi,
  functionName: "name",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadErc20BurnableSymbol = /*#__PURE__*/ createUseReadContract({
  abi: erc20BurnableAbi,
  functionName: "symbol",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadErc20BurnableTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20BurnableAbi,
    functionName: "totalSupply",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20BurnableAbi}__
 */
export const useWriteErc20Burnable = /*#__PURE__*/ createUseWriteContract({
  abi: erc20BurnableAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteErc20BurnableApprove =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20BurnableAbi,
    functionName: "approve",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteErc20BurnableBurn = /*#__PURE__*/ createUseWriteContract({
  abi: erc20BurnableAbi,
  functionName: "burn",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"burnFrom"`
 */
export const useWriteErc20BurnableBurnFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20BurnableAbi,
    functionName: "burnFrom",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteErc20BurnableTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20BurnableAbi,
    functionName: "transfer",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteErc20BurnableTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20BurnableAbi,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20BurnableAbi}__
 */
export const useSimulateErc20Burnable = /*#__PURE__*/ createUseSimulateContract(
  { abi: erc20BurnableAbi }
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateErc20BurnableApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20BurnableAbi,
    functionName: "approve",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateErc20BurnableBurn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20BurnableAbi,
    functionName: "burn",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"burnFrom"`
 */
export const useSimulateErc20BurnableBurnFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20BurnableAbi,
    functionName: "burnFrom",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateErc20BurnableTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20BurnableAbi,
    functionName: "transfer",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20BurnableAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateErc20BurnableTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20BurnableAbi,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20BurnableAbi}__
 */
export const useWatchErc20BurnableEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: erc20BurnableAbi });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20BurnableAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchErc20BurnableApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20BurnableAbi,
    eventName: "Approval",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20BurnableAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchErc20BurnableTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20BurnableAbi,
    eventName: "Transfer",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iAgentManagerAbi}__
 */
export const useReadIAgentManager = /*#__PURE__*/ createUseReadContract({
  abi: iAgentManagerAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iAgentManagerAbi}__ and `functionName` set to `"getCreateFee"`
 */
export const useReadIAgentManagerGetCreateFee =
  /*#__PURE__*/ createUseReadContract({
    abi: iAgentManagerAbi,
    functionName: "getCreateFee",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iAgentManagerAbi}__
 */
export const useWriteIAgentManager = /*#__PURE__*/ createUseWriteContract({
  abi: iAgentManagerAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iAgentManagerAbi}__ and `functionName` set to `"createPool"`
 */
export const useWriteIAgentManagerCreatePool =
  /*#__PURE__*/ createUseWriteContract({
    abi: iAgentManagerAbi,
    functionName: "createPool",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iAgentManagerAbi}__
 */
export const useSimulateIAgentManager = /*#__PURE__*/ createUseSimulateContract(
  { abi: iAgentManagerAbi }
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iAgentManagerAbi}__ and `functionName` set to `"createPool"`
 */
export const useSimulateIAgentManagerCreatePool =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iAgentManagerAbi,
    functionName: "createPool",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const useReadIerc20 = /*#__PURE__*/ createUseReadContract({
  abi: ierc20Abi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadIerc20Allowance = /*#__PURE__*/ createUseReadContract({
  abi: ierc20Abi,
  functionName: "allowance",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadIerc20BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: ierc20Abi,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadIerc20TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: ierc20Abi,
  functionName: "totalSupply",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const useWriteIerc20 = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20Abi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteIerc20Approve = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20Abi,
  functionName: "approve",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteIerc20Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20Abi,
  functionName: "transfer",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteIerc20TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20Abi,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const useSimulateIerc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: ierc20Abi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateIerc20Approve = /*#__PURE__*/ createUseSimulateContract(
  { abi: ierc20Abi, functionName: "approve" }
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateIerc20Transfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20Abi,
    functionName: "transfer",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateIerc20TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20Abi,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20Abi}__
 */
export const useWatchIerc20Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ierc20Abi,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchIerc20ApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc20Abi,
    eventName: "Approval",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchIerc20TransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc20Abi,
    eventName: "Transfer",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const useReadIerc20Metadata = /*#__PURE__*/ createUseReadContract({
  abi: ierc20MetadataAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadIerc20MetadataAllowance =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20MetadataAbi,
    functionName: "allowance",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadIerc20MetadataBalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20MetadataAbi,
    functionName: "balanceOf",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadIerc20MetadataDecimals =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20MetadataAbi,
    functionName: "decimals",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"name"`
 */
export const useReadIerc20MetadataName = /*#__PURE__*/ createUseReadContract({
  abi: ierc20MetadataAbi,
  functionName: "name",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadIerc20MetadataSymbol = /*#__PURE__*/ createUseReadContract({
  abi: ierc20MetadataAbi,
  functionName: "symbol",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadIerc20MetadataTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20MetadataAbi,
    functionName: "totalSupply",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const useWriteIerc20Metadata = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20MetadataAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteIerc20MetadataApprove =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc20MetadataAbi,
    functionName: "approve",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteIerc20MetadataTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc20MetadataAbi,
    functionName: "transfer",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteIerc20MetadataTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc20MetadataAbi,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const useSimulateIerc20Metadata =
  /*#__PURE__*/ createUseSimulateContract({ abi: ierc20MetadataAbi });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateIerc20MetadataApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20MetadataAbi,
    functionName: "approve",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateIerc20MetadataTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20MetadataAbi,
    functionName: "transfer",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateIerc20MetadataTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20MetadataAbi,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const useWatchIerc20MetadataEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: ierc20MetadataAbi });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchIerc20MetadataApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc20MetadataAbi,
    eventName: "Approval",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchIerc20MetadataTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc20MetadataAbi,
    eventName: "Transfer",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iUniswapV2FactoryAbi}__
 */
export const useWriteIUniswapV2Factory = /*#__PURE__*/ createUseWriteContract({
  abi: iUniswapV2FactoryAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iUniswapV2FactoryAbi}__ and `functionName` set to `"createPair"`
 */
export const useWriteIUniswapV2FactoryCreatePair =
  /*#__PURE__*/ createUseWriteContract({
    abi: iUniswapV2FactoryAbi,
    functionName: "createPair",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iUniswapV2FactoryAbi}__
 */
export const useSimulateIUniswapV2Factory =
  /*#__PURE__*/ createUseSimulateContract({ abi: iUniswapV2FactoryAbi });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iUniswapV2FactoryAbi}__ and `functionName` set to `"createPair"`
 */
export const useSimulateIUniswapV2FactoryCreatePair =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iUniswapV2FactoryAbi,
    functionName: "createPair",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__
 */
export const useReadIUniswapV2Router02 = /*#__PURE__*/ createUseReadContract({
  abi: iUniswapV2Router02Abi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__ and `functionName` set to `"WETH"`
 */
export const useReadIUniswapV2Router02Weth =
  /*#__PURE__*/ createUseReadContract({
    abi: iUniswapV2Router02Abi,
    functionName: "WETH",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__ and `functionName` set to `"factory"`
 */
export const useReadIUniswapV2Router02Factory =
  /*#__PURE__*/ createUseReadContract({
    abi: iUniswapV2Router02Abi,
    functionName: "factory",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__
 */
export const useWriteIUniswapV2Router02 = /*#__PURE__*/ createUseWriteContract({
  abi: iUniswapV2Router02Abi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__ and `functionName` set to `"addLiquidityETH"`
 */
export const useWriteIUniswapV2Router02AddLiquidityEth =
  /*#__PURE__*/ createUseWriteContract({
    abi: iUniswapV2Router02Abi,
    functionName: "addLiquidityETH",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__ and `functionName` set to `"swapExactTokensForETHSupportingFeeOnTransferTokens"`
 */
export const useWriteIUniswapV2Router02SwapExactTokensForEthSupportingFeeOnTransferTokens =
  /*#__PURE__*/ createUseWriteContract({
    abi: iUniswapV2Router02Abi,
    functionName: "swapExactTokensForETHSupportingFeeOnTransferTokens",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__
 */
export const useSimulateIUniswapV2Router02 =
  /*#__PURE__*/ createUseSimulateContract({ abi: iUniswapV2Router02Abi });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__ and `functionName` set to `"addLiquidityETH"`
 */
export const useSimulateIUniswapV2Router02AddLiquidityEth =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iUniswapV2Router02Abi,
    functionName: "addLiquidityETH",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iUniswapV2Router02Abi}__ and `functionName` set to `"swapExactTokensForETHSupportingFeeOnTransferTokens"`
 */
export const useSimulateIUniswapV2Router02SwapExactTokensForEthSupportingFeeOnTransferTokens =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iUniswapV2Router02Abi,
    functionName: "swapExactTokensForETHSupportingFeeOnTransferTokens",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lockAbi}__
 */
export const useReadLock = /*#__PURE__*/ createUseReadContract({
  abi: lockAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lockAbi}__ and `functionName` set to `"owner"`
 */
export const useReadLockOwner = /*#__PURE__*/ createUseReadContract({
  abi: lockAbi,
  functionName: "owner",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lockAbi}__ and `functionName` set to `"unlockTime"`
 */
export const useReadLockUnlockTime = /*#__PURE__*/ createUseReadContract({
  abi: lockAbi,
  functionName: "unlockTime",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lockAbi}__
 */
export const useWriteLock = /*#__PURE__*/ createUseWriteContract({
  abi: lockAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lockAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteLockWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: lockAbi,
  functionName: "withdraw",
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lockAbi}__
 */
export const useSimulateLock = /*#__PURE__*/ createUseSimulateContract({
  abi: lockAbi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lockAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateLockWithdraw = /*#__PURE__*/ createUseSimulateContract({
  abi: lockAbi,
  functionName: "withdraw",
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lockAbi}__
 */
export const useWatchLockEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: lockAbi,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lockAbi}__ and `eventName` set to `"Withdrawal"`
 */
export const useWatchLockWithdrawalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lockAbi,
    eventName: "Withdrawal",
  });
