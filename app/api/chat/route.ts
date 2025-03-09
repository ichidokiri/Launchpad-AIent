export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OpenAI API key")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required and must be an array" }, { status: 400 })
    }

    // Format messages for OpenAI
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Add system message
    formattedMessages.unshift({
      role: "system",
      content:
        "You are TradeGPT, an AI assistant specialized in trading, market analysis, and financial insights. Provide accurate, helpful, and concise information about financial markets, trading strategies, and investment advice. Always clarify that you're providing information, not financial advice.",
    })

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000,
    })

    // Extract the response
    const assistantResponse = response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."

    return NextResponse.json({ response: assistantResponse })
  } catch (error) {
    console.error("Error in chat API:", error)
    // Provide more specific error messages based on the error type
    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API Error:", error.status, error.message)
      return NextResponse.json({ error: "AI service error", message: error.message }, { status: error.status || 500 })
    }
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}

