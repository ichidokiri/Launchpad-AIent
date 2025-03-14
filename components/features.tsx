export default function Features() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Powerful Features
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 sm:mt-4">
            Explore the key features that make AIent the ultimate platform for AI agent innovation and trading.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI Agent Marketplace</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Discover and trade cutting-edge AI agents created by developers around the world.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI Agent Creation Tools</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Easily create and manage your own AI agents with our intuitive development tools.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">TradeGPT AI Assistant</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get real-time market insights and trading strategies from our AI-powered assistant.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

