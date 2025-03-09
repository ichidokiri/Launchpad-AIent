"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { PlusCircle, RefreshCw } from "lucide-react"
import { useAuth } from "@/app/context/AuthContext"

// Define the Agent interface to properly type our data
interface Agent {
  id: string
  name: string
  description: string
  category: string
  createdAt: string
  updatedAt: string
  creatorId: string
  // Add other properties as needed
}

export default function AllAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  // Modify the fetchAgents function to properly filter by the current user

  const fetchAgents = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get the current user's ID
      if (!user?.id) {
        console.error("No user ID available for fetching agents")
        setError("User authentication required")
        setAgents([])
        setIsLoading(false)
        return
      }

      console.log("Fetching agents for user ID:", user.id)

      // Add a cache-busting query parameter and filter by creator ID
      const response = await fetch(`/api/dashboard/user-agents?userId=${encodeURIComponent(user.id)}&t=${Date.now()}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Fetched agents response:", data)

      if (data.agents && Array.isArray(data.agents)) {
        setAgents(data.agents)
        if (data.agents.length === 0) {
          console.log("No agents found in response")
        }
      } else {
        console.error("Invalid response format:", data)
        setAgents([])
        setError("Invalid response format from server")
      }
    } catch (error) {
      console.error("Error fetching agents:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch agents")
      setAgents([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [user?.id])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All AI Agents</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAgents} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => router.push("/dashboard/create-agent")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Agent
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <h3 className="text-red-800 font-medium mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : agents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{agent.name}</CardTitle>
                <CardDescription>
                  {agent.category} • {new Date(agent.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4 line-clamp-3">{agent.description}</p>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/edit-agent/${agent.id}`)}>
                    Edit
                  </Button>
                  <Button variant="default" size="sm" onClick={() => router.push(`/agent/${agent.id}`)}>
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium mb-2">No AI Agents Found</h3>
          <p className="text-gray-500 mb-6">You haven't created any AI agents yet.</p>
          <Button onClick={() => router.push("/dashboard/create-agent")}>Create Your First Agent</Button>
        </div>
      )}
    </div>
  )
}

