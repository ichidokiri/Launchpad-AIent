"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentChart } from "@/components/agent-chart";
import { SwapInterface } from "@/components/swap-interface";
import { LoadingSpinner } from "@/components/loading-spinner";
import { usePonderQuery } from "@ponder/react";
import { eq } from "@ponder/client";
import { agent as agentTable, type Agent } from "@/ponder/ponder.schema";
import { monadTestnet } from "viem/chains";
import { formatEther } from "viem";
import { calculateMarketCap, calculatePrice } from "@/lib/utils";
export default function AgentDetailsPage() {
  const params = useParams();
  const [copied, setCopied] = useState(false);

  const agentQuery = usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(agentTable as any)
        .where(eq(agentTable.agentAddress as any, params.id)),
  });

  const agent = agentQuery.data?.[0] as Agent | undefined;
  const isLoading = agentQuery.isLoading;
  const error = agentQuery.error;

  const copyAddress = () => {
    if (agent?.agentAddress) {
      navigator.clipboard.writeText(agent.agentAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-500">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Agent Not Found</h2>
          <p>The requested agent could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6">
      <div className="mx-auto max-w-[1400px] py-8">
        {/* Token Details Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src={agent.imageUrl || "/placeholder.svg?height=64&width=64"}
              alt={agent.name}
              width={64}
              height={64}
              className="rounded-full"
              unoptimized={agent.imageUrl?.startsWith("data:")}
            />
            <div>
              <h1 className="text-2xl font-bold">{agent.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{agent.ticker}</span>
                {agent.complete && (
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Creator:</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-sm hover:text-primary">
                    {agent.userAddress || "Unknown Creator"}
                  </TooltipTrigger>
                  <TooltipContent>View creator profile</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {agent.agentAddress && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Contract:</span>
                <code className="text-sm">{`${agent.agentAddress.slice(0, 6)}...${agent.agentAddress.slice(-4)}`}</code>
                <button onClick={copyAddress} className="hover:text-primary">
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <a
                  href={`${monadTestnet.blockExplorers.default.url}/address/${agent.agentAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Chart and Swap Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 mb-8">
          {/* Price Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <AgentChart />
            </CardContent>
          </Card>

          {/* Swap Interface */}
          <SwapInterface />
        </div>

        {/* Additional Details Section */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <p className="text-muted-foreground">
                {agent.description || "No description available."}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {calculatePrice(agent)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Total Supply
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {agent.tokenTotalSupply
                        ? formatEther(agent.tokenTotalSupply)
                        : "N/A"}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Market Cap
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {calculateMarketCap(agent)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Holders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Image
                        className="h-10 w-10 rounded-full"
                        src={
                          agent.imageUrl ||
                          "/placeholder.svg?height=40&width=40"
                        }
                        alt=""
                        width={40}
                        height={40}
                        unoptimized={agent.imageUrl?.startsWith("data:")}
                      />
                      <div className="text-2xl font-bold">{"N/A"}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
