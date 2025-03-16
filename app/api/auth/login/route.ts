import { NextResponse } from "next/server"
import { SignJWT } from "jose"
import { cookies } from "next/headers"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    console.log(`Login attempt for email: ${email}`)

    // Check if prisma is initialized
    if (!prisma) {
      console.error("Prisma client is not initialized")
      return NextResponse.json({ success: false, message: "Database connection error" }, { status: 500 })
    }

    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
          monadBalance: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          username: true,
        },
      })

      console.log(`User lookup result:`, user ? "User found" : "User not found")

      if (!user) {
        console.log(`User not found: ${email}`)
        return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        console.log(`Invalid password for user: ${email}`)
        return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
      }

      // Generate JWT token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      const token = await new SignJWT({
        id: user.id,
        email: user.email,
        role: user.role,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret)

      // Clear any existing cookies
      cookies().delete("authToken")
      cookies().delete("token")

      // Set cookie with the token
      cookies().set({
        name: "authToken",
        value: token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: "lax",
      })

      // Return user data (excluding password)
      const { password: _, ...userData } = user

      console.log(`Login successful for user: ${email}`)
      return NextResponse.json(
        { success: true, user: userData },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, max-age=0, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      )
    } catch (dbError) {
      console.error("Database error during login:", dbError)
      return NextResponse.json({ success: false, message: "Database error during login" }, { status: 500 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "An error occurred during login" }, { status: 500 })
  }
}

