"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Volume2, ThumbsUp, ThumbsDown, Copy, RotateCcw, Loader2, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism"

// Define types for the feedback
type Feedback = "like" | "dislike" | null

// Define message type
interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

// Custom renderer components for Markdown
const MarkdownComponents = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "")
    return !inline && match ? (
      <SyntaxHighlighter style={nord} language={match[1]} PreTag="div" {...props}>
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
  p({ children }: any) {
    return <p className="mb-2 last:mb-0">{children}</p>
  },
}

export default function TradeGPTPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [agentSymbol, setAgentSymbol] = useState<string | null>(null)

  const [feedback, setFeedback] = useState<Record<string, Feedback>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  // Send message to API
  const sendMessage = async (content: string) => {
    setIsLoading(true)
    setError(null)

    // Create a new user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
    }

    // Add user message to the messages array
    setMessages((prev) => [...prev, userMessage])

    try {
      // Create system message with agent context if available
      const systemMessage = agentSymbol
        ? {
            role: "system",
            content: `You are TradeGPT, an AI trading assistant specialized in market analysis and trading strategies, with specific expertise in ${agentSymbol}. 
      Provide concise, data-driven insights about ${agentSymbol} trading strategies, market trends, and risk analysis. 
      Focus on practical advice and clear explanations related to ${agentSymbol}. Use Markdown formatting for better readability.`,
          }
        : undefined

      // Send the request to the API
      const response = await fetch("/api/tradegpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
          agentSymbol, // Pass the agent symbol to the API
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || "Failed to get response")
      }

      // Parse the response
      const assistantMessage = await response.json()

      // Add assistant message to the messages array
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error("TradeGPT error:", err)
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      toast.error("Error: " + (err instanceof Error ? err.message : "Failed to get response"))
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Store the input value before clearing it
    const messageContent = input.trim()

    // Clear the input immediately
    setInput("")

    // Send the message
    await sendMessage(messageContent)
  }

  // Regenerate the last response
  const regenerateResponse = async () => {
    if (messages.length < 2 || isLoading) return

    // Remove the last assistant message
    const lastUserMessageIndex = messages.findIndex(
      (msg, i) => msg.role === "user" && i < messages.length - 1 && messages[i + 1].role === "assistant",
    )

    if (lastUserMessageIndex === -1) return

    const userMessage = messages[lastUserMessageIndex]
    const newMessages = messages.slice(0, lastUserMessageIndex + 1)

    setMessages(newMessages)

    // Regenerate the response
    setIsLoading(true)
    setError(null)

    try {
      // Send the request to the API
      const response = await fetch("/api/tradegpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || "Failed to get response")
      }

      // Parse the response
      const assistantMessage = await response.json()

      // Add assistant message to the messages array
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error("TradeGPT error:", err)
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      toast.error("Error: " + (err instanceof Error ? err.message : "Failed to get response"))
    } finally {
      setIsLoading(false)
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      speechSynthesisRef.current = window.speechSynthesis
    }
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel()
      }
    }
  }, [])

  useEffect(() => {
    // Get agent symbol from URL if present
    const urlParams = new URLSearchParams(window.location.search)
    const agent = urlParams.get("agent")
    if (agent) {
      setAgentSymbol(agent)
      // If we have an agent, add a welcome message
      if (messages.length === 0) {
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: `Welcome to the ${agent} TradeGPT assistant. How can I help you with ${agent} today?`,
          },
        ])
      }
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault()
      const form = e.currentTarget.closest("form")
      if (form) {
        form.requestSubmit()
      }
    }
  }

  const speakText = useCallback((text: string, messageId: string) => {
    if (!speechSynthesisRef.current) return

    try {
      // Cancel any ongoing speech
      speechSynthesisRef.current.cancel()

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Set the voice (optional)
      const voices = speechSynthesisRef.current.getVoices()
      const preferredVoice = voices.find((voice) => voice.name.includes("Female") || voice.name.includes("Google"))
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      // Add event listeners
      utterance.onstart = () => {
        setIsSpeaking(true)
        setCurrentSpeakingId(messageId)
      }
      utterance.onend = () => {
        setIsSpeaking(false)
        setCurrentSpeakingId(null)
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
        setCurrentSpeakingId(null)
        toast.error("Error speaking text")
      }

      // Speak the text
      speechSynthesisRef.current.speak(utterance)
    } catch (err) {
      console.error("Error with speech synthesis:", err)
      toast.error("Could not speak the text")
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
      setIsSpeaking(false)
      setCurrentSpeakingId(null)
    }
  }, [])

  const copyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard")
    } catch (err) {
      console.error("Error copying to clipboard:", err)
      toast.error("Failed to copy to clipboard")
    }
  }

  const handleFeedback = async (messageId: string, feedbackType: "like" | "dislike") => {
    // Toggle feedback if already selected
    if (feedback[messageId] === feedbackType) {
      setFeedback((prev) => ({ ...prev, [messageId]: null }))
      return
    }

    setFeedback((prev) => ({ ...prev, [messageId]: feedbackType }))

    try {
      // Send feedback to API
      await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          feedback: feedbackType,
        }),
      })
    } catch (error: any) {
      console.error("Error sending feedback:", error)
      toast.error("Failed to send feedback")
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [input])

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4 pb-20">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
              <h1 className="text-3xl font-bold mb-2">TradeGPT</h1>
              <p className="text-muted-foreground text-center max-w-md mb-8">
                Your AI assistant for trading, market analysis, and financial insights.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {[
                  "Explain the current market trends for tech stocks",
                  "What are the key indicators for a bullish market?",
                  "Analyze the potential impact of recent Fed decisions",
                  "Suggest a diversified portfolio strategy for a beginner",
                ].map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 justify-start text-left whitespace-normal break-words min-h-[80px] bg-[#1f1f1f] border-gray-700 hover:bg-gray-800 text-gray-200"
                    onClick={() => {
                      // Send the suggestion directly
                      sendMessage(suggestion)
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message: ChatMessage) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`relative max-w-lg rounded-2xl px-4 py-3 ${
                    message.role === "user" ? "bg-black text-white" : "bg-zinc-100 text-black"
                  }`}
                >
                  <div className="text-sm">
                    <ReactMarkdown components={MarkdownComponents}>{message.content}</ReactMarkdown>
                  </div>

                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          isSpeaking && currentSpeakingId === message.id
                            ? stopSpeaking()
                            : speakText(message.content, message.id)
                        }
                        className={cn(
                          "h-8 w-8 rounded-full",
                          isSpeaking && currentSpeakingId === message.id
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-200 dark:hover:bg-gray-700",
                        )}
                      >
                        <Volume2
                          className={cn(
                            "h-4 w-4",
                            isSpeaking && currentSpeakingId === message.id
                              ? "text-white"
                              : "text-gray-600 dark:text-gray-300",
                          )}
                        />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard(message.content)}
                        className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-blue-600 active:text-white"
                      >
                        <Copy className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleFeedback(message.id, "like")}
                        className={cn(
                          "h-8 w-8 rounded-full",
                          feedback[message.id] === "like"
                            ? "bg-green-600 text-white"
                            : "hover:bg-gray-200 dark:hover:bg-gray-700",
                        )}
                      >
                        <ThumbsUp
                          className={cn(
                            "h-4 w-4",
                            feedback[message.id] === "like" ? "text-white" : "text-gray-600 dark:text-gray-300",
                          )}
                        />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleFeedback(message.id, "dislike")}
                        className={cn(
                          "h-8 w-8 rounded-full",
                          feedback[message.id] === "dislike"
                            ? "bg-red-600 text-white"
                            : "hover:bg-gray-200 dark:hover:bg-gray-700",
                        )}
                      >
                        <ThumbsDown
                          className={cn(
                            "h-4 w-4",
                            feedback[message.id] === "dislike" ? "text-white" : "text-gray-600 dark:text-gray-300",
                          )}
                        />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {error && (
            <Card className="overflow-hidden bg-red-900/20 border-red-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-red-400">
                      Error: {error.message || "Failed to get response from AI"}. Please try again.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="relative max-w-lg rounded-2xl px-4 py-3 bg-zinc-100 text-black">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">TradeGPT is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-background p-4 sticky bottom-0">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask TradeGPT something..."
              disabled={isLoading}
              className="w-full resize-none rounded-lg border border-zinc-200 p-4 pr-12 focus:border-zinc-400 focus:outline-none focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              style={{
                minHeight: "60px",
                maxHeight: "200px",
              }}
            />
            <button
              type="submit"
              className="absolute bottom-3 right-3 rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
              disabled={isLoading || input.trim().length === 0}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>

          <div className="flex justify-center gap-2 mt-2">
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={regenerateResponse}
                disabled={isLoading || messages.length === 0}
              >
                <RotateCcw className="h-3 w-3 mr-2" />
                Regenerate
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

