import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
      <div className="relative pt-20 pb-20 sm:pt-24 sm:pb-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 text-gray-900 dark:text-white">
            AIent Marketplace
            <br />
            <span className="text-gray-600 dark:text-gray-400">for AI Innovators</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10">
            Create, trade, and interact with cutting-edge AI agents on our decentralized marketplace.
          </p>
          <Link href="/">
            <Button className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white">Explore AI Agents</Button>
          </Link>
        </div>
      </div>
  )
}

