import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that don't require authentication
const publicPaths = [
  "/",
  "/home",
  "/index",
  "/login",
  "/register",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-account",
  "/market",
  "/about",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/images",
  "/assets",
]

// Routes that require authentication
const protectedPaths = ["/create", "/dashboard", "/tradegpt", "/settings"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths and static assets
  if (
      publicPaths.some(
          (path) => pathname === path || pathname.startsWith(`${path}/`) || pathname.match(/\.(jpg|png|gif|svg|ico)$/),
      )
  ) {
    return NextResponse.next()
  }

  // Check if the current path requires authentication
  const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  // Check authentication
  const authToken = request.cookies.get("authToken")?.value

  // If it's a protected path and there's no auth token, redirect to login
  if (isProtectedPath && !authToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

