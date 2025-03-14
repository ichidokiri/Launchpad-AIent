import type React from "react"
declare module "ai/react" {
  export interface Message {
    id: string
    role: "user" | "assistant" | "system"
    content: string
  }

  export interface UseChatOptions {
    api?: string
    id?: string
    initialMessages?: Message[]
    headers?: Record<string, string>
    body?: Record<string, unknown>
    onResponse?: (response: Response) => void | Promise<void>
    onFinish?: (message: Message) => void
    onError?: (error: Error) => void
  }

  export interface UseChatHelpers {
    messages: Message[]
    input: string
    setInput: (input: string) => void
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    isLoading: boolean
    append: (message: Pick<Message, "content" | "role">) => Promise<void>
    reload: () => Promise<void>
    stop: () => void
    error: Error | null
  }

  export function useChat(options?: UseChatOptions): UseChatHelpers
}

declare module "ai" {
  export interface Message {
    id: string
    role: "user" | "assistant" | "system"
    content: string
  }
}

