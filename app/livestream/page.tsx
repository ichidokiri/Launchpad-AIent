"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LivestreamPage() {
  const [streamUrl, setStreamUrl] = useState(
    "https://www.youtube.com/embed/live_stream?channel=UCSJ4gkVC6NrvII8umztf0Ow",
  )
  const [inputUrl, setInputUrl] = useState("")
  const [agentSymbol, setAgentSymbol] = useState<string | null>(null)

  useEffect(() => {
    // Get agent symbol from URL if present
    const urlParams = new URLSearchParams(window.location.search)
    const agent = urlParams.get("agent")
    if (agent) {
      setAgentSymbol(agent)

      // Set a default stream URL based on the agent symbol
      // This is just an example - you would need to map agent symbols to actual stream URLs
      if (agent === "BTC" || agent === "BTCUSD") {
        setStreamUrl("https://www.youtube.com/embed/live_stream?channel=UCSJ4gkVC6NrvII8umztf0Ow")
      } else if (agent === "ETH" || agent === "ETHUSD") {
        setStreamUrl("https://www.youtube.com/embed/live_stream?channel=UCJnKNq1ro2l5oxB-bAeaOhQ")
      }
      // Add more mappings as needed
    }
  }, [])

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
      <h1 className="text-3xl font-bold mb-6">{agentSymbol ? `${agentSymbol} Livestream` : "Livestream"}</h1>
      <div className="w-full max-w-5xl mx-auto">
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
        <div className="flex space-x-2 mt-4">
          <Input
            type="text"
            placeholder="Enter Twitch or YouTube URL"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-grow bg-[#2F2F2F] border-gray-700 text-white placeholder:text-gray-400"
          />
          <Button onClick={handleStreamChange} className="bg-[#2F2F2F] hover:bg-gray-600 text-white">
            Enter
          </Button>
        </div>
      </div>
    </div>
  )
}

