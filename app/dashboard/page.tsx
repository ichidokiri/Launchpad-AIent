"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Home,
  Settings,
  HelpCircle,
  Plus,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  Users,
  Bot,
  AlertTriangle,
  Activity,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/app/context/AuthContext"
import toast from "react-hot-toast"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Type definition here to avoid conflicts
interface Agent {
  id: string
  name: string
  symbol: string
  logo?: string
  price: string | number
  marketCap: number | string
  createdAt: string
  creator?: {
    id: string
    name?: string
    email: string
  }
}

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [isCheckingDb, setIsCheckingDb] = useState(false)
  const { user } = useAuth()

  // Navigation items for the sidebar - show admin items only for admin users
  const navItems = [
    { icon: Home, label: "Overview", href: "/dashboard" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    ...(user?.role === "admin"
      ? [
          { icon: Bot, label: "All AI Agents", href: "/dashboard/all-agents" },
          { icon: Users, label: "All Users", href: "/dashboard/all-users" },
          { icon: AlertTriangle, label: "Reset Database", href: "/dashboard/admin/reset" },
          { icon: Activity, label: "Diagnostics", href: "/dashboard/diagnostics" },
        ]
      : []),
    { icon: HelpCircle, label: "Help", href: "/dashboard/help" },
  ]

  const fetchAgents = useCallback(async () => {
    try {
      setIsLoading(true)
      console.log("Fetching agents for user:", user?.email, "with ID:", user?.id)

      // Try multiple endpoints to find agents
      let response
      let data
      let foundAgents = false

      // First try the dashboard user-agents endpoint
      try {
        response = await fetch(`/api/dashboard/user-agents?t=${Date.now()}`, {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (response.ok) {
          data = await response.json()
          console.log("Response from user-agents:", data)

          if (data.agents && Array.isArray(data.agents) && data.agents.length > 0) {
            setAgents(data.agents)
            foundAgents = true
            console.log("Found agents from user-agents endpoint:", data.agents.length)
          }
        }
      } catch (error) {
        console.error("Error fetching from user-agents:", error)
      }

      // If no agents found, try the ai-agents endpoint
      if (!foundAgents) {
        try {
          response = await fetch(`/api/ai-agents?t=${Date.now()}`, {
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          })

          if (response.ok) {
            data = await response.json()
            console.log("Response from ai-agents:", data)

            if (data.agents && Array.isArray(data.agents)) {
              setAgents(data.agents)
              foundAgents = true
              console.log("Found agents from ai-agents endpoint:", data.agents.length)
            }
          }
        } catch (error) {
          console.error("Error fetching from ai-agents:", error)
        }
      }

      // If still no agents found, try the agents endpoint
      if (!foundAgents) {
        try {
          response = await fetch(`/api/agents?t=${Date.now()}`, {
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          })

          if (response.ok) {
            data = await response.json()
            console.log("Response from agents:", data)

            if (data.agents && Array.isArray(data.agents)) {
              setAgents(data.agents)
              foundAgents = true
              console.log("Found agents from agents endpoint:", data.agents.length)
            }
          }
        } catch (error) {
          console.error("Error fetching from agents:", error)
        }
      }

      if (!foundAgents) {
        console.log("No agents found from any endpoint")
        setAgents([])
      }
    } catch (error) {
      console.error("Error fetching agents:", error)
      toast.error("Failed to load your agents")
      setAgents([])
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, user?.email])

  // Log user data and fetch agents when available
  useEffect(() => {
    if (user) {
      console.log("User data available, fetching agents")
      fetchAgents()
    } else {
      console.log("No user data available yet")
    }
  }, [user, fetchAgents])

  const handleDelete = async (id: string) => {
    try {
      // Ensure the ID is properly formatted
      if (!id) {
        toast.error("Invalid agent ID")
        return
      }

      const response = await fetch(`/api/agents/${id}`, {
        method: "DELETE",
      })

      // Parse the response data
      let data
      try {
        data = await response.json()
      } catch (e) {
        console.error("Error parsing response:", e)
      }

      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Failed to delete agent")
      }

      // Update local state
      setAgents(agents.filter((agent) => agent.id !== id))
      toast.success("AI agent deleted successfully")
    } catch (error) {
      console.error("Error deleting agent:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete the AI agent")
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

  const checkDatabaseConnection = async () => {
    try {
      setIsCheckingDb(true)
      const response = await fetch("/api/debug-db/connection")
      const data = await response.json()

      setDbStatus(data)

      if (data.status === "connected") {
        toast.success("Database connection successful!")
      } else {
        toast.error("Database connection failed")
      }
    } catch (error) {
      console.error("Error checking database:", error)
      toast.error("Failed to check database connection")
    } finally {
      setIsCheckingDb(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] bg-black">
        <aside className="w-64 border-r-2 border-white bg-black">
          <div className="flex h-full flex-col">
            <div className="space-y-4 py-4">
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold text-white">Dashboard</h2>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 hover:text-white border-2 border-white"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </aside>
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] bg-black">
      {/* Sidebar */}
      <aside className="w-64 border-r-2 border-white bg-black">
        <div className="flex h-full flex-col">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold text-white">Dashboard</h2>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 hover:text-white border-2 border-white"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black">
        <div className="container mx-auto max-w-5xl px-6 py-8">
          <Tabs defaultValue="agents">
            <TabsList className="mb-6 bg-[#2F2F2F] border-2 border-white">
              <TabsTrigger value="agents" className="data-[state=active]:bg-black">
                Your AI Agents
              </TabsTrigger>
              {user?.role === "admin" && (
                <TabsTrigger value="debug" className="data-[state=active]:bg-black">
                  Debug Tools
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="agents">
              {/* Header Container with pure black background, padding, bold border */}
              <div className="mb-8 bg-black p-4 rounded-md flex items-center justify-between border-2 border-white">
                <div>
                  <h1 className="text-2xl font-semibold text-white">Your AI Agents</h1>
                  <p className="text-gray-400">Manage and monitor your AI agents</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={fetchAgents}
                    className="bg-[#1f1f1f] border-2 border-white text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                  <Link href="/create">
                    <Button className="bg-[#1f1f1f] border-2 border-white hover:bg-gray-800 text-gray-300 hover:text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Agent
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Agents Grid */}
              <div className="grid gap-6">
                {!agents || agents.length === 0 ? (
                  // Removed the blue gradient overlay elements
                  <div className="relative overflow-hidden rounded-xl border-2 border-white bg-[#1a1a1a] p-8">
                    <div className="relative z-10 flex flex-col items-center justify-center text-center">
                      {/* Icon Container without blue overlay */}
                      <div className="relative mb-6">
                        <div className="relative rounded-full border-2 border-white bg-[#2a2a2a] p-4 shadow-lg">
                          <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="relative">
                        <div className="rounded-lg border-2 border-white bg-[#262626] p-6 shadow-md">
                          <h3 className="mb-2 text-xl font-semibold text-gray-200">No AI Agents Found</h3>
                          <p className="mb-6 text-gray-400">
                            You haven&apos;t created any AI agents yet. Create your first agent to get started!
                          </p>

                          <Link href="/create">
                            <Button className="border-2 border-white bg-[#2F2F2F] text-white hover:bg-gray-800 shadow-lg">
                              <Plus className="mr-2 h-4 w-4" />
                              Create Agent
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="rounded-lg border-2 border-white bg-[#1f1f1f] p-6 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <Link href={`/market/${agent.id}`} className="flex items-center space-x-4">
                          <Image
                            src={agent.logo || "/placeholder.svg?height=40&width=40"}
                            alt={agent.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                            unoptimized={agent.logo?.startsWith("data:")}
                          />
                          <div>
                            <h3 className="font-medium text-white">{agent.name}</h3>
                            <p className="text-sm text-gray-300">{agent.symbol}</p>
                          </div>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-300 hover:bg-gray-700 hover:text-white border-2 border-white"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="border-2 border-white bg-[#1f1f1f]">
                            <DropdownMenuItem
                              onClick={() => handleDelete(agent.id)}
                              className="text-red-500 focus:bg-gray-700 focus:text-red-500"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-300">Price</p>
                          <p className="font-medium text-white">
                            ${typeof agent.price === "number" ? agent.price.toFixed(2) : agent.price || "0.00"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-300">Created</p>
                          <p className="font-medium text-white">
                            {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-300">Market Cap</p>
                          <p className="font-medium text-white">{formatNumber(agent.marketCap, "$")}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm capitalize text-gray-300">active</span>
                        </div>
                        <Link
                          href={`/market/${agent.id}`}
                          className="flex items-center text-sm text-gray-300 hover:text-white"
                        >
                          View Details
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {user?.role === "admin" && (
              <TabsContent value="debug">
                <div className="mb-6">
                  <h1 className="mb-2 text-2xl font-semibold text-white">Debug Tools</h1>
                  <p className="text-gray-300">Troubleshoot database and system issues</p>
                </div>

                <div className="grid gap-6">
                  <Card className="border-2 border-white bg-[#2F2F2F] text-white">
                    <CardHeader>
                      <CardTitle className="text-white">Database Connection</CardTitle>
                      <CardDescription className="text-gray-300">
                        Check if the database is connected properly
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={checkDatabaseConnection}
                        disabled={isCheckingDb}
                        className="bg-gray-700 text-white hover:bg-gray-600 border-2 border-white"
                      >
                        {isCheckingDb ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          <>
                            <Activity className="mr-2 h-4 w-4" />
                            Check Database Connection
                          </>
                        )}
                      </Button>

                      {dbStatus && (
                        <div className="mt-4">
                          <h3 className="mb-2 font-medium text-white">Database Status</h3>
                          <div className="max-h-[300px] overflow-auto rounded-md border-2 border-white bg-[#1f1f1f] p-4 text-gray-300">
                            <pre>{JSON.stringify(dbStatus, null, 2)}</pre>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card className="border-2 border-white bg-[#2F2F2F] text-white">
                      <CardHeader>
                        <CardTitle className="text-white">Diagnostics Page</CardTitle>
                        <CardDescription className="text-gray-300">Advanced system diagnostics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => (window.location.href = "/dashboard/diagnostics")}
                          className="bg-gray-700 text-white hover:bg-gray-600 border-2 border-white"
                        >
                          <Activity className="mr-2 h-4 w-4" />
                          Go to Diagnostics
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-white bg-[#2F2F2F] text-white">
                      <CardHeader>
                        <CardTitle className="text-white">Debug Tools</CardTitle>
                        <CardDescription className="text-gray-300">Additional debugging tools</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => (window.location.href = "/debug")}
                          className="bg-gray-700 text-white hover:bg-gray-600 border-2 border-white"
                        >
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Open Debug Tools
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  )
}

