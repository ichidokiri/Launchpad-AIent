/**
 * @dev handle events, we may want to do more logic in each event handler such as interacting with other database tables
 */
import { ponder } from "ponder:registry";
import schema from "ponder:schema";

const FEE_BP = 100n;

ponder.on("agentManager:CreatePool", async ({ event, context }) => {
  /**
   * @dev handle create pool event (update agent address in db? set user pools?)
   */

  await context.db
    .insert(schema.agent)
    .values({
      txHash: event.transaction.hash,
      userAddress: event.args.user,
      agentAddress: event.args.mint,
      virtualEthReserves: event.args.virtualEthReserves,
      virtualTokenReserves: event.args.virtualTokenReserves,
      name: event.args.name,
      ticker: event.args.ticker,
      description: event.args.description,
      imageUrl: event.args.imageUrl,
      socialLinks: event.args.socialLinks,
      timestamp: event.block.timestamp,
      chainId: context.network.chainId,
    })
    .onConflictDoNothing();
});

ponder.on("agentManager:Complete", async ({ event, context }) => {
  await context.db
    .update(schema.agent, {
      agentAddress: event.args.mint,
      chainId: context.network.chainId,
    })
    .set({
      complete: true,
    });
});

ponder.on("agentManager:Trade", async ({ event, context }) => {
  /**
   * @dev handle trade event (update pool stats?)
   */

  const {
    ethAmount: ethCost,
    isBuy,
    mint,
    tokenAmount,
    user,
    virtualEthReserves,
    virtualTokenReserves,
  } = event.args;

  const fee = (ethCost * FEE_BP) / 100n;
  const ethAmount = ethCost - fee;

  const updatePromise = context.db
    .update(schema.agent, {
      agentAddress: mint,
      chainId: context.network.chainId,
    })
    .set(({ realEthReserves, realTokenReserves }) => ({
      realEthReserves: isBuy
        ? realEthReserves + ethAmount
        : realEthReserves - ethAmount,
      realTokenReserves: isBuy
        ? realTokenReserves + tokenAmount
        : realTokenReserves - tokenAmount,
      virtualEthReserves,
      virtualTokenReserves,
    }));

  const insertPromise = context.db.insert(schema.eventTrade).values({
    agentAddress: mint,
    userAddress: user,
    ethAmount,
    tokenAmount,
    isBuy,
    txHash: event.transaction.hash,
    virtualEthReserves,
    virtualTokenReserves,
    timestamp: event.block.timestamp,
    chainId: context.network.chainId,
  });

  await Promise.all([updatePromise, insertPromise]);
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
