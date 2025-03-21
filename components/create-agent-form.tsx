"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "react-hot-toast"

// Fixed values
const FIXED_PRICE = 0.000001
const FIXED_TOKEN_AMOUNT = 1000000000

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  model: z.string({
    required_error: "Please select a model.",
  }),
  systemPrompt: z.string().min(10, {
    message: "System prompt must be at least 10 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  isPublic: z.boolean().default(false),
  price: z
    .number()
    .default(FIXED_PRICE)
    .transform(() => FIXED_PRICE), // Always transform to fixed price
  symbol: z
    .string()
    .min(1, {
      message: "Symbol is required",
    })
    .max(10, {
      message: "Symbol must be 10 characters or less",
    })
    .refine((val) => /^[A-Z0-9]+$/.test(val), {
      message: "Symbol must contain only uppercase letters and numbers",
    }),
  tokenAmount: z
    .number()
    .default(FIXED_TOKEN_AMOUNT)
    .transform(() => FIXED_TOKEN_AMOUNT), // Always transform to fixed token amount
})

// Define the form input types from the schema
type FormValues = z.infer<typeof formSchema>

export function CreateAgentForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      model: "gpt-3.5-turbo",
      systemPrompt: "You are a helpful assistant.",
      category: "general",
      isPublic: true,
      price: FIXED_PRICE, // Fixed price
      symbol: "",
      tokenAmount: FIXED_TOKEN_AMOUNT, // Fixed token amount
    },
  })

  // Define the available models
  const models = [
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    { id: "gpt-4", name: "GPT-4" },
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "claude-3-opus", name: "Claude 3 Opus" },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
  ]

  // Define the available categories
  const categories = [
    { id: "general", name: "General" },
    { id: "productivity", name: "Productivity" },
    { id: "creative", name: "Creative" },
    { id: "education", name: "Education" },
    { id: "finance", name: "Finance" },
    { id: "health", name: "Health" },
    { id: "entertainment", name: "Entertainment" },
  ]

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setError(null)
    setDebugInfo(null)

    try {
      // Ensure symbol is uppercase
      data.symbol = data.symbol.toUpperCase()

      // Ensure fixed values are set (redundant with schema transform but added for safety)
      data.price = FIXED_PRICE
      data.tokenAmount = FIXED_TOKEN_AMOUNT

      // Calculate market cap
      const marketCap = data.price * data.tokenAmount

      // Add required fields that might be missing
      const completeData = {
        ...data,
        marketCap,
      }

      console.log("Submitting agent data:", completeData)

      // Send the form data to the API
      const response = await fetch("/api/ai-agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      })

      // Log the raw response for debugging
      const responseText = await response.text()
      console.log("Raw API response:", responseText)

      // Parse the response
      let responseData
      try {
        responseData = JSON.parse(responseText)
        console.log("Parsed API response:", responseData)
        setDebugInfo(responseData)
      } catch (parseError) {
        console.error("Failed to parse API response:", parseError)
        throw new Error("Invalid response from server: " + responseText)
      }

      // Handle the response
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || "Failed to create AI agent")
      }

      if (!responseData.agent) {
        console.warn("Response doesn't contain agent data:", responseData)
      }

      // Show success message
      toast.success("AI agent created successfully!")

      // Wait a moment before redirecting to ensure the database operation completes
      setTimeout(() => {
        // Redirect to the dashboard
        router.push("/dashboard")
        // Force a refresh of the page to ensure the latest data is loaded
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error("Error creating AI agent:", error)
      // Type check the error before accessing its properties
      if (error instanceof Error) {
        setError(error.message || "Failed to create AI agent")
        toast.error(error.message || "Failed to create AI agent")
      } else {
        setError("Failed to create AI agent")
        toast.error("Failed to create AI agent")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && <div className="text-red-500 text-sm p-3 border border-red-300 rounded bg-red-50">{error}</div>}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My AI Agent" {...field} />
              </FormControl>
              <FormDescription>The name of your AI agent.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symbol</FormLabel>
              <FormControl>
                <Input
                  placeholder="SYMBOL"
                  {...field}
                  onChange={(e) => {
                    // Convert to uppercase
                    field.onChange(e.target.value.toUpperCase())
                  }}
                />
              </FormControl>
              <FormDescription>Trading symbol for your AI agent (e.g., GPT)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="This AI agent helps with..." {...field} />
              </FormControl>
              <FormDescription>Describe what your AI agent does.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The AI model to use for your agent.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The category your agent belongs to.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="systemPrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>System Prompt</FormLabel>
              <FormControl>
                <Textarea placeholder="You are a helpful assistant that..." className="min-h-32" {...field} />
              </FormControl>
              <FormDescription>The system prompt that defines your agent's behavior.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fixed Price Field (Static Display) */}
          <div className="space-y-2">
            <div className="font-medium text-sm">Issue Price (USD)</div>
            <div className="p-2 border rounded-md bg-gray-50 text-gray-700">{FIXED_PRICE}</div>
            <p className="text-sm text-gray-500">Fixed issue price for all agents (0.000001 USD).</p>
          </div>

          {/* Fixed Token Amount Field (Static Display) */}
          <div className="space-y-2">
            <div className="font-medium text-sm">Token Amount</div>
            <div className="p-2 border rounded-md bg-gray-50 text-gray-700">{FIXED_TOKEN_AMOUNT.toLocaleString()}</div>
            <p className="text-sm text-gray-500">Fixed token supply for all agents (1 billion).</p>
          </div>
        </div>

        {/* Hidden inputs to ensure the fixed values are included in the form data */}
        <input type="hidden" name="price" value={FIXED_PRICE} />
        <input type="hidden" name="tokenAmount" value={FIXED_TOKEN_AMOUNT} />

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Public</FormLabel>
                <FormDescription>Make this agent available to everyone.</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create AI Agent"}
        </Button>

        {/* Debug Information */}
        {(process.env.NODE_ENV === "development" || debugInfo) && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <details className="text-sm text-gray-400" open={!!debugInfo}>
              <summary className="cursor-pointer">Debug Information</summary>
              <div className="mt-2 space-y-2">
                {debugInfo && (
                  <div className="p-3 bg-gray-800 rounded overflow-auto max-h-60">
                    <pre className="text-xs text-gray-300">{JSON.stringify(debugInfo, null, 2)}</pre>
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full bg-gray-800 text-gray-300 border-gray-700"
                  onClick={async () => {
                    try {
                      const formData = form.getValues()
                      // Ensure fixed values
                      formData.price = FIXED_PRICE
                      formData.tokenAmount = FIXED_TOKEN_AMOUNT

                      const response = await fetch("/api/debug/create-agent", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formData),
                      })
                      const data = await response.json()
                      console.log("Debug response:", data)
                      setDebugInfo(data)
                      toast.success("Check debug information below")
                    } catch (error) {
                      console.error("Debug error:", error)
                      toast.error("Debug request failed")
                    }
                  }}
                >
                  Test API Connection
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full bg-gray-800 text-gray-300 border-gray-700"
                  onClick={() => {
                    const formData = form.getValues()
                    // Ensure fixed values
                    formData.price = FIXED_PRICE
                    formData.tokenAmount = FIXED_TOKEN_AMOUNT

                    console.log("Current form data:", formData)
                    setDebugInfo(formData)
                    toast.success("Form data shown in debug information")
                  }}
                >
                  Log Form Data
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full bg-gray-800 text-gray-300 border-gray-700"
                  onClick={async () => {
                    try {
                      const response = await fetch("/api/debug-db/connection")
                      const data = await response.json()
                      console.log("Database connection:", data)
                      setDebugInfo(data)
                      toast.success("Database connection info shown")
                    } catch (error) {
                      console.error("DB connection error:", error)
                      toast.error("Failed to check database connection")
                    }
                  }}
                >
                  Check Database Connection
                </Button>
              </div>
            </details>
          </div>
        )}
      </form>
    </Form>
  )
}

