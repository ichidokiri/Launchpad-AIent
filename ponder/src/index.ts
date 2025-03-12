/**
 * @dev handle events, we may want to do more logic in each event handler such as interacting with other database tables
 */
import { ponder } from "ponder:registry";
import schema from "ponder:schema";

ponder.on("agentManager:CreatePool", async ({ event, context }) => {
  /**
   * @dev handle create pool event (update agent address in db? set user pools?)
   */
  await context.db.insert(schema.eventCreatePool).values({
    txHash: event.transaction.hash,
    userAddress: event.args.user,
    agentAddress: event.args.mint,
    virtualEthReserves: event.args.virtualEthReserves,
    virtualTokenReserves: event.args.virtualTokenReserves,
    timestamp: event.block.timestamp,
    chainId: context.network.chainId,
  });
});

ponder.on("agentManager:Complete", async ({ event, context }) => {
  /**
   * @dev handle complete event (update agent status?)
   */
  await context.db.insert(schema.eventComplete).values({
    txHash: event.transaction.hash,
    userAddress: event.args.user,
    agentAddress: event.args.mint,
    timestamp: event.block.timestamp,
    chainId: context.network.chainId,
  });
});

ponder.on("agentManager:Trade", async ({ event, context }) => {
  /**
   * @dev handle trade event (update pool stats?)
   */
  await context.db.insert(schema.eventTrade).values({
    ethAmount: event.args.ethAmount,
    tokenAmount: event.args.tokenAmount,
    isBuy: event.args.isBuy,
    virtualEthReserves: event.args.virtualEthReserves,
    virtualTokenReserves: event.args.virtualTokenReserves,
    txHash: event.transaction.hash,
    userAddress: event.args.user,
    agentAddress: event.args.mint,
    timestamp: event.block.timestamp,
    chainId: context.network.chainId,
  });
});

ponder.on("agentManager:OpenTradingOnUniswap", async ({ event, context }) => {
  /**
   * @dev handle open trading on uniswap event (update agent status?)
   */
  await context.db.insert(schema.eventOpenTradingOnUniswap).values({
    agentAddress: event.args.token,
    uniswapV2Pair: event.args.uniswapV2Pair,
    ethReserves: event.args.ethReserves,
    tokenReserves: event.args.tokenReserves,
    timestamp: event.block.timestamp,
    txHash: event.transaction.hash,
    chainId: context.network.chainId,
  });
});
