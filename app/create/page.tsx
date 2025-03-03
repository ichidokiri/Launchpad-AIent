"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Facebook, Twitter, Linkedin, Github, Upload, Loader2 } from "lucide-react"
import toast from "react-hot-toast" // Change this line
// Remove the import { toast } from "@/components/ui/use-toast"

// ... rest of the imports remain the same

export default function CreateAgentPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [issuePrice, setIssuePrice] = useState("")
  const [tokenAmount, setTokenAmount] = useState("")
  const [description, setDescription] = useState("")
  const [avatar, setAvatar] = useState<string | null>(null)
  const [contractAddress, setContractAddress] = useState("")
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    facebook: "",
    linkedin: "",
    github: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    symbol?: string
    issuePrice?: string
    tokenAmount?: string
    avatar?: string
    contractAddress?: string
  }>({})

  const validateForm = () => {
    const newErrors: {
      name?: string
      symbol?: string
      issuePrice?: string
      tokenAmount?: string
      avatar?: string
      contractAddress?: string
    } = {}

    if (!name) newErrors.name = "Name is required"
    if (!symbol) newErrors.symbol = "Symbol is required"
    if (!issuePrice) newErrors.issuePrice = "Issue Price is required"
    if (!tokenAmount) newErrors.tokenAmount = "Token Amount is required"
    if (!avatar) newErrors.avatar = "Avatar is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      setAvatar(base64)
      toast.success("Avatar uploaded successfully!")
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error("Failed to upload avatar.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          symbol,
          description,
          price: Number.parseFloat(issuePrice),
          tokenAmount: Number.parseInt(tokenAmount),
          contractAddress,
          avatar,
          socialLinks,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create agent")
      }

      const data = await response.json()
      toast.success("AI Agent created successfully!")
      router.push("/dashboard") // Redirect to dashboard after success
    } catch (error) {
      console.error("Error creating AI Agent:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create AI Agent")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <div className="container max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Create AI Agent</h1>
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Agent Details</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <form onSubmit={handleSubmit} className="space-y-8">
              <Card className="border-2 border-primary/10 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="grid gap-8">
                    {/* Avatar/Logo Upload Section */}
                    <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed rounded-xl border-primary/20 bg-primary/5">
                      <Label htmlFor="avatar" className="text-lg font-semibold">
                        Avatar/Logo <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center space-x-4">
                        {avatar && (
                            <Image
                                src={avatar || "/placeholder.svg"}
                                alt="Avatar preview"
                                width={96}
                                height={96}
                                className="rounded-full object-cover ring-2 ring-primary/20"
                            />
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="h-24 px-8"
                        >
                          {isUploading ? (
                              <>
                                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                                Uploading...
                              </>
                          ) : (
                              <>
                                <Upload className="w-6 h-6 mr-2" />
                                Upload Image
                              </>
                          )}
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                        />
                      </div>
                      {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar}</p>}
                      <p className="text-sm text-muted-foreground">Required: Square image, at least 200x200px</p>
                    </div>

                    {/* Basic Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">AI Agent Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`bg-background/50 ${errors.name ? "border-red-500" : ""}`}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="symbol">Symbol</Label>
                        <Input
                            id="symbol"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                            className={`bg-background/50 ${errors.symbol ? "border-red-500" : ""}`}
                        />
                        {errors.symbol && <p className="text-red-500 text-sm">{errors.symbol}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="issuePrice">Issue Price</Label>
                        <Input
                            id="issuePrice"
                            type="number"
                            step="0.01"
                            value={issuePrice}
                            onChange={(e) => setIssuePrice(e.target.value)}
                            className={`bg-background/50 ${errors.issuePrice ? "border-red-500" : ""}`}
                        />
                        {errors.issuePrice && <p className="text-red-500 text-sm">{errors.issuePrice}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tokenAmount">Token Amount</Label>
                        <Input
                            id="tokenAmount"
                            type="number"
                            value={tokenAmount}
                            onChange={(e) => setTokenAmount(e.target.value)}
                            className={`bg-background/50 ${errors.tokenAmount ? "border-red-500" : ""}`}
                        />
                        {errors.tokenAmount && <p className="text-red-500 text-sm">{errors.tokenAmount}</p>}
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="h-32 bg-background/50"
                      />
                    </div>

                    {/* Contract Address Section */}
                    <div className="space-y-2">
                      <Label htmlFor="contractAddress">Smart Contract Address (Optional)</Label>
                      <Input
                          id="contractAddress"
                          value={contractAddress}
                          onChange={(e) => setContractAddress(e.target.value)}
                          className={`bg-background/50 ${errors.contractAddress ? "border-red-500" : ""}`}
                      />
                      {errors.contractAddress && <p className="text-red-500 text-sm">{errors.contractAddress}</p>}
                    </div>

                    {/* Social Links Section */}
                    <div className="space-y-4">
                      <Label>Social Links (Optional)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Twitter className="w-5 h-5" />
                          <Input
                              placeholder="Twitter"
                              value={socialLinks.twitter}
                              onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                              className="bg-background/50"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Facebook className="w-5 h-5" />
                          <Input
                              placeholder="Facebook"
                              value={socialLinks.facebook}
                              onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                              className="bg-background/50"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Linkedin className="w-5 h-5" />
                          <Input
                              placeholder="LinkedIn"
                              value={socialLinks.linkedin}
                              onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                              className="bg-background/50"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Github className="w-5 h-5" />
                          <Input
                              placeholder="GitHub"
                              value={socialLinks.github}
                              onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                              className="bg-background/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                ) : (
                    "Create AI Agent"
                )}
              </Button>
            </form>
          </TabsContent>

          {/* Preview tab content remains the same */}
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>AI Agent Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  {avatar ? (
                      <Image
                          src={avatar || "/placeholder.svg"}
                          alt="Agent avatar"
                          width={64}
                          height={64}
                          className="rounded-full"
                      />
                  ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-2xl">{name.charAt(0)}</span>
                      </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{name || "AI Agent Name"}</h2>
                    <p className="text-sm text-gray-500">{symbol || "SYMBOL"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>Issue Price:</strong> {issuePrice ? `$${issuePrice}` : "N/A"}
                  </p>
                  <p>
                    <strong>Token Amount:</strong> {tokenAmount || "N/A"}
                  </p>
                  <p>
                    <strong>Description:</strong> {description || "No description provided."}
                  </p>
                  <p>
                    <strong>Contract Address:</strong> {contractAddress || "Not provided"}
                  </p>
                  <div className="flex space-x-2 mt-4">
                    {socialLinks.twitter && <Twitter className="w-5 h-5" />}
                    {socialLinks.facebook && <Facebook className="w-5 h-5" />}
                    {socialLinks.linkedin && <Linkedin className="w-5 h-5" />}
                    {socialLinks.github && <Github className="w-5 h-5" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}

