"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"

// Mock data for articles
const mockArticles = [
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

export default function DataInfoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [selectedArticle, setSelectedArticle] = useState(null)

  const filteredArticles = mockArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedTopic === "" || article.topic === selectedTopic),
  )

  const topics = ["analysis", "trading", "data analysis"]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">DataInfo</h1>
      <div className="mb-6 flex space-x-4">
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} className="border rounded p-2">
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
          <Button onClick={() => setSelectedArticle(null)} className="mb-4">
            Back to Articles
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>{selectedArticle.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="cursor-pointer" onClick={() => setSelectedArticle(article)}>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Topic: {article.topic}</p>
                <p className="mt-2">{article.content.substring(0, 100)}...</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

