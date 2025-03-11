"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { CheckCircle2, Copy, ExternalLink } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AgentChart } from "@/components/agent-chart"
import { SwapInterface } from "@/components/swap-interface"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "react-hot-toast"
import type { Agent } from "@/types/agent"

export default function AgentDetailsPage() {
  const params = useParams()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        setIsLoading(true)
        const idOrSymbol = params?.id
        if (!idOrSymbol) {
          throw new Error("No agent ID or symbol provided")
        }

        // Log the request for debugging
        console.log(`Fetching agent details for: ${idOrSymbol}`)

        const response = await fetch(`/api/agents/${idOrSymbol}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Error ${response.status}: Failed to fetch agent details`)
        }

        const data = await response.json()
        console.log("Received agent data:", data)

        setAgent(data.agent)
      } catch (error) {
        console.error("Error fetching agent details:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch agent details"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgentDetails()
  }, [params?.id])

  const copyAddress = () => {
    if (agent?.contractAddress) {
      navigator.clipboard.writeText(agent.contractAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatNumber = (num: number | string | undefined, prefix = "") => {
    if (num === undefined || num === null) return `${prefix}0`

    const numValue = typeof num === "string" ? Number.parseFloat(num) : num

    if (isNaN(numValue)) return `${prefix}0`

    if (numValue >= 1000000) {
      return `${prefix}${(numValue / 1000000).toFixed(2)}M`
    }
    if (numValue >= 1000) {
      return `${prefix}${(numValue / 1000).toFixed(2)}K`
    }
    return `${prefix}${numValue.toFixed(2)}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Agent Not Found</h2>
          <p>The requested agent could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-6">
      <div className="mx-auto max-w-[1400px] py-8">
        {/* Token Details Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src={agent.logo || "/placeholder.svg?height=64&width=64"}
              alt={agent.name}
              width={64}
              height={64}
              className="rounded-full"
              unoptimized={agent.logo?.startsWith("data:")}
            />
            <div>
              <h1 className="text-2xl font-bold">{agent.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{agent.symbol}</span>
                {agent.verified && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Creator:</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-sm hover:text-primary">
                    {agent.creator?.email || "Unknown Creator"}
                  </TooltipTrigger>
                  <TooltipContent>View creator profile</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {agent.contractAddress && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Contract:</span>
                <code className="text-sm">{`${agent.contractAddress.slice(0, 6)}...${agent.contractAddress.slice(-4)}`}</code>
                <button onClick={copyAddress} className="hover:text-primary">
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
                <a
                  href={`https://etherscan.io/address/${agent.contractAddress}`}
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
              <p className="text-muted-foreground">{agent.description || "No description available."}</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${agent.price}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Total Supply</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {agent.totalSupply ? formatNumber(agent.totalSupply) : "N/A"}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(agent.marketCap, "$")}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Holders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Image
                        className="h-10 w-10 rounded-full"
                        src={agent.logo || "/placeholder.svg?height=40&width=40"}
                        alt=""
                        width={40}
                        height={40}
                        unoptimized={agent.logo?.startsWith("data:")}
                      />
                      <div className="text-2xl font-bold">{agent.holders ? formatNumber(agent.holders) : "N/A"}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

