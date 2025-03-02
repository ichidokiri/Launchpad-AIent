export type AgentStatus = "active" | "pending" | "paused"

export interface Agent {
    id: number
    name: string
    symbol: string
    description?: string | null
    price: number
    marketCap: number
    createdAt: string
    updatedAt: string
    creatorId: number
    logo?: string
    contractAddress?: string
    totalSupply?: number
    holders?: number
    verified?: boolean
    status?: AgentStatus
}

export interface AgentWithCreator extends Agent {
    creator: {
        id: number
        email: string
    }
}

