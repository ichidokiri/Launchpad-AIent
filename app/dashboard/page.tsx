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

      if (!user?.id) {
        console.error("No user ID available for fetching agents")
        setAgents([])
        setIsLoading(false)
        return
      }

      // Use a direct API call to fetch agents
      const response = await fetch(`/api/ai-agents?creatorId=${encodeURIComponent(user.id)}&t=${Date.now()}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch agents`)
      }

      const data = await response.json()
      console.log("Fetched agents data:", data)

      if (data.agents && Array.isArray(data.agents)) {
        setAgents(data.agents)
      } else {
        console.error("Unexpected response format:", data)
        setAgents([])
      }
    } catch (error) {
      console.error("Error fetching agents:", error)
      toast.error("Failed to load your agents")
      setAgents([])
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  // Add this logging to help debug agent fetching
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
      const response = await fetch(`/api/agents/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to delete agent")
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
          <aside className="w-64 border-r border-gray-700 bg-black">
            <div className="flex h-full flex-col">
              <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                  <h2 className="mb-2 px-4 text-lg font-semibold text-white">Dashboard</h2>
                  <nav className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
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
        <aside className="w-64 border-r border-gray-700 bg-black">
          <div className="flex h-full flex-col">
            <div className="space-y-4 py-4">
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold text-white">Dashboard</h2>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                      <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
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
              <TabsList className="mb-6 bg-[#2F2F2F]">
                <TabsTrigger value="agents" className="data-[state=active]:bg-gray-700">
                  Your AI Agents
                </TabsTrigger>
                {user?.role === "admin" && (
                    <TabsTrigger value="debug" className="data-[state=active]:bg-gray-700">
                      Debug Tools
                    </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="agents">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold text-white">Your AI Agents</h1>
                    <p className="text-gray-400">Manage and monitor your AI agents</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={fetchAgents}
                        className="bg-[#1f1f1f] border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                    <Link href="/create">
                      <Button className="bg-[#1f1f1f] border border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Agent
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Agents Grid */}
                <div className="grid gap-6">
                  {!agents || agents.length === 0 ? (
                      <div className="relative p-8 rounded-xl border border-gray-800 bg-[#1a1a1a] overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div
                              className="absolute inset-0"
                              style={{
                                backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                                backgroundSize: "20px 20px",
                              }}
                          ></div>
                        </div>

                        {/* Content container */}
                        <div className="relative z-10 flex flex-col items-center justify-center text-center">
                          {/* Icon with layered effect */}
                          <div className="relative mb-6">
                            <div className="absolute -inset-1 rounded-full bg-blue-500/20 blur-sm"></div>
                            <div className="absolute -inset-3 rounded-full bg-blue-500/10 blur-md"></div>
                            <div className="relative bg-[#2a2a2a] p-4 rounded-full border border-gray-700 shadow-lg">
                              <svg
                                  className="h-12 w-12 text-blue-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                              >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* Text content with layered cards */}
                          <div className="relative">
                            <div className="absolute -inset-x-8 -inset-y-6 bg-[#232323] rounded-xl -z-10 transform -rotate-1"></div>
                            <div className="absolute -inset-x-8 -inset-y-6 bg-[#1f1f1f] rounded-xl -z-20 transform rotate-1"></div>

                            <div className="bg-[#262626] p-6 rounded-lg border border-gray-700 shadow-md">
                              <h3 className="text-gray-200 text-xl font-semibold mb-2">No AI Agents Found</h3>
                              <p className="text-gray-400 mb-6">
                                You haven't created any AI agents yet. Create your first agent to get started!
                              </p>

                              <Link href="/create">
                                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-none shadow-lg shadow-blue-900/20">
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
                              className="rounded-lg border border-gray-800 bg-[#1f1f1f] p-6 shadow-sm transition-shadow hover:shadow-md"
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
                                      className="text-gray-300 hover:text-white hover:bg-gray-700"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#1f1f1f] border-gray-700">
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
                      <h1 className="text-2xl font-semibold text-white mb-2">Debug Tools</h1>
                      <p className="text-gray-300">Troubleshoot database and system issues</p>
                    </div>

                    <div className="grid gap-6">
                      <Card className="bg-[#2F2F2F] border-gray-700 text-white">
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
                              className="bg-gray-700 hover:bg-gray-600 text-white"
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
                                <h3 className="font-medium mb-2 text-white">Database Status</h3>
                                <div className="bg-[#1f1f1f] p-4 rounded-md overflow-auto max-h-[300px] text-gray-300 border border-gray-700">
                                  <pre>{JSON.stringify(dbStatus, null, 2)}</pre>
                                </div>
                              </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-[#2F2F2F] border-gray-700 text-white">
                          <CardHeader>
                            <CardTitle className="text-white">Diagnostics Page</CardTitle>
                            <CardDescription className="text-gray-300">Advanced system diagnostics</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button
                                onClick={() => (window.location.href = "/dashboard/diagnostics")}
                                className="bg-gray-700 hover:bg-gray-600 text-white"
                            >
                              <Activity className="mr-2 h-4 w-4" />
                              Go to Diagnostics
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="bg-[#2F2F2F] border-gray-700 text-white">
                          <CardHeader>
                            <CardTitle className="text-white">Debug Tools</CardTitle>
                            <CardDescription className="text-gray-300">Additional debugging tools</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button
                                onClick={() => (window.location.href = "/debug")}
                                className="bg-gray-700 hover:bg-gray-600 text-white"
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

