"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { ArrowUpDown, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { LoadingSpinner } from "./loading-spinner"
import type { AgentWithCreator } from "@/types/agent"
import toast from "react-hot-toast"

const truncateAddress = (address?: string) => {
  if (!address) return "N/A"
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function MarketContent() {
  const [agents, setAgents] = useState<AgentWithCreator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<keyof AgentWithCreator | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const fetchAgents = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/agents")

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch agents`)
      }

      const data = await response.json()
      if (!data.agents) {
        throw new Error("No agents data received")
      }

      setAgents(data.agents)
    } catch (error) {
      console.error("Error fetching agents:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch agents")
      toast.error("Failed to load agents")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  const handleSort = useCallback(
    (column: keyof AgentWithCreator) => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
      } else {
        setSortColumn(column)
        setSortDirection("desc")
      }
    },
    [sortColumn, sortDirection],
  )

  const formatNumber = useCallback((num: number | string | undefined, prefix = "") => {
    if (num === undefined || num === null) return `${prefix}0`

    const numValue = typeof num === "string" ? Number.parseFloat(num) : num

    if (isNaN(numValue)) return `${prefix}0`

    if (numValue >= 1000000) {
      return `${prefix}${(numValue / 1000000).toFixed(2)}m`
    }
    if (numValue >= 1000) {
      return `${prefix}${(numValue / 1000).toFixed(2)}k`
    }
    return `${prefix}${numValue.toFixed(2)}`
  }, [])

  const sortedAgents = useMemo(() => {
    if (!sortColumn) return agents
    return [...agents].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }
      return 0
    })
  }, [agents, sortColumn, sortDirection])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-[400px] text-red-500">{error}</div>
  }

  if (agents.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-muted-foreground">
        No AI agents found. Be the first to create one!
      </div>
    )
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
                    <button onClick={() => handleSort("name")} className="inline-flex items-center hover:text-white">
                      AI Agents
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </th>
                  <th className="w-[15%] px-6 py-4 text-left text-sm font-medium text-gray-300">
                    <button onClick={() => handleSort("symbol")} className="inline-flex items-center hover:text-white">
                      Symbol
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </th>
                  <th className="w-[15%] px-6 py-4 text-right text-sm font-medium text-gray-300">
                    <button onClick={() => handleSort("price")} className="inline-flex items-center hover:text-white">
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
                {sortedAgents.map((agent) => (
                  <tr key={agent.id} className="border-b-2 border-gray-700 last:border-0 hover:bg-[#1a1a1a]">
                    <td className="px-6 py-4">
                      <Link href={`/market/${agent.symbol}`} className="flex items-center gap-3">
                        <Image
                          src={agent.logo || `/placeholder.svg?height=32&width=32&text=${agent.name.charAt(0)}`}
                          alt={agent.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                          unoptimized={agent.logo?.startsWith("data:")}
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-white">{agent.name}</span>
                            {agent.verified && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="text-xs opacity-70">{truncateAddress(agent.contractAddress)}</span>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">{agent.symbol}</td>
                    <td className="px-6 py-4 text-right font-medium text-white">
                      ${typeof agent.price === "number" ? agent.price.toFixed(3) : Number(agent.price).toFixed(3)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-white">
                      {formatNumber(agent.marketCap, "$")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

