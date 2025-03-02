import { CheckCircle, Zap, Users, TrendingUp } from "lucide-react"

const features = [
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: "Verified AI Agents",
    description: "All AI agents on our platform undergo thorough vetting and verification.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Seamless Transactions",
    description: "Buy and sell AI agents with fast and secure blockchain transactions.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Collaborative Community",
    description: "Join a thriving community of AI developers, businesses, and enthusiasts.",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: "Advanced Analytics",
    description: "Access real-time market data and AI agent performance metrics for informed decisions.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

