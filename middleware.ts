/**
 * Middleware for handling authentication and authorization
 * This file intercepts requests to protected routes and verifies authentication
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserFromToken } from "./lib/jwt";
import { UserRole } from "./lib/auth";

// Define protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/dashboard/settings",
  "/dashboard/ai-agents",
  "/dashboard/all-agents",
  "/dashboard/create-agent",
  "/dashboard/diagnostics",
  "/debug",
];

// Define admin-only routes
const adminRoutes = ["/dashboard/all-users", "/dashboard/admin"];

/**
 * Middleware function that runs before requests to protected routes
 * @param request - The incoming request
 * @returns The response or next middleware
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));

  if (!isProtectedRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  try {
    // Get user from token - properly await the async function
    const user = await getUserFromToken();

    // If no user is found and this is a protected route, redirect to login
    if (!user && isProtectedRoute) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    // If this is an admin route and the user is not an admin, redirect to dashboard
    // Check for both uppercase and lowercase versions for compatibility
    if (
      isAdminRoute &&
      user?.role !== UserRole.ADMIN &&
      user?.role !== UserRole.SUPERADMIN &&
      user?.role !== "ADMIN" &&
      user?.role !== "SUPERADMIN" &&
      user?.role !== "admin" &&
      user?.role !== "superadmin"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // If there's an error, redirect to login
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
