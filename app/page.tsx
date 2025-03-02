"use client"
import MarketContent from "@/components/market-content"

interface Agent {
    id: string
    name: string
    symbol: string
    logo: string
    contractAddress: string
    price: number
    totalSupply: number
    marketCap: number
    holders: number
    verified: boolean
}

const agents: Agent[] = [
    {
        id: "1",
        name: "NightOwl",
        symbol: "$NIGHT",
        logo: "/placeholder.svg?height=48&width=48",
        contractAddress: "0x1C4C7651982C6d2e9b84F5552811Ef49c7C7D7b3",
        price: 0.15,
        totalSupply: 270266666,
        marketCap: 40210000,
        holders: 266647,
        verified: true,
    },
    {
        id: "2",
        name: "StellarMind",
        symbol: "$STEL",
        logo: "/placeholder.svg?height=48&width=48",
        contractAddress: "0x55cD4832d96b34225c83C3B9d5e5c2D0Ebb1f2e4",
        price: 0.08,
        totalSupply: 223875000,
        marketCap: 17760000,
        holders: 292200,
        verified: true,
    },
    {
        id: "3",
        name: "QuantumLogic",
        symbol: "$QNTM",
        logo: "/placeholder.svg?height=48&width=48",
        contractAddress: "0x8901DaECba7E3b7Ac2190cE3f90778583B8984a1",
        price: 0.12,
        totalSupply: 300000000,
        marketCap: 36000000,
        holders: 180500,
        verified: true,
    },
]

const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function HomePage() {
    return <MarketContent />
}

