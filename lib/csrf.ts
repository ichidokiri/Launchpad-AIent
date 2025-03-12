import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { createHash, randomBytes } from "crypto"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_jwt_secret_replace_this_in_production")

export async function generateCSRFToken() {
  // Generate a random token
  const token = randomBytes(32).toString("hex")

  // Create a hash of the token that we'll store
  const hash = createHash("sha256").update(token).digest("hex")

  // Sign the hash in a JWT
  const jwt = await new SignJWT({ hash })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret)

  // Set the JWT in a cookie
  const cookieStore = await cookies()
  cookieStore.set("csrf", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })

  // Return the original token to be sent in the form
  return token
}

export async function validateCSRFToken(token: string) {
  try {
    // Get the JWT from cookies
    const cookieStore = await cookies()
    const jwt = cookieStore.get("csrf")?.value
    if (!jwt) return false

    // Verify the JWT and extract the hash
    const { payload } = await jwtVerify(jwt, secret)
    const hash = payload.hash as string

    // Hash the provided token and compare
    const calculatedHash = createHash("sha256").update(token).digest("hex")
    return hash === calculatedHash
  } catch {
    return false
  }
}

