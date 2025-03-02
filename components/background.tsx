"use client"

import type React from "react"
import { usePathname } from "next/navigation"

export function Background({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <div className={`min-h-screen ${isHomePage ? "bg-gray-50 dark:bg-gray-900" : "grid-background"}`}>{children}</div>
  )
}

