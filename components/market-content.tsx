"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ArrowUpDown, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LoadingSpinner } from "./loading-spinner";
import type { AgentWithCreator } from "@/types/agent";
import { usePonderQuery } from "@ponder/react";
import { useAccount } from "wagmi";
import { eq } from "drizzle-orm";
import { agent, type Agent } from "@/ponder/ponder.schema";
import { Ethereum } from "./icons/ethereum";
import { formatEther } from "viem";
import { calculateMarketCap, calculatePrice } from "@/lib/utils";

const truncateAddress = (address?: string) => {
  if (!address) return "N/A";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function MarketContent() {
  const [sortColumn, setSortColumn] = useState<keyof AgentWithCreator | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { address, chainId } = useAccount();

  const { data, isLoading, isError, error } = usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(agent as any)
        .where(eq(agent.chainId as any, chainId)),
  });

  const agents = data as Agent[];

  const handleSort = useCallback(
    (column: keyof AgentWithCreator) => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(column);
        setSortDirection("desc");
      }
    },
    [sortColumn, sortDirection]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        {error.message}
      </div>
    );
  }

  if (agents?.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-muted-foreground">
        No AI agents found. Be the first to create one!
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-6 bg-black">
      <div className="mx-auto max-w-[1400px]">
        <div className="rounded-lg border-2 border-gray-700 bg-[#121212]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-700">
                  <th className="w-[30%] px-6 py-4 text-left text-sm font-medium text-gray-300">
                    <button
                      onClick={() => handleSort("name")}
                      className="inline-flex items-center hover:text-white"
                    >
                      AI Agents
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </th>
                  <th className="w-[15%] px-6 py-4 text-left text-sm font-medium text-gray-300">
                    <button
                      onClick={() => handleSort("symbol")}
                      className="inline-flex items-center hover:text-white"
                    >
                      Symbol
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </th>
                  <th className="w-[15%] px-6 py-4 text-right text-sm font-medium text-gray-300">
                    <button
                      onClick={() => handleSort("price")}
                      className="inline-flex items-center hover:text-white"
                    >
                      Price
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </th>
                  <th className="w-[20%] px-6 py-4 text-right text-sm font-medium text-gray-300">
                    <button
                      onClick={() => handleSort("marketCap")}
                      className="inline-flex items-center hover:text-white"
                    >
                      Market Cap
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {agents?.map((agent) => (
                  <tr
                    key={agent.agentAddress}
                    className="border-b-2 border-gray-700 last:border-0 hover:bg-[#1a1a1a]"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/market/${agent.agentAddress}`}
                        className="flex items-center gap-3"
                      >
                        <Image
                          src={
                            agent.imageUrl ||
                            `/placeholder.svg?height=32&width=32&text=${agent.name.charAt(0)}`
                          }
                          alt={agent.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                          unoptimized={agent.imageUrl?.startsWith("data:")}
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-white">
                              {agent.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="text-xs opacity-70">
                              {truncateAddress(agent.agentAddress)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {agent.ticker}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-white">
                      {/* price */}
                      <div className="flex items-center gap-1 w-full justify-end">
                        <Ethereum className="w-4 h-4" />
                        {calculatePrice({ ...agent })}
                      </div>
                    </td>
                    {/* market cap */}
                    <td className="px-6 py-4 text-right font-medium text-white">
                      <div className="flex items-center gap-1 w-full justify-end">
                        <Ethereum className="w-4 h-4" />

                        {calculateMarketCap({ ...agent })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
