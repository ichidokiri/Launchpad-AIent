"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

// Contract addresses
const AGENT_FACTORY_ADDRESS = "0x539d38511439c407debe03e2cb0310b589039fba"
const AGENT_MANAGER_ADDRESS = "0xa8cba74726686462039c015161237e7abe3be516"

export function CreateAgentWeb3() {
  const [agentName, setAgentName] = useState("")
  const [agentSymbol, setAgentSymbol] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [createdAgentAddress, setCreatedAgentAddress] = useState<string | null>(null)

  const handleCreateAgent = async () => {
    if (!agentName || !agentSymbol) {
      toast.error("Agent name and symbol are required")
      return
    }

    setIsCreating(true)

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        toast.error("Please install MetaMask to use this feature")
        return
      }

      // In a real implementation, you would:
      // 1. Connect to the AgentFactory contract
      // 2. Call deployErc20Token with the agent name and symbol
      // 3. Wait for the transaction to be mined
      // 4. Get the agent address from the logs

      // For now, we'll simulate a successful creation
      setTimeout(() => {
        const mockAgentAddress = "0x" + Math.random().toString(16).substring(2, 42)
        setCreatedAgentAddress(mockAgentAddress)
        toast.success("Agent created successfully!")
      }, 2000)
    } catch (error) {
      console.error("Error creating agent:", error)
      toast.error("Failed to create agent. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card className="bg-[#1f1f1f] border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Create AI Agent Token</CardTitle>
        <CardDescription className="text-gray-400">Create a new AI agent token on the blockchain</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Agent Name</label>
          <Input
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="e.g., TradingBot AI"
            className="bg-[#2a2a2a] border-gray-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">Agent Symbol</label>
          <Input
            value={agentSymbol}
            onChange={(e) => setAgentSymbol(e.target.value.toUpperCase())}
            placeholder="e.g., TBOT"
            className="bg-[#2a2a2a] border-gray-700 text-white"
          />
        </div>

        <Button
          onClick={handleCreateAgent}
          disabled={isCreating || !agentName || !agentSymbol}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Agent...
            </>
          ) : (
            "Create Agent"
          )}
        </Button>

        {createdAgentAddress && (
          <div className="mt-4 p-4 bg-[#2a2a2a] rounded-md">
            <p className="text-sm text-gray-400 mb-2">Agent Created:</p>
            <p className="text-xs text-white break-all font-mono">{createdAgentAddress}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

