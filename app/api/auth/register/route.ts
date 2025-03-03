import { NextResponse } from "next/server"
import { hash } from "bcryptjs" // Changed from 'bcrypt' to 'bcryptjs'
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json()

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email or username already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Error creating user" }, { status: 500 })
  }
}

