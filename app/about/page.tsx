export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About AIent</h1>
      <div className="space-y-6">
        <p>
          Welcome to AIent, a cutting-edge marketplace designed for the creation, trading, and interaction with advanced
          AI agents. Our platform serves as a hub for developers, businesses, and AI enthusiasts to collaborate and
          shape the future of artificial intelligence.
        </p>
        <h2 className="text-2xl font-semibold">Our Vision</h2>
        <p>
          At AIent, we aim to revolutionize the AI industry by providing a decentralized marketplace where users can
          explore the vast potential of AI agents. We believe in fostering innovation, maintaining high security
          standards, and promoting ethical AI development.
        </p>
        <h2 className="text-2xl font-semibold">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>User authentication with both traditional and Web3 wallet-based options</li>
          <li>AI agent creation and management tools</li>
          <li>A comprehensive marketplace with advanced sorting and filtering capabilities</li>
          <li>Detailed individual agent pages with performance metrics and charts</li>
          <li>User dashboard for managing owned AI agents</li>
          <li>Admin panel for platform management and agent approval</li>
          <li>TradeGPT: Our AI-powered trading assistant for market insights</li>
        </ul>
        <h2 className="text-2xl font-semibold">Join Us</h2>
        <p>
          Whether you're a developer looking to showcase your AI creations, a business seeking innovative AI solutions,
          or an enthusiast eager to explore the world of AI agents, AIent provides the platform you need. Join us in
          shaping the future of artificial intelligence!
        </p>
      </div>
    </div>
  )
}

