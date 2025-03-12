"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { Loader2 } from "lucide-react"

// Contract addresses
const AGENT_FACTORY_ADDRESS = "0x539d38511439c407debe03e2cb0310b589039fba"
const AGENT_MANAGER_ADDRESS = "0xa8cba74726686462039c015161237e7abe3be516"

export function Web3Login() {
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    setIsConnecting(true)

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        toast.error("Please install MetaMask to use this feature")
        return
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      if (accounts && accounts.length > 0) {
        const address = accounts[0]

        // Here you would typically verify the wallet on your backend
        // For now, we'll just simulate a successful login

        toast.success("Wallet connected successfully!")

        // Store the wallet address in localStorage or a cookie
        localStorage.setItem("walletAddress", address)

        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast.error("Failed to connect wallet. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Button
      variant="outline"
      className="bg-[#2a2a2a] border-gray-700 text-white hover:bg-gray-700"
      onClick={connectWallet}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  )
}

