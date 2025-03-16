import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function GET() {
  try {
    // Initialize the OpenAI client with the API key from environment variables
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Make a simple API call to verify the key works
    const models = await openai.models.list()

    return NextResponse.json({
      success: true,
      message: "OpenAI API key is valid",
      models: models.data.slice(0, 5).map((model) => model.id), // Just return first 5 model IDs
    })
  } catch (error) {
    console.error("Error verifying OpenAI API key:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to verify OpenAI API key",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

