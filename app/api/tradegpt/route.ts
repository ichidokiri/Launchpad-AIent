/**
 * API route for TradeGPT
 * This file handles generating responses using the OpenAI API directly
 */
import OpenAI from "openai"

// Create OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    // Parse the request body to get the messages and agent symbol
    const { messages, agentSymbol } = await req.json()

    // Log the incoming request for debugging
    console.log(
      "TradeGPT API received request with",
      messages.length,
      "messages",
      agentSymbol ? `for agent ${agentSymbol}` : "",
    )

    // Create system message for TradeGPT, with agent context if available
    const systemMessage = {
      role: "system",
      content: agentSymbol
        ? `You are TradeGPT, an AI trading assistant specialized in market analysis and trading strategies, with specific expertise in ${agentSymbol}. 
           Provide concise, data-driven insights about ${agentSymbol} trading strategies, market trends, and risk analysis. 
           Focus on practical advice and clear explanations related to ${agentSymbol}. Use Markdown formatting for better readability.`
        : `You are TradeGPT, an AI trading assistant specialized in market analysis and trading strategies. 
           Provide concise, data-driven insights about trading strategies, market trends, and risk analysis. 
           Focus on practical advice and clear explanations. Use Markdown formatting for better readability.`,
    }

    // Create a non-streaming response using the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Using gpt-4 instead of gpt-4o for better compatibility
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      stream: false, // Disable streaming
    })

    // Extract the assistant's message from the response
    const assistantMessage = response.choices[0].message

    // Return a standard JSON response
    return new Response(
      JSON.stringify({
        role: assistantMessage.role,
        content: assistantMessage.content,
        id: Date.now().toString(),
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("TradeGPT API error:", error)
    return new Response(
      JSON.stringify({
        error: "An error occurred while generating the response",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

