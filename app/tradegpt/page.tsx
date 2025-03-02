"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"

declare global {
  interface Window {
    marked: {
      parse: (markdown: string) => string
    }
  }
}

export default function TradeGPTPage() {
  const { messages, input, setInput, append, isLoading } = useChat({
    api: "/api/tradegpt",
  })
  const markedRef = useRef<boolean>(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!markedRef.current) {
      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js"
      script.async = true
      script.onload = () => {
        markedRef.current = true
      }
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      void append({ content: input, role: "user" })
      setInput("")
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const header = (
      <header className="m-auto flex max-w-96 flex-col gap-5 text-center">
        <h1 className="text-2xl font-semibold leading-none tracking-tight">TradeGPT Assistant</h1>
        <p className="text-muted-foreground text-sm">
          Your AI-powered trading assistant for market insights and analysis.
        </p>
      </header>
  )

  const messageList = (
      <div className="my-4 flex h-fit min-h-full flex-col gap-4">
        {messages.map((message, index) => (
            <div
                key={index}
                data-role={message.role}
                className={cn(
                    "max-w-[80%] rounded-xl px-3 py-2 text-sm",
                    message.role === "assistant" ? "self-start bg-gray-100 text-black" : "self-end bg-blue-500 text-white",
                )}
            >
              {message.role === "assistant" && window.marked ? (
                  <div dangerouslySetInnerHTML={{ __html: window.marked.parse(message.content) }} />
              ) : (
                  message.content
              )}
            </div>
        ))}
      </div>
  )

  return (
      <TooltipProvider>
        <main className="flex min-h-[calc(100vh-3.5rem)] flex-col">
          <div className={cn("ring-none mx-auto flex h-[calc(100vh-3.5rem)] w-full flex-col items-stretch border-none")}>
            <div className="flex-1 content-center overflow-y-auto px-6">{messages.length ? messageList : header}</div>
            <form
                onSubmit={handleSubmit}
                className="border-input bg-background focus-within:ring-ring/10 sticky bottom-0 mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
            >
              <AutoResizeTextarea
                  ref={inputRef}
                  onKeyDown={handleKeyDown}
                  onChange={(v) => setInput(v)}
                  value={input}
                  placeholder="Ask TradeGPT about market insights..."
                  className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
                  disabled={isLoading}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                      variant="ghost"
                      size="sm"
                      className="absolute bottom-1 right-1 size-6 rounded-full"
                      type="submit"
                      disabled={isLoading}
                  >
                    <ArrowUpIcon size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={12}>Submit</TooltipContent>
              </Tooltip>
            </form>
          </div>
        </main>
      </TooltipProvider>
  )
}

