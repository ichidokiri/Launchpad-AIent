"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AgentLivestreamPage() {
  const params = useParams()
  const agentId = params?.id as string

  const [streamUrl, setStreamUrl] = useState("")
  const [inputUrl, setInputUrl] = useState("")
  const [agentSymbol, setAgentSymbol] = useState<string | null>(null)
  const [agentName, setAgentName] = useState<string | null>(null)

  // Fetch agent details
  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const response = await fetch(`/api/agents/${agentId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch agent details")
        }
        const data = await response.json()
        setAgentSymbol(data.agent.symbol)
        setAgentName(data.agent.name)

        // Set a default stream URL based on the agent symbol
        // This is just an example - you would need to map agent symbols to actual stream URLs
        let defaultStreamUrl = "https://www.youtube.com/embed/live_stream?channel=UCSJ4gkVC6NrvII8umztf0Ow"

        if (data.agent.symbol === "BTC" || data.agent.symbol === "BTCUSD") {
          defaultStreamUrl = "https://www.youtube.com/embed/live_stream?channel=UCSJ4gkVC6NrvII8umztf0Ow"
        } else if (data.agent.symbol === "ETH" || data.agent.symbol === "ETHUSD") {
          defaultStreamUrl = "https://www.youtube.com/embed/live_stream?channel=UCJnKNq1ro2l5oxB-bAeaOhQ"
        } else {
          // Default crypto market stream
          defaultStreamUrl = "https://www.youtube.com/embed/live_stream?channel=UCsN8M73DMWa8SPp5o_0IAQQ"
        }

        setStreamUrl(defaultStreamUrl)
      } catch (error) {
        console.error("Error fetching agent details:", error)
      }
    }

    if (agentId) {
      fetchAgentDetails()
    }
  }, [agentId])

  const handleStreamChange = () => {
    if (inputUrl) {
      let formattedUrl = inputUrl

      // Check if it's a Twitch URL
      if (inputUrl.includes("twitch.tv")) {
        const channelName = inputUrl.split("/").pop()
        if (channelName) {
          formattedUrl = `https://player.twitch.tv/?channel=${channelName}&parent=${window.location.hostname}&muted=true`
        }
      }
      // Check if it's a YouTube URL
      else if (inputUrl.includes("youtube.com") || inputUrl.includes("youtu.be")) {
        const videoId = inputUrl.includes("v=") ? inputUrl.split("v=")[1].split("&")[0] : inputUrl.split("/").pop()
        if (videoId) {
          formattedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0`
        }
      }

      setStreamUrl(formattedUrl)
      setInputUrl("")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white">
      <div className="flex items-center mb-6">
        <Link href={`/market/${agentId}`} className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{agentName ? `${agentName} Livestream` : "Livestream"}</h1>
      </div>

      <div className="w-full max-w-5xl mx-auto">
        {streamUrl ? (
          <div
            className="relative w-full bg-[#2F2F2F] rounded-lg overflow-hidden"
            style={{ paddingTop: "56.25%" }} // 16:9 aspect ratio
          >
            <iframe
              src={streamUrl}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              loading="lazy"
            />
          </div>
        ) : (
          <div
            className="w-full bg-[#2F2F2F] rounded-lg flex items-center justify-center"
            style={{ paddingTop: "56.25%" }}
          >
            <div className="absolute text-center">
              <p className="text-gray-400 mb-4">No stream available. Enter a URL below to start watching.</p>
            </div>
          </div>
        )}

        <div className="flex space-x-2 mt-4">
          <Input
            type="text"
            placeholder="Enter Twitch or YouTube URL"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-grow bg-[#2F2F2F] border-gray-700 text-white placeholder:text-gray-400"
          />
          <Button
            onClick={handleStreamChange}
            className="bg-[#2F2F2F] hover:bg-gray-600 text-white"
            disabled={!inputUrl}
          >
            Enter
          </Button>
        </div>
      </div>
    </div>
  )
}

