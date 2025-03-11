"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import { LoadingSpinner } from "@/components/loading-spinner"

export const dynamic = "force-dynamic"

export function Dashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (!isLoading && !user && !redirecting) {
      setRedirecting(true)
      router.push("/login")
    }
  }, [user, isLoading, router, redirecting])

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
    )
  }

  if (!user) {
    return null // AuthProvider will handle the redirect
  }

  return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome, {user.email}!</p>
      </div>
  )
}

