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
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { AgentWithCreator } from "@/types/agent"

// Use the imported type instead of defining it here

export default function DashboardPage() {
  const [agents, setAgents] = useState<AgentWithCreator[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
        ]
        : []),
    { icon: HelpCircle, label: "Help", href: "/dashboard/help" },
  ]

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

      // Filter agents to only show those created by the current user
      const userAgents = data.agents.filter((agent: AgentWithCreator) => agent.creator?.email === user?.email)
      setAgents(userAgents)
    } catch (error) {
      console.error("Error fetching agents:", error)
      toast.error("Failed to load your agents")
    } finally {
      setIsLoading(false)
    }
  }, [user?.email])

  useEffect(() => {
    if (user) {
      fetchAgents()
    }
  }, [fetchAgents, user])

  const handleDelete = async (id: number) => {
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

  const formatNumber = (num: number, prefix = "") => {
    if (num >= 1000000) {
      return `${prefix}${(num / 1000000).toFixed(2)}M`
    }
    if (num >= 1000) {
      return `${prefix}${(num / 1000).toFixed(2)}K`
    }
    return `${prefix}${num.toFixed(2)}`
  }

  if (isLoading) {
    return (
        <div className="flex min-h-[calc(100vh-3.5rem)]">
          <aside className="w-64 border-r bg-background">
            <div className="flex h-full flex-col">
              <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                  <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
                  <nav className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
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
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-background">
          <div className="flex h-full flex-col">
            <div className="space-y-4 py-4">
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                      <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
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
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-5xl px-6 py-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Your AI Agents</h1>
                <p className="text-muted-foreground">Manage and monitor your AI agents</p>
              </div>
              <Link href="/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Agent
                </Button>
              </Link>
            </div>

            {/* Agents Grid */}
            <div className="grid gap-6">
              {agents.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    You haven't created any AI agents yet. Click "Create Agent" to get started!
                  </div>
              ) : (
                  agents.map((agent) => (
                      <div
                          key={agent.id}
                          className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <Link href={`/market/${agent.id}`} className="flex items-center space-x-4">
                            <Image
                                src={agent.logo || "/placeholder.svg?height=40&width=40"}
                                alt={agent.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <div>
                              <h3 className="font-medium">{agent.name}</h3>
                              <p className="text-sm text-muted-foreground">{agent.symbol}</p>
                            </div>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDelete(agent.id)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="font-medium">${agent.price}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Created</p>
                            <p className="font-medium">{new Date(agent.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Market Cap</p>
                            <p className="font-medium">{formatNumber(agent.marketCap, "$")}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-sm capitalize text-muted-foreground">active</span>
                          </div>
                          <Link
                              href={`/market/${agent.id}`}
                              className="flex items-center text-sm text-muted-foreground hover:text-primary"
                          >
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                  ))
              )}
            </div>
          </div>
        </main>
      </div>
  )
}

