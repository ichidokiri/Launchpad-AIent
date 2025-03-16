import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { content, agentName, agentSymbol, task } = body

    console.log("Received enhance-content request:", {
      contentLength: content?.length || 0,
      contentPreview: content?.substring(0, 100) + "...",
      agentName,
      agentSymbol,
      task: task?.substring(0, 50) + "...",
    })

    if (!content || content.trim() === "") {
      console.error("Content is required but was empty or undefined")
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Create a prompt for OpenAI
    const prompt = `
      ${task || "Enhance this cryptocurrency article with more detailed analysis, professional language, and better structure."}
      
      The article is about ${agentName || "a cryptocurrency"} ${agentSymbol ? `(${agentSymbol})` : ""}.
      
      Original content:
      ${content}
      
      Please return only the enhanced content in markdown format.
    `

    console.log("Calling OpenAI API with prompt length:", prompt.length)

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using gpt-3.5-turbo for faster response and lower cost
      messages: [
        {
          role: "system",
          content:
            "You are a professional cryptocurrency analyst and writer. Your task is to enhance cryptocurrency articles with detailed analysis, professional language, and clear structure using markdown formatting.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    })

    // Extract the enhanced content from the response
    const enhancedContent = completion.choices[0].message.content || content
    console.log("OpenAI API returned enhanced content, length:", enhancedContent.length)

    // Return the enhanced content
    return NextResponse.json({ enhancedContent })
  } catch (error) {
    console.error("Error enhancing content:", error)
    return NextResponse.json(
      { error: "Failed to enhance content", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

