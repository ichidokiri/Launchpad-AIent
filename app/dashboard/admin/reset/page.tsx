"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import toast from "react-hot-toast"
import { AlertTriangle } from "lucide-react"

export default function ResetDatabasePage() {
  const [isResetting, setIsResetting] = useState(false)
  const router = useRouter()

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset the database? This action cannot be undone.")) {
      return
    }

    setIsResetting(true)
    try {
      const response = await fetch("/api/admin/reset-db", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Database has been reset successfully.")
        router.push("/dashboard")
      } else {
        throw new Error(data.error || "Failed to reset database")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reset database")
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Reset Database
          </CardTitle>
          <CardDescription>
            Warning: This action will delete all data in the database. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleReset} disabled={isResetting} className="w-full">
            {isResetting ? "Resetting..." : "Reset Database"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

