/**
 * @dev This file contains the schema for the event tables.
 * @note the column names are automatically converted to snake_case in the database.
 */

import { onchainTable, primaryKey, index } from "ponder";
import { SupportedChainIds } from "./ponder.config";

type SocialLink = {
  x: string;
  youtube: string;
  github: string;
  discord: string;
};

export const agent = onchainTable(
  "agent",
  (t) => ({
    txHash: t.hex().notNull(),
    userAddress: t.hex().notNull(),
    agentAddress: t.hex().notNull(),
    virtualEthReserves: t.bigint().notNull(),
    virtualTokenReserves: t.bigint().notNull(),
    uniswapV2Pair: t.hex(),
    complete: t.boolean().notNull().default(false),
    marketCapLimit: t
      .bigint()
      .notNull()
      .default(10n ** 23n),
    tokenTotalSupply: t
      .bigint()
      .notNull()
      .default(10n ** 27n),
    realTokenReserves: t
      .bigint()
      .notNull()
      .default(10n ** 27n),
    realEthReserves: t.bigint().notNull().default(0n),
    timestamp: t.bigint().notNull(),
    chainId: t.integer().notNull().$type<SupportedChainIds>(),
    name: t.text().notNull(),
    ticker: t.text().notNull(),
    description: t.text().notNull(),
    imageUrl: t.text().notNull(),
    socialLinks: t.jsonb().notNull().$type<SocialLink>(),
  }),
  (t) => ({
    idxAgentAddress: index().on(t.agentAddress),
    idxUserAddress: index().on(t.userAddress),
    pk: primaryKey({ columns: [t.agentAddress, t.chainId] }),
  })
);

export type Agent = typeof agent.$inferSelect;

// event Complete(address indexed user, address indexed  mint, uint256 timestamp);
export const eventComplete = onchainTable(
  "event_complete",
  (t) => ({
    userAddress: t.hex().notNull(),
    agentAddress: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    txHash: t.hex().notNull(),
    chainId: t.integer().notNull().$type<SupportedChainIds>(),
  }),
  (t) => ({
    pk: primaryKey({ columns: [t.userAddress, t.agentAddress] }),
    idxAgentAddress: index().on(t.agentAddress),
    idxUserAddress: index().on(t.userAddress),
  })
);

// event Trade(address indexed mint, uint256 ethAmount, uint256 tokenAmount, bool isBuy, address indexed user, uint256 timestamp, uint256 virtualEthReserves, uint256 virtualTokenReserves);
export const eventTrade = onchainTable(
  "event_trade",
  (t) => ({
    txHash: t.hex().notNull(),
    agentAddress: t.hex().notNull(),
    ethAmount: t.bigint().notNull(),
    tokenAmount: t.bigint().notNull(),
    isBuy: t.boolean().notNull(),
    userAddress: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    virtualEthReserves: t.bigint().notNull(),
    virtualTokenReserves: t.bigint().notNull(),
    chainId: t.integer().notNull().$type<SupportedChainIds>(),
  }),
  (t) => ({
    pk: primaryKey({ columns: [t.txHash] }),
    idxAgentAddress: index().on(t.agentAddress),
    idxUserAddress: index().on(t.userAddress),
  })
);

// event OpenTradingOnUniswap(address indexed token, address indexed uniswapV2Pair, uint256 ethReserves, uint256 tokenReserves, uint256 timestamp);
export const eventOpenTradingOnUniswap = onchainTable(
  "event_open_trading_on_uniswap",
  (t) => ({
    agentAddress: t.hex().notNull(),
    uniswapV2Pair: t.hex().notNull(),
    ethReserves: t.bigint().notNull(),
    tokenReserves: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    txHash: t.hex().notNull(),
    chainId: t.integer().notNull().$type<SupportedChainIds>(),
  }),
  (t) => ({
    pk: primaryKey({ columns: [t.txHash] }),
    idxAgentAddress: index().on(t.agentAddress),
  })
);
