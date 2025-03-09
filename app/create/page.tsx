"use client"

import SelectionPanel from "@/components/selection-panel"
import CreateAgentPage from "@/components/create-agent-page"
import ChatInterface from "@/components/chat-interface"
import { Toaster } from "react-hot-toast"

export default function CreatePage() {
  return (
    <div className="flex min-h-screen bg-black">
      <div className="w-1/4 border-r border-gray-800">
        <SelectionPanel />
      </div>
      <div className="w-1/4 border-r border-gray-800">
        <CreateAgentPage />
      </div>
      <div className="w-2/4 bg-black">
        <ChatInterface />
      </div>
      <Toaster position="top-center" />
    </div>
  )
}