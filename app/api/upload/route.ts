import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
    try {
        const user = await auth(request)
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64String = `data:${file.type};base64,${buffer.toString("base64")}`

        return NextResponse.json({ url: base64String })
    } catch (error) {
        console.error("Error uploading file:", error)
        return NextResponse.json({ error: "Error uploading file" }, { status: 500 })
    }
}

