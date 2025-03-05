"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Github,
  Upload,
  Loader2,
  MessageSquare,
  BrainCircuit,
  DollarSign,
  Hash,
  FileText,
  Code,
  Check,
  Settings,
  Database,
} from "lucide-react"
import toast from "react-hot-toast"

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
    x: "",
    youtube: "",
    discord: "",
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

  // New state for AI model selection
  const [selectedModel, setSelectedModel] = useState("gpt-4")
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([])

  const toggleTool = (name: string) => {
    setSelectedTools((prev) => (prev.includes(name) ? prev.filter((tool) => tool !== name) : [...prev, name]))
  }

  const toggleDataSource = (name: string) => {
    setSelectedDataSources((prev) => (prev.includes(name) ? prev.filter((source) => source !== name) : [...prev, name]))
  }

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
          model: selectedModel,
          tools: selectedTools,
          dataSources: selectedDataSources,
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
      <div className="flex flex-col h-screen">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold flex items-center">
            <BrainCircuit className="mr-2 h-5 w-5" />
            Create AI Agent
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-4">
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList className="bg-secondary p-1 rounded-lg w-full">
              <TabsTrigger value="details" className="rounded-md w-full">
                Agent Details
              </TabsTrigger>
              <TabsTrigger value="ai-config" className="rounded-md w-full">
                AI Configuration
              </TabsTrigger>
              <TabsTrigger value="preview" className="rounded-md w-full">
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Avatar Upload Section */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Agent Avatar
                  </h3>

                  <div
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors bg-secondary hover:bg-accent ${
                          avatar ? "border border-border" : ""
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                  >
                    {avatar ? (
                        <Image
                            src={avatar || "/placeholder.svg"}
                            alt="Avatar preview"
                            width={40}
                            height={40}
                            className="rounded-full object-cover mr-3"
                        />
                    ) : (
                        <Upload className="mr-3 h-5 w-5 text-muted-foreground" />
                    )}
                    <span>{avatar ? "Change Avatar" : "Upload Avatar"}</span>
                    {isUploading ? (
                        <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                    ) : avatar ? (
                        <Check className="ml-auto h-4 w-4 text-green-500" />
                    ) : (
                        <Check className="ml-auto h-4 w-4 text-muted-foreground" />
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                    />
                  </div>
                  {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>}
                </div>

                {/* Basic Info Section */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Basic Information
                  </h3>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-sm">
                        AI Agent Name
                      </Label>
                      <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="symbol" className="text-sm">
                        Symbol
                      </Label>
                      <Input
                          id="symbol"
                          value={symbol}
                          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                          className={errors.symbol ? "border-red-500" : ""}
                      />
                      {errors.symbol && <p className="text-red-500 text-xs">{errors.symbol}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="issuePrice" className="text-sm">
                        Issue Price
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="issuePrice"
                            type="number"
                            step="0.01"
                            value={issuePrice}
                            onChange={(e) => setIssuePrice(e.target.value)}
                            className={`pl-10 ${errors.issuePrice ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.issuePrice && <p className="text-red-500 text-xs">{errors.issuePrice}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="tokenAmount" className="text-sm">
                        Token Amount
                      </Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="tokenAmount"
                            type="number"
                            value={tokenAmount}
                            onChange={(e) => setTokenAmount(e.target.value)}
                            className={`pl-10 ${errors.tokenAmount ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.tokenAmount && <p className="text-red-500 text-xs">{errors.tokenAmount}</p>}
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Description
                  </h3>

                  <div className="space-y-1">
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="h-20 text-sm"
                        placeholder="Describe what your AI agent does..."
                    />
                  </div>
                </div>

                {/* Contract Address Section */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Code className="mr-2 h-5 w-5" />
                    Smart Contract
                  </h3>

                  <div className="space-y-1">
                    <Input
                        id="contractAddress"
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        className={errors.contractAddress ? "border-red-500" : ""}
                        placeholder="Contract Address (Optional)"
                    />
                    {errors.contractAddress && <p className="text-red-500 text-xs">{errors.contractAddress}</p>}
                  </div>
                </div>

                {/* Social Links Section */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Github className="mr-2 h-5 w-5" />
                    Social Links
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <svg
                          viewBox="0 0 24 24"
                          className="w-5 h-5 text-muted-foreground"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <Input
                          placeholder="X (Twitter)"
                          value={socialLinks.x}
                          onChange={(e) => setSocialLinks({ ...socialLinks, x: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                          viewBox="0 0 24 24"
                          className="w-5 h-5 text-red-500"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      <Input
                          placeholder="YouTube"
                          value={socialLinks.youtube}
                          onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                          viewBox="0 0 24 24"
                          className="w-5 h-5 text-indigo-400"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.608 1.2495-1.8447-.2762-3.6677-.2762-5.4878 0-.1634-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                      </svg>
                      <Input
                          placeholder="Discord"
                          value={socialLinks.discord}
                          onChange={(e) => setSocialLinks({ ...socialLinks, discord: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Github className="w-5 h-5 text-muted-foreground" />
                      <Input
                          placeholder="GitHub"
                          value={socialLinks.github}
                          onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </TabsContent>

            {/* AI Configuration Tab */}
            <TabsContent value="ai-config">
              <div className="space-y-6">
                {/* LLM Selection section */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    LLM Selection
                  </h3>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select LLM Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3">Claude 3</SelectItem>
                      <SelectItem value="llama-3">Llama 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tools section with selectable items */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Tools
                  </h3>
                  <div className="space-y-3">
                    <ToolItem
                        name="Twitter Scraper"
                        icon={<TwitterIcon className="mr-3 h-5 w-5 text-blue-400" />}
                        isSelected={selectedTools.includes("Twitter Scraper")}
                    />
                    } isSelected={selectedTools.includes("Twitter Scraper")}
                    onClick={() => toggleTool("Twitter Scraper")}
                    />
                    <ToolItem
                        name="Discord Scraper"
                        icon={<DiscordIcon className="mr-3 h-5 w-5 text-indigo-400" />}
                        isSelected={selectedTools.includes("Discord Scraper")}
                        onClick={() => toggleTool("Discord Scraper")}
                    />
                    <ToolItem
                        name="YouTube Scraper"
                        icon={<YouTubeIcon className="mr-3 h-5 w-5 text-red-400" />}
                        isSelected={selectedTools.includes("YouTube Scraper")}
                        onClick={() => toggleTool("YouTube Scraper")}
                    />
                  </div>
                </div>

                {/* Data Sources section with selectable items */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    Data Sources
                  </h3>
                  <div className="space-y-3">
                    <ToolItem
                        name="Reddit"
                        icon={<RedditIcon className="mr-3 h-5 w-5 text-green-400" />}
                        isSelected={selectedDataSources.includes("Reddit")}
                        onClick={() => toggleDataSource("Reddit")}
                    />
                    <ToolItem
                        name="HuggingFace Datasets"
                        icon={<HuggingFaceIcon className="mr-3 h-5 w-5 text-yellow-400" />}
                        isSelected={selectedDataSources.includes("HuggingFace Datasets")}
                        onClick={() => toggleDataSource("HuggingFace Datasets")}
                    />
                    <ToolItem
                        name="GitHub Repositories"
                        icon={<GitHubIcon className="mr-3 h-5 w-5 text-blue-400" />}
                        isSelected={selectedDataSources.includes("GitHub Repositories")}
                        onClick={() => toggleDataSource("GitHub Repositories")}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Preview tab content */}
            <TabsContent value="preview">
              <div className="space-y-3">
                <div className="flex items-center p-3 rounded-lg bg-card">
                  {avatar ? (
                      <Image
                          src={avatar || "/placeholder.svg"}
                          alt="Agent avatar"
                          width={40}
                          height={40}
                          className="rounded-full object-cover mr-3"
                      />
                  ) : (
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mr-3">
                        <span className="text-muted-foreground text-lg">{name.charAt(0) || "A"}</span>
                      </div>
                  )}
                  <div>
                    <h2 className="font-bold">{name || "AI Agent Name"}</h2>
                    <p className="text-xs text-muted-foreground">{symbol || "SYMBOL"}</p>
                  </div>
                  <Check className="ml-auto h-4 w-4 text-green-500" />
                </div>

                <div className="p-3 rounded-lg bg-card">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Issue Price:</span>
                    <span className="text-sm">{issuePrice ? `$${issuePrice}` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Token Amount:</span>
                    <span className="text-sm">{tokenAmount || "N/A"}</span>
                  </div>
                </div>

                {description && (
                    <div className="p-3 rounded-lg bg-card">
                      <h4 className="text-sm font-medium mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                )}

                {contractAddress && (
                    <div className="p-3 rounded-lg bg-card">
                      <h4 className="text-sm font-medium mb-1">Contract</h4>
                      <p className="text-sm text-muted-foreground truncate">{contractAddress}</p>
                    </div>
                )}

                {selectedModel && (
                    <div className="p-3 rounded-lg bg-card">
                      <h4 className="text-sm font-medium mb-1">AI Model</h4>
                      <p className="text-sm text-muted-foreground">{selectedModel}</p>
                    </div>
                )}

                {selectedTools.length > 0 && (
                    <div className="p-3 rounded-lg bg-card">
                      <h4 className="text-sm font-medium mb-2">Tools</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTools.map((tool) => (
                            <span key={tool} className="px-2 py-1 bg-muted rounded-md text-xs">
                        {tool}
                      </span>
                        ))}
                      </div>
                    </div>
                )}

                {selectedDataSources.length > 0 && (
                    <div className="p-3 rounded-lg bg-card">
                      <h4 className="text-sm font-medium mb-2">Data Sources</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedDataSources.map((source) => (
                            <span key={source} className="px-2 py-1 bg-muted rounded-md text-xs">
                        {source}
                      </span>
                        ))}
                      </div>
                    </div>
                )}

                {(socialLinks.x || socialLinks.youtube || socialLinks.discord || socialLinks.github) && (
                    <div className="p-3 rounded-lg bg-card">
                      <h4 className="text-sm font-medium mb-2">Social Links</h4>
                      <div className="flex space-x-3">
                        {socialLinks.x && (
                            <svg
                                viewBox="0 0 24 24"
                                className="w-5 h-5 text-muted-foreground"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        )}
                        {socialLinks.youtube && (
                            <svg
                                viewBox="0 0 24 24"
                                className="w-5 h-5 text-red-500"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        )}
                        {socialLinks.discord && (
                            <svg
                                viewBox="0 0 24 24"
                                className="w-5 h-5 text-indigo-400"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.608 1.2495-1.8447-.2762-3.6677-.2762-5.4878 0-.1634-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                            </svg>
                        )}
                        {socialLinks.github && <Github className="w-5 h-5 text-muted-foreground" />}
                      </div>
                    </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
              ) : (
                  "Create AI Agent"
              )}
            </Button>
          </div>
        </div>
      </div>
  )
}

// ToolItem component and icon components
interface ToolItemProps {
  name: string
  icon: React.ReactNode
  isSelected?: boolean
  onClick?: () => void
}

function ToolItem({ name, icon, isSelected = false, onClick }: ToolItemProps) {
  return (
      <div
          className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
              isSelected ? "bg-accent border border-border" : "bg-card hover:bg-accent"
          }`}
          onClick={onClick}
      >
        {icon}
        <span>{name}</span>
        {isSelected ? (
            <Check className="ml-auto h-4 w-4 text-green-500" />
        ) : (
            <Check className="ml-auto h-4 w-4 text-muted-foreground" />
        )}
      </div>
  )
}

// Custom SVG icons
function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
      <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
      >
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
  )
}

function DiscordIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.608 1.2495-1.8447-.2762-3.6677-.2762-5.4878 0-.1634-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
      </svg>
  )
}

function YouTubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
  )
}

function RedditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.75-1.64-6.07-1.72.08-1.1.4-3.05 1.52-3.7.72-.4 1.73-.24 3 .5C17.2 6.3 18.46 7.5 20 7.5c1.65 0 3-1.35 3-3s-1.35-3-3-3c-1.38 0-2.54.94-2.88 2.22-1.43-.72-2.64-.8-3.6-.25-1.64.94-1.95 3.47-2 4.55-2.33.08-4.45.7-6.1 1.72C4.86 8.98 3.96 8.5 3 8.5c-1.65 0-3 1.35-3 3 0 1.32.84 2.44 2.05 2.84-.03.22-.05.44-.05.66 0 3.86 4.5 7 10 7s10-3.14 10-7c0-.22-.02-.44-.05-.66 1.2-.4 2.05-1.54 2.05-2.84zM2.3 13.37C1.5 13.07 1 12.35 1 11.5c0-1.1.9-2 2-2 .64 0 1.22.32 1.6.82-1.1.85-1.92 1.9-2.3 3.05zm3.7.13c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-.9 2-2 2zm9.8 4.8c-1.08.63-2.42.96-3.8.96-1.4 0-2.74-.34-3.8-.95-.24-.13-.32-.44-.2-.68.15-.24.46-.32.7-.18 1.83 1.06 4.76 1.06 6.6 0 .23-.13.53-.05.67.2.14.23.06.54-.18.67zm.2-2.8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm5.7-2.13c-.38-1.16-1.2-2.2-2.3-3.05.38-.5.97-.82 1.6-.82 1.1 0 2 .9 2 2 0 .84-.53 1.57-1.3 1.87z" />
      </svg>
  )
}

function HuggingFaceIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M23.5 19.8L21.2 22c-.2.2-.5.3-.8.3-.8 0-1.6-.4-2.6-1.5-4.8-4.8-11.4-14.5-11.4-14.5s9.7 6.6 14.5 11.4c1 1 1.5 1.8 1.5 2.6 0 .4-.1.7-.3.9l-9.4-9.4c-.5-.5-1.2-.5-1.7 0s-.5 1.2 0 1.7l9.4 9.4c.1.1.2.3.2.4z" />
        <path d="M14.7 19.8l-1.4-1.4c-.5-.5-1.2-.5-1.7 0s-.5 1.2 0 1.7l1.4 1.4c.2.2.5.3.8.3s.6-.1.8-.3c.6-.5.6-1.2.1-1.7zM4.7 4.5C4.2 4 3.5 4 3 4.5s-.5 1.2 0 1.7l1.4 1.4c.2.2.5.3.8.3s.6-.1.8-.3c.5-.5.5-1.2 0-1.7L4.7 4.5zM17.1 9.3c2.3-1.6 3-2.7 3-2.7s-1.4-1.6-5.9-.4C11.1 2.5 8.9.3 8.9.3S4.3 2.7 3.1 5.3c-.9 2-.6 7.9 8.5 15.4.4.3.8.6 1.2.9 1.9-2.5 4.3-2.5 4.3-2.5s-1.6-2.7 1.1-5.1c-1.1-4.6-1.1-4.7-1.1-4.7z" />
      </svg>
  )
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.24.73-.53v-1.85c-3.01.66-3.64-1.44-3.64-1.44-.5-1.29-1.21-1.63-1.21-1.63-.99-.68.07-.67.07-.67 1.09.08 1.67 1.14 1.67 1.14.97 1.69 2.54 1.2 3.15.92.1-.71.38-1.2.69-1.47-2.42-.28-4.96-1.22-4.96-5.42 0-1.2.42-2.18 1.12-2.94-.11-.28-.49-1.4.11-2.91 0 0 .92-.29 3 1.13a10.5 10.5 0 015.42 0c2.08-1.42 3-.13 3-.13.6 1.51.22 2.63.1 2.9.7.77 1.13 1.74 1.13 2.94 0 4.21-2.55 5.14-4.98 5.41.39.34.74 1.01.74 2.03v3c0 .29.19.63.74.53A11 11 0 0012 1.27" />
      </svg>
  )
}

