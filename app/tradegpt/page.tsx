"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
// Create a simple chat implementation without external AI packages
import { Volume2, ThumbsUp, ThumbsDown, Copy, RotateCcw, Loader2, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"

// Define types for the chat message
interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

// Define types for the input props
interface ChatInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder: string
  disabled: boolean
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  className?: string
}

// Define types for the feedback
type Feedback = "like" | "dislike" | null

// Chat input component with proper type annotations
const ChatInput = ({ value, onChange, placeholder, disabled, onKeyDown, className }: ChatInputProps) => {
  return (
    <div className={cn("relative", className)}>
      <Textarea
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-[60px] resize-none pr-12 text-base py-3"
        rows={1}
      />
      <Button
        size="icon"
        disabled={disabled || !value.trim()}
        className="absolute right-2 top-2 h-8 w-8"
        onClick={() => {
          const event = new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            ctrlKey: true,
          })
          document.activeElement?.dispatchEvent(event)
        }}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function TradeGPTPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Send request to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Sorry, I couldn't process your request.",
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to get response")

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, there was an error processing your request. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Reload the last message
  const reload = async () => {
    if (messages.length < 2 || isLoading) return

    // Remove the last assistant message
    const lastUserMessageIndex = messages.findIndex(
      (msg, i, arr) =>
        msg.role === "user" && (i === arr.length - 2 || (i < arr.length - 2 && arr[i + 1].role === "assistant")),
    )

    if (lastUserMessageIndex === -1) return

    const messagesToKeep = messages.slice(0, lastUserMessageIndex + 1)
    setMessages(messagesToKeep)
    setIsLoading(true)

    try {
      // Send request to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesToKeep.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.response || "Sorry, I couldn't process your request.",
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to get response")

      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, there was an error processing your request. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Stop generating (placeholder function since we're not using streaming)
  const stop = () => {
    // This would cancel any ongoing requests
    setIsLoading(false)
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && !isLoading) {
      e.preventDefault()
      const form = e.currentTarget.closest("form")
      if (form) {
        form.requestSubmit()
      }
    }
  }

  const speakText = useCallback((text: string, messageId: string) => {
    if (!speechSynthesisRef.current) return

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
  }, [])

  const stopSpeaking = useCallback(() => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
      setIsSpeaking(false)
      setCurrentSpeakingId(null)
    }
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
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
    } catch (error) {
      console.error("Error sending feedback:", error)
      toast.error("Failed to send feedback")
    }
  }

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
                    className="h-auto p-4 justify-start text-left"
                    onClick={() => {
                      setInput(suggestion)
                      setTimeout(() => {
                        const event = new KeyboardEvent("keydown", {
                          key: "Enter",
                          code: "Enter",
                          ctrlKey: true,
                        })
                        document.activeElement?.dispatchEvent(event)
                      }, 100)
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message: ChatMessage, index: number) => (
              <Card
                key={message.id}
                className={cn("overflow-hidden", message.role === "user" ? "bg-muted" : "bg-card")}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "rounded-full p-2 w-8 h-8 flex items-center justify-center",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {message.role === "user" ? "U" : "AI"}
                    </div>
                    <div className="flex-1 space-y-2">
                      <ReactMarkdown className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
                        {message.content}
                      </ReactMarkdown>
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              isSpeaking && currentSpeakingId === message.id
                                ? stopSpeaking()
                                : speakText(message.content, message.id)
                            }
                            className="h-8 w-8"
                          >
                            <Volume2
                              className={cn(
                                "h-4 w-4",
                                isSpeaking && currentSpeakingId === message.id
                                  ? "text-primary"
                                  : "text-muted-foreground",
                              )}
                            />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => copyToClipboard(message.content)}
                            className="h-8 w-8"
                          >
                            <Copy className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleFeedback(message.id, "like")}
                            className={cn("h-8 w-8", feedback[message.id] === "like" && "text-green-500")}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleFeedback(message.id, "dislike")}
                            className={cn("h-8 w-8", feedback[message.id] === "dislike" && "text-red-500")}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-background p-4 sticky bottom-0">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <ChatInput
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask TradeGPT something..."
              disabled={isLoading}
              className="flex-1"
            />
          </form>
          <div className="flex justify-center gap-2">
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={reload} disabled={isLoading || messages.length === 0}>
                <RotateCcw className="h-3 w-3 mr-2" />
                Regenerate
              </Button>
            )}
            {isLoading && (
              <Button variant="outline" size="sm" onClick={stop}>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Stop generating
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

