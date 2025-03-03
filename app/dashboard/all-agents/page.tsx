"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/context/AuthContext"

interface AIAgent {
  id: string
  name: string
  symbol: string
  logo: string
  price: number
  holders: number
  marketCap: number
  status: "active" | "pending" | "paused"
  ownerId: string
}

const mockAgents: AIAgent[] = [
  {
    id: "1",
    name: "Trading Assistant Pro",
    symbol: "$TAP",
    logo: "/placeholder.svg?height=40&width=40",
    price: 0.15,
    holders: 266647,
    marketCap: 40210000,
    status: "active",
    ownerId: "user123",
  },
  {
    id: "2",
    name: "Market Analysis Bot",
    symbol: "$MAB",
    logo: "/placeholder.svg?height=40&width=40",
    price: 0.08,
    holders: 152200,
    marketCap: 17760000,
    status: "active",
    ownerId: "user123",
  },
  {
    id: "3",
    name: "Portfolio Manager AI",
    symbol: "$PMA",
    logo: "/placeholder.svg?height=40&width=40",
    price: 0.12,
    holders: 89500,
    marketCap: 25430000,
    status: "pending",
    ownerId: "user456",
  },
]

const formatNumber = (num: number, prefix = "") => {
  if (num >= 1000000) {
    return `${prefix}${(num / 1000000).toFixed(2)}M`
  }
  if (num >= 1000) {
    return `${prefix}${(num / 1000).toFixed(2)}K`
  }
  return `${prefix}${num.toFixed(2)}`
}

export default function AllAgentsPage() {
  const [agents, setAgents] = useState<AIAgent[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== "admin") {
      router.push("/dashboard")
      return
    }

    // In the future, replace this with an actual API call
    setAgents(mockAgents)
  }, [user, router])

  const handleDelete = async (id: string) => {
    try {
      // Simulated API call
      // await fetch(`/api/agents/${id}`, { method: 'DELETE' });

      // Update local state
      setAgents(agents.filter((agent) => agent.id !== id))
      toast({
        title: "Agent Deleted",
        description: "The AI agent has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting agent:", error)
      toast({
        title: "Error",
        description: "Failed to delete the AI agent. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (user?.role !== "admin") {
    return null
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">All AI Agents</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Agent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Holders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Market Cap
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {agents.map((agent) => (
                <tr key={agent.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                            className="h-10 w-10 rounded-full"
                            src={agent.logo || "/placeholder.svg"}
                            alt=""
                            width={40}
                            height={40}
                            unoptimized={agent.logo?.startsWith("data:")}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{agent.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Owner ID: {agent.ownerId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{agent.symbol}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">${agent.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{formatNumber(agent.holders)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{formatNumber(agent.marketCap, "$")}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          agent.status === "active"
                              ? "bg-green-100 text-green-800"
                              : agent.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                      }`}
                  >
                    {agent.status}
                  </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <Button onClick={() => handleDelete(agent.id)} variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  )
}

