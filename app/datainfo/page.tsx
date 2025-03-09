"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"

// Define a type for the article objects
interface Article {
  id: number
  title: string
  content: string
  topic: string
}

// Mock data for articles
const mockArticles: Article[] = [
  {
    id: 1,
    title: "Understanding Market Patterns",
    content: "# Understanding Market Patterns\n\nMarket patterns emerge from collective behavior...",
    topic: "analysis",
  },
  {
    id: 2,
    title: "Advanced Trading Strategies",
    content: "# Advanced Trading Strategies\n\nSuccessful trading requires a systematic approach...",
    topic: "trading",
  },
  {
    id: 3,
    title: "Data-Driven Decision Making",
    content: "# Data-Driven Decision Making\n\nModern analysis relies on comprehensive data interpretation...",
    topic: "data analysis",
  },
]

/**
 * DataInfo page component
 * Displays articles and information about trading and market analysis
 */
export default function DataInfoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  // Properly type the selectedArticle state variable as Article | null
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  // Filter articles based on search term and selected topic
  const filteredArticles = mockArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedTopic === "" || article.topic === selectedTopic),
  )

  const topics = ["analysis", "trading", "data analysis"]

  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">DataInfo</h1>
      <div className="mb-6 flex space-x-4">
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-[#2F2F2F] border-gray-700 text-white placeholder:text-gray-400"
        />
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="border rounded p-2 bg-[#2F2F2F] border-gray-700 text-white"
        >
          <option value="">All Topics</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>
      {selectedArticle ? (
        <div>
          <Button onClick={() => setSelectedArticle(null)} className="mb-4 bg-[#2F2F2F] hover:bg-gray-600 text-white">
            Back to Articles
          </Button>
          <Card className="bg-[#2F2F2F] border-gray-700 text-white">
            <CardHeader>
              <CardTitle>{selectedArticle.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactMarkdown className="text-white">{selectedArticle.content}</ReactMarkdown>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="cursor-pointer bg-[#2F2F2F] border-gray-700 hover:bg-gray-700 transition-colors"
              onClick={() => setSelectedArticle(article)}
            >
              <CardHeader>
                <CardTitle className="text-white">{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">Topic: {article.topic}</p>
                <p className="mt-2 text-gray-300">{article.content.substring(0, 100)}...</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

