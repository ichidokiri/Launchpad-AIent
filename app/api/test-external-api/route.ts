import { NextResponse } from "next/server"

// The base URL for the external API
const BASE_URL = "http://140.112.29.197:13579"

export async function GET(request: Request) {
  try {
    console.log("Testing connection to external API...")

    // First, try a simple GET request to check if the API is accessible
    const pingResponse = await fetch(`${BASE_URL}`, {
      method: "GET",
      cache: "no-store",
    }).catch((error) => {
      throw new Error(`Failed to connect to external API: ${error.message}`)
    })

    console.log(`Ping response status: ${pingResponse.status}`)

    // Now test the actual content endpoint
    const topic = "Write a short article about Bitcoin"
    console.log(`Testing content endpoint with topic: ${topic}`)

    const contentResponse = await fetch(`${BASE_URL}/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(topic),
      cache: "no-store",
    }).catch((error) => {
      throw new Error(`Failed to connect to content endpoint: ${error.message}`)
    })

    console.log(`Content response status: ${contentResponse.status}`)

    // Get the raw response text
    const responseText = await contentResponse.text()
    console.log(`Raw response (first 500 chars): ${responseText.substring(0, 500)}...`)

    // Try to parse as JSON
    let parsedResponse
    try {
      parsedResponse = JSON.parse(responseText)
      console.log("Successfully parsed response as JSON")
    } catch (error) {
      console.log("Response is not valid JSON")
      parsedResponse = { rawText: responseText }
    }

    return NextResponse.json({
      status: "success",
      pingStatus: pingResponse.status,
      contentStatus: contentResponse.status,
      responsePreview: responseText.substring(0, 1000),
      parsedResponse: parsedResponse,
    })
  } catch (error) {
    console.error("Error testing external API:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

