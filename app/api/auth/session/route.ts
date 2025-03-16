import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    console.log("Session API route called")
    const user = await auth(request)

    if (!user) {
      console.log("No authenticated user found")
      return NextResponse.json(
        { user: null },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, max-age=0, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      )
    }

    console.log("Authenticated user found:", user.email)
    return NextResponse.json(
      { user },
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
    console.error("Error in session API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

