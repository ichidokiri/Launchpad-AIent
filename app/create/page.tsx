"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import SelectionPanel from "@/components/selection-panel"
import CreateAgentPage from "@/components/create-agent-page"
import ChatInterface from "@/components/chat-interface"
import { Toaster } from "react-hot-toast"

export default function CreatePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    price: 0,
    tokenAmount: 0,
    description: "",
    avatar: null,
  })

  // Function to collect data from child components
  const updateFormData = (data: {
    name?: string
    symbol?: string
    price?: number
    tokenAmount?: number
    description?: string
    avatar?: string | null
  }) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Create AI Agent</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Agent Details Section */}
        <div className="bg-[#1f1f1f] rounded-lg shadow-md p-4 border border-gray-700">
          <h2 className="text-xl font-semibold mb-3 text-white">Agent Details</h2>
          {/* Agent details content */}
          <SelectionPanel />
        </div>

        {/* AI Configuration Section */}
        <div className="bg-[#1f1f1f] rounded-lg shadow-md p-4 border border-gray-700">
          <h2 className="text-xl font-semibold mb-3 text-white">AI Configuration</h2>
          {/* AI configuration content */}
          <CreateAgentPage />
        </div>

        {/* Preview Section */}
        <div className="bg-[#1f1f1f] rounded-lg shadow-md p-4 border border-gray-700">
          <h2 className="text-xl font-semibold mb-3 text-white">Preview</h2>
          {/* Preview content */}
          <ChatInterface />
        </div>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1F1F1F",
            color: "#FFFFFF",
            border: "1px solid #444",
          },
        }}
      />
    </div>
  )
}

