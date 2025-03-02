"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/context/AuthContext"
import { ThemeToggle } from "./theme-toggle"
import { Wallet } from "lucide-react"

export function StickyNav() {
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const [isWalletConnected, setIsWalletConnected] = useState(false)
    const [walletAddress, setWalletAddress] = useState("")

    const navItems = [
        { name: "Market", href: "/market" },
        { name: "Create", href: "/create" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "TradeGPT", href: "/tradegpt" },
        { name: "DataInfo", href: "/datainfo" },
        { name: "Livestream", href: "/livestream" },
    ]

    const truncateAddress = (address: string) => {
        if (!address) return ""
        return `${address.slice(0, 4)}...${address.slice(-4)}`
    }

    const handleConnectWallet = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
                if (accounts && accounts.length > 0) {
                    setWalletAddress(accounts[0])
                    setIsWalletConnected(true)
                }
            } catch (error) {
                console.error("User denied account access")
            }
        } else {
            console.log("Please install MetaMask!")
        }
    }

    return (
        <nav className="sticky top-0 z-50 w-full bg-white dark:bg-black border-b border-border">
            <div className="w-full px-4">
                <div className="mx-auto max-w-[1400px] flex h-14 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/home" className="mr-6 flex items-center space-x-2">
                            <span className="font-bold text-lg">AIent</span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-6 text-sm">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`transition-colors hover:text-foreground/80 font-semibold ${
                                        pathname === item.href ? "text-foreground" : "text-foreground/60"
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={handleConnectWallet} className="hidden sm:inline-flex">
                            <Wallet className="mr-2 h-4 w-4" />
                            {isWalletConnected ? truncateAddress(walletAddress) : "Connect Wallet"}
                        </Button>
                        {!user ? (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="text-base font-semibold">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="ghost" className="text-base font-semibold">
                                        Register
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <span className="text-sm font-semibold text-foreground/80">{user.email}</span>
                                <Button variant="ghost" className="text-sm font-semibold" onClick={() => logout()}>
                                    Logout
                                </Button>
                            </>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    )
}

