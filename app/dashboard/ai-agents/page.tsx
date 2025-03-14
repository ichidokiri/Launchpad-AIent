"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import { LoadingSpinner } from "@/components/loading-spinner"
import toast from "react-hot-toast"

export const dynamic = "force-dynamic"

interface AIAgent {
  id: string
  name: string
  description: string
  model: string
  createdAt: string
}

const AIAgentsPage = () => {
  const { user } = useAuth()
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      // Wait a bit to see if user loads
      const timer = setTimeout(() => {
        if (!user) {
          router.push("/login")
        }
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      fetchAgents()
    }
  }, [user, router])

  const fetchAgents = async () => {
    if (user?.id) {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/dashboard/ai-agents?creatorId=${user.id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setAgents(data)
        console.log("Fetched AI agents:", data)
      } catch (error) {
        console.error("Failed to fetch AI agents:", error)
        toast.error("Failed to load AI agents")
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">AI Agents</h1>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">AI Agents</h1>
      {agents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="border rounded-lg p-4 bg-card">
              <h2 className="text-xl font-semibold">{agent.name}</h2>
              <p className="text-muted-foreground mt-2">{agent.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Model: {agent.model}</span>
                <span className="text-sm text-muted-foreground">{new Date(agent.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-10">No AI agents found. Create your first agent!</p>
      )}
    </div>
  )
}

export default AIAgentsPage

