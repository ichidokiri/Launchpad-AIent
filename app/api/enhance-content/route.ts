import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
    try {
        const { content, agentName, agentSymbol, task } = await request.json()

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 })
        }

        // Create a system message that provides context about the task
        const systemMessage = `You are a professional financial analyst and cryptocurrency expert specializing in detailed market analysis. 
    ${agentName ? `You have deep knowledge about ${agentName} (${agentSymbol}).` : ""}
    Your task is to enhance and improve cryptocurrency market analysis articles.`

        // Create the prompt for enhancing the content
        const userPrompt = `${task}\n\nOriginal content:\n${content}`

        // Call the OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 2500,
        })

        // Extract the enhanced content from the response
        const enhancedContent = completion.choices[0].message.content || content

        return NextResponse.json({ enhancedContent })
    } catch (error) {
        console.error("Error enhancing content:", error)
        return NextResponse.json({ error: "Failed to enhance content" }, { status: 500 })
    }
}

