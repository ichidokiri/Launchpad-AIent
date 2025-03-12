/**
 * API route for general chat functionality
 * This file handles generating streaming responses from the OpenAI API
 */
import { createOpenAIStream } from "@/lib/ai-stream"

export const dynamic = "force-dynamic"

/**
 * Handles POST requests to generate chat responses with streaming
 * @param req - The request object
 * @returns A streaming response with the generated text
 */
export async function POST(req: Request) {
  try {
    // Parse the request body to get the messages
    const { messages } = await req.json()

    // Create system message for general chat
    const systemMessage = {
      role: "system",
      content: `You are a friendly and knowledgeable assistant. 
      Feel free to use Markdown formatting in your responses:
      - Use **bold** for emphasis
      - Use *italic* for subtle emphasis
      - Use \`code\` for technical terms
      - Use \`\`\`language\n code \`\`\` for code blocks
      - Use bullet points and numbered lists when appropriate`,
    }

    // Create a streaming response
    return await createOpenAIStream([systemMessage, ...messages])
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(
      JSON.stringify({
        error: "An error occurred while generating the response",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 },
    )
  }
}

