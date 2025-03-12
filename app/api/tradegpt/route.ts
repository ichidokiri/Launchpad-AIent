/**
 * API route for TradeGPT
 * This file handles generating streaming responses from the OpenAI API
 */
import { createOpenAIStream } from "@/lib/ai-stream"

export const dynamic = "force-dynamic"

/**
 * Handles POST requests to generate TradeGPT responses with streaming
 * @param req - The request object
 * @returns A streaming response with the generated text
 */
export async function POST(req: Request) {
  try {
    // Parse the request body to get the messages
    const { messages } = await req.json()

    // Create system message for TradeGPT
    const systemMessage = {
      role: "system",
      content: `You are TradeGPT, an AI trading assistant specialized in market analysis and trading strategies. 
      Provide concise, data-driven insights about trading strategies, market trends, and risk analysis. 
      Focus on practical advice and clear explanations. Use Markdown formatting for better readability, 
      including numbered lists and line breaks where appropriate. Always relate your responses to current 
      market conditions and trading opportunities.`,
    }

    // Create a streaming response
    return await createOpenAIStream([systemMessage, ...messages])
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

