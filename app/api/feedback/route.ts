export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messageId, feedback } = await req.json()

    if (!messageId || !feedback) {
      return NextResponse.json({ error: "Message ID and feedback are required" }, { status: 400 })
    }

    // For now, just log the feedback
    console.log(`Feedback received: ${feedback} for message ${messageId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error storing feedback:", error)
    return NextResponse.json({ error: "Failed to store feedback" }, { status: 500 })
  }
}

