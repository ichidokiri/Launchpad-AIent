// This file provides type declarations to work around Next.js 15.1.0 route handler type issues

import type { NextRequest, NextResponse } from "next/server"

declare global {
  // Define a generic route handler type that works with Next.js 15.1.0
  type RouteHandler<Params = Record<string, string>> = (
    request: NextRequest,
    context: { params: Params },
  ) => Promise<NextResponse> | NextResponse
}

