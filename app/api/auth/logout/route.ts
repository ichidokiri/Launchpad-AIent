export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Clear the auth token cookie - properly await cookies()
    const cookieStore = cookies()

    // Delete both possible cookie names to ensure complete logout
    cookieStore.delete("authToken")
    cookieStore.delete("token")

    // Set proper cache control headers to prevent caching
    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to logout",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 },
    )
  }
}

