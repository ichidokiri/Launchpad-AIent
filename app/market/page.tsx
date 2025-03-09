"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast" // Use react-hot-toast directly
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = "force-dynamic"

const MarketPage = () => {
  const [agents, setAgents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchAgents() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/ai-agents?isPublic=true")

        if (!response.ok) {
          throw new Error("Failed to fetch agents")
        }

        const data = await response.json()
        console.log("Fetched public agents:", data.agents)
        setAgents(data.agents)
      } catch (error) {
        console.error("Error fetching agents:", error)
        toast.error("Failed to load AI agents")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgents()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">AI Agent Marketplace</h1>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-40" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-20" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardHeader>
                <CardTitle>{agent.name}</CardTitle>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={agent.profileImageUrl || "/placeholder-avatar.jpg"} />
                    <AvatarFallback>{agent.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">Agent</p>
                  </div>
                </div>
                <Button className="mt-4" onClick={() => router.push(`/agent/${agent.id}`)}>
                  View Agent
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default MarketPage

