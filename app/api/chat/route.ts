import { NextResponse } from "next/server"
import OpenAI from "openai"

// Create OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages, model = "gpt-3.5-turbo" } = await req.json()

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
    })

    // Return the response
    return NextResponse.json({
      content: completion.choices[0]?.message?.content || "No response generated",
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

