import OpenAI from "openai"

// Create OpenAI client with API key
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Creates a streaming response from OpenAI
 * @param messages - The messages to send to OpenAI
 * @param model - The model to use (default: gpt-4o)
 * @returns A streaming response
 */
export async function createOpenAIStream(messages: any[], model = "gpt-4o") {
  // Validate the API key
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured")
  }

  // Create a chat completion with streaming
  const response = await openai.chat.completions.create({
    model,
    stream: true,
    messages,
  })

  // Convert the response to a ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      const decoder = new TextDecoder()

      // Process the response
      for await (const chunk of response) {
        try {
          const text = chunk.choices[0]?.delta?.content || ""
          if (text) {
            controller.enqueue(encoder.encode(text))
          }
        } catch (e) {
          console.error("Error processing chunk:", e)
        }
      }

      controller.close()
    },
  })

  // Return the streaming response
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}

