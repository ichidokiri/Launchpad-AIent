/**
 * API route for TradeGPT
 * This file handles generating responses from the OpenAI API
 */
import { StreamingTextResponse } from "ai"
import OpenAI from "openai"

// Create OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const dynamic = "force-dynamic"

// Define types for our stream events
interface StreamEvent {
  type: "chunk" | "end"
  chunk?: OpenAI.Chat.Completions.ChatCompletionChunk
}

/**
 * Handles POST requests to generate TradeGPT responses
 * @param req - The request object
 * @returns A streaming response with the generated text
 */
export async function POST(req: Request) {
  try {
    // Parse the request body to get the messages
    const { messages } = await req.json()

    // Validate the API key
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "OpenAI API key not configured",
        }),
        { status: 500 },
      )
    }

    // Create a chat completion with streaming
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Updated to gpt-4o for better performance
      stream: true,
      messages: [
        {
          role: "system",
          content: `You are TradeGPT, an AI trading assistant specialized in market analysis and trading strategies. 
          Provide concise, data-driven insights about trading strategies, market trends, and risk analysis. 
          Focus on practical advice and clear explanations. Use Markdown formatting for better readability, 
          including numbered lists and line breaks where appropriate. Always relate your responses to current 
          market conditions and trading opportunities.`,
        },
        ...messages,
      ],
    })

    // Convert the response to a ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        // Callback for each chunk of data
        const onParse = (event: StreamEvent) => {
          if (event.type === "chunk") {
            // Get the delta text
            const text = event.chunk?.choices?.[0]?.delta?.content || ""
            // Push the text to the stream
            controller.enqueue(new TextEncoder().encode(text))
          }
          if (event.type === "end") {
            controller.close()
          }
        }

        // Process the stream
        for await (const chunk of response) {
          onParse({ type: "chunk", chunk })
        }
        onParse({ type: "end" })
      },
    })

    // Return the streaming response
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("TradeGPT API error:", error)
    return new Response(
      JSON.stringify({
        error: "An error occurred while generating the response",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 },
    )
  }
}

