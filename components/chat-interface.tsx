"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Volume2, ThumbsUp, ThumbsDown, Copy, RotateCcw, MoreHorizontal } from "lucide-react"
import toast from "react-hot-toast"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  feedback?: "liked" | "disliked"
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "I'm setting up your AI agent squad based on your request.\nWhat kind of AI agent would you like to create?\nI'll help you define its functions and characteristics to bring your vision to life!",
      role: "assistant",
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'll help you create an AI agent for that purpose. Could you provide more details about what you're looking to build?",
        role: "assistant",
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  // Function to speak the message text
  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(utterance)
      toast.success("Speaking message")
    } else {
      toast.error("Text-to-speech not supported in your browser")
    }
  }

  // Function to copy message to clipboard
  const copyMessage = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy"))
  }

  // Function to handle feedback (like/dislike)
  const handleFeedback = (messageId: string, feedback: "liked" | "disliked") => {
    setMessages((prev) => prev.map((message) => (message.id === messageId ? { ...message, feedback } : message)))
    toast.success(feedback === "liked" ? "Marked as helpful" : "Marked as not helpful")
  }

  // Function to regenerate AI response
  const regenerateResponse = (messageId: string) => {
    setIsRegenerating(true)

    // Find the message to regenerate
    const messageToRegenerate = messages.find((m) => m.id === messageId)
    if (!messageToRegenerate) return

    // Remove the current AI message
    setMessages((prev) => prev.filter((m) => m.id !== messageId))

    // Simulate regenerating a response
    setTimeout(() => {
      const newResponses = [
        "I'd be happy to help you create that AI agent. What specific capabilities are you looking for?",
        "That's an interesting AI agent concept. Let's refine it further. What problem are you trying to solve?",
        "I can definitely help with that type of AI agent. Could you tell me more about your use case?",
      ]
      const randomResponse = newResponses[Math.floor(Math.random() * newResponses.length)]

      const regeneratedMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        role: "assistant",
      }

      setMessages((prev) => [...prev, regeneratedMessage])
      setIsRegenerating(false)
      toast.success("Response regenerated")
    }, 1500)
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">AI Agent Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[80%]">
                {message.role === "assistant" && (
                  <div className="flex items-center mb-1">
                    <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center mr-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-400">AI Assistant</span>
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-2 ${message.role === "user" ? "bg-blue-600 text-white" : "bg-card text-card-foreground"}`}
                >
                  {message.content.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < message.content.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
                {message.role === "assistant" && (
                  <div className="flex mt-1 space-x-2">
                    <button
                      onClick={() => speakMessage(message.content)}
                      className="text-muted-foreground hover:text-foreground"
                      title="Text to speech"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, "liked")}
                      className={`${message.feedback === "liked" ? "text-green-500" : "text-muted-foreground hover:text-foreground"}`}
                      title="Like"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, "disliked")}
                      className={`${message.feedback === "disliked" ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`}
                      title="Dislike"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => copyMessage(message.content)}
                      className="text-muted-foreground hover:text-foreground"
                      title="Copy"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => regenerateResponse(message.id)}
                      className={`text-muted-foreground hover:text-foreground ${isRegenerating ? "animate-spin text-blue-500" : ""}`}
                      disabled={isRegenerating}
                      title="Regenerate"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button className="text-muted-foreground hover:text-foreground" title="More options">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message your AI agent assistant..."
            className="flex-1 bg-card border border-border rounded-md p-2 text-sm"
          />
          <button type="submit" className="bg-accent text-white p-2 rounded-md hover:bg-accent/90">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

