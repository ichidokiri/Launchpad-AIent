"use client"

import { useState, useMemo, useCallback } from "react"
import { ArrowUpDown, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Agent {
  id: string
  name: string
  symbol: string
  logo: string
  contractAddress: string
  price: number
  totalSupply: number
  marketCap: number
  holders: number
  verified: boolean
}

const agents: Agent[] = [
  {
    id: "1",
    name: "NightOwl",
    symbol: "$NIGHT",
    logo: "/placeholder.svg?height=48&width=48",
    contractAddress: "0x1C4C7651982C6d2e9b84F5552811Ef49c7C7D7b3",
    price: 0.15,
    totalSupply: 270266666,
    marketCap: 40210000,
    holders: 266647,
    verified: true,
  },
  {
    id: "2",
    name: "StellarMind",
    symbol: "$STEL",
    logo: "/placeholder.svg?height=48&width=48",
    contractAddress: "0x55cD4832d96b34225c83C3B9d5e5c2D0Ebb1f2e4",
    price: 0.08,
    totalSupply: 223875000,
    marketCap: 17760000,
    holders: 292200,
    verified: true,
  },
  {
    id: "3",
    name: "QuantumLogic",
    symbol: "$QNTM",
    logo: "/placeholder.svg?height=48&width=48",
    contractAddress: "0x8901DaECba7E3b7Ac2190cE3f90778583B8984a1",
    price: 0.12,
    totalSupply: 300000000,
    marketCap: 36000000,
    holders: 180500,
    verified: true,
  },
]

const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function MarketPage() {
  const [sortColumn, setSortColumn] = useState<keyof Agent | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = useCallback(
    (column: keyof Agent) => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
      } else {
        setSortColumn(column)
        setSortDirection("desc")
      }
    },
    [sortColumn, sortDirection],
  )

  const formatNumber = useCallback((num: number, prefix = "") => {
    if (num >= 1000000) {
      return `${prefix}${(num / 1000000).toFixed(2)}m`
    }
    if (num >= 1000) {
      return `${prefix}${(num / 1000).toFixed(2)}k`
    }
    return `${prefix}${num.toFixed(2)}`
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
  }, [sortColumn, sortDirection])

  return (
    <div className="w-full px-6 py-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="w-[30%] px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    <button onClick={() => handleSort("name")} className="inline-flex items-center hover:text-primary">
                      AI Agents
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </th>
                  <th className="w-[15%] px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    <button
                      onClick={() => handleSort("symbol")}
                      className="inline-flex items-center hover:text-primary"
                    >
                      Symbol
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </th>
                  <th className="w-[15%] px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                    <button onClick={() => handleSort("price")} className="inline-flex items-center hover:text-primary">
                      Price
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </th>
                  <th className="w-[20%] px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                    <button
                      onClick={() => handleSort("totalSupply")}
                      className="inline-flex items-center hover:text-primary"
                    >
                      Total Supply
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </th>
                  <th className="w-[20%] px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                    <button
                      onClick={() => handleSort("marketCap")}
                      className="inline-flex items-center hover:text-primary"
                    >
                      Market Cap
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedAgents.map((agent) => (
                  <tr key={agent.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <Link href={`/market/${agent.id}`} className="flex items-center gap-3">
                        <Image
                          src={agent.logo || "/placeholder.svg"}
                          alt={agent.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{agent.name}</span>
                            {agent.verified && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="text-xs opacity-50">{truncateAddress(agent.contractAddress)}</span>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-medium">{agent.symbol}</td>
                    <td className="px-6 py-4 text-right font-medium">${agent.price.toFixed(3)}</td>
                    <td className="px-6 py-4 text-right font-medium">{agent.totalSupply.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatNumber(agent.marketCap, "$")}</td>
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

