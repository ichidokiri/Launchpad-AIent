"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import toast from "react-hot-toast"

interface FormData {
  name: string
  description: string
  model: string
  systemPrompt: string
  category: string
  isPublic: boolean
  price: number
}

export default function DebugPage() {
  const [dbInfo, setDbInfo] = useState<any>(null)
  const [schemaInfo, setSchemaInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "Test Agent",
    description: "This is a test agent created from the debug page",
    model: "gpt-3.5-turbo",
    systemPrompt: "You are a helpful assistant",
    category: "Test",
    isPublic: true,
    price: 0,
  })

  const fetchDbInfo = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/debug-db")
      const data = await response.json()
      setDbInfo(data)
      toast.success("Database info fetched")
    } catch (error) {
      console.error("Error fetching DB info:", error)
      toast.error("Failed to fetch database info")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchSchemaInfo = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/debug-db/schema")
      const data = await response.json()
      setSchemaInfo(data)
      toast.success("Schema info fetched")
    } catch (error) {
      console.error("Error fetching schema info:", error)
      toast.error("Failed to fetch schema info")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createTestAgent = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/ai-agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create test agent")
      }

      toast.success("Test agent created successfully!")
      console.log("Created agent:", data.agent)

      // Refresh DB info
      fetchDbInfo()
    } catch (error) {
      console.error("Error creating test agent:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create test agent")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDbInfo()
    fetchSchemaInfo()
  }, [fetchDbInfo, fetchSchemaInfo])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Database Debug Page</h1>

      <Tabs defaultValue="info">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Database Info</TabsTrigger>
          <TabsTrigger value="schema">Schema Info</TabsTrigger>
          <TabsTrigger value="create">Create Test Agent</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Database Information</span>
                <Button onClick={fetchDbInfo} disabled={isLoading}>
                  {isLoading ? "Loading..." : "Refresh"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dbInfo ? (
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[500px]">
                  {JSON.stringify(dbInfo, null, 2)}
                </pre>
              ) : (
                <p>Loading database information...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Database Schema</span>
                <Button onClick={fetchSchemaInfo} disabled={isLoading}>
                  {isLoading ? "Loading..." : "Refresh"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {schemaInfo ? (
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[500px]">
                  {JSON.stringify(schemaInfo, null, 2)}
                </pre>
              ) : (
                <p>Loading schema information...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Test AI Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e: React.FormEvent) => {
                  e.preventDefault()
                  createTestAgent()
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" name="model" value={formData.model} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">System Prompt</Label>
                  <Textarea
                    id="systemPrompt"
                    name="systemPrompt"
                    value={formData.systemPrompt}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, isPublic: checked })}
                  />
                  <Label htmlFor="isPublic">Make public</Label>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Test Agent"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

