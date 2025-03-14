"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DiagnosticsPage() {
  const [dbStatus, setDbStatus] = useState<"loading" | "connected" | "error">("loading")
  const [dbStats, setDbStats] = useState<any>(null)
  const [dbError, setDbError] = useState<string | null>(null)

  const checkDbConnection = async () => {
    setDbStatus("loading")
    setDbError(null)

    try {
      const res = await fetch("/api/debug-db/connection")
      const data = await res.json()

      if (data.status === "success") {
        setDbStatus("connected")
      } else {
        setDbStatus("error")
        setDbError(data.message || "Unknown error")
      }
    } catch (error) {
      setDbStatus("error")
      setDbError(error instanceof Error ? error.message : "Connection failed")
    }
  }

  const fetchDbStats = async () => {
    try {
      const res = await fetch("/api/debug-db")
      const data = await res.json()

      if (data.status === "success") {
        setDbStats(data)
      } else {
        setDbError(data.message || "Failed to fetch database statistics")
      }
    } catch (error) {
      setDbError(error instanceof Error ? error.message : "Failed to fetch database statistics")
    }
  }

  useEffect(() => {
    checkDbConnection()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">System Diagnostics</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Database Connection</CardTitle>
            <CardDescription>Check database connectivity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    dbStatus === "loading" ? "bg-yellow-500" : dbStatus === "connected" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span>
                  {dbStatus === "loading"
                    ? "Checking connection..."
                    : dbStatus === "connected"
                      ? "Connected"
                      : "Connection error"}
                </span>
              </div>

              {dbError && <div className="text-sm text-red-500 mt-2">{dbError}</div>}

              <Button onClick={checkDbConnection} variant="outline">
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Statistics</CardTitle>
            <CardDescription>View database stats and recent records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Button onClick={fetchDbStats} variant="outline">
                Fetch Statistics
              </Button>

              {dbStats && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-muted p-2 rounded">
                      <p className="text-sm font-medium">Agents</p>
                      <p className="text-2xl">{dbStats.stats.agents}</p>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <p className="text-sm font-medium">Users</p>
                      <p className="text-2xl">{dbStats.stats.users}</p>
                    </div>
                  </div>

                  {dbStats.latestAgents?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Latest Agents:</h3>
                      <ul className="text-sm divide-y">
                        {dbStats.latestAgents.map((agent: any) => (
                          <li key={agent.id} className="py-2">
                            <p className="font-medium">{agent.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Created: {new Date(agent.createdAt).toLocaleString()}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

