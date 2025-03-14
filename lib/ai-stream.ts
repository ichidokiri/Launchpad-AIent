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
    console.error("OpenAI API key not configured")
    throw new Error("OpenAI API key not configured")
  }

  console.log(`Creating OpenAI stream with model: ${model}`)

  try {
    // Create a chat completion with streaming
    const response = await openai.chat.completions.create({
      model,
      messages,
      stream: true,
    })

    console.log("OpenAI stream response initiated")

    // Create a TransformStream to process the chunks
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    // Create a ReadableStream from the OpenAI response
    const stream = new ReadableStream({
      async start(controller) {
        // Process each chunk from the OpenAI stream
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || ""
          if (content) {
            // Send the content to the stream
            controller.enqueue(encoder.encode(content))
          }
        }
        controller.close()
        console.log("OpenAI stream completed successfully")
      },
      cancel() {
        // The stream was canceled (e.g., the user navigated away)
        console.log("Stream was canceled")
      },
    })

    // Return the streaming response
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    })
  } catch (error) {
    console.error("OpenAI API error:", error)
    throw error
  }
}

