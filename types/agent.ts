export interface Agent {
  id: string
  name: string
  symbol: string
  logo?: string
  contractAddress?: string // Add this property
  verified?: boolean // Add this property
  price: string | number
  marketCap: string | number
  createdAt: string
  updatedAt?: string
  creatorId: string
  description?: string
  model?: string
  systemPrompt?: string
  category?: string
  isPublic?: boolean
  status?: string
  totalSupply?: number // Add this property
  holders?: number // Add this property
  creator?: {
    id: string
    name?: string
    email: string
  }
}

export type AgentWithCreator = Agent

