"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/context/AuthContext"
import { Wallet, User } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "./theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const { user, logout } = useAuth()
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  // Protected navigation items that require authentication
  const protectedNavItems = [
    { href: "/create", label: "Create" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/tradegpt", label: "TradeGPT" },
  ]

  // Public navigation items
  const publicNavItems = [{ href: "/market", label: "Market" }]

  const handleConnectWallet = async () => {
    if (!user) {
      // If not logged in, redirect to login
      window.location.href = "/login"
      return
    }

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

  const handleLogout = async () => {
    await logout()
    setIsWalletConnected(false)
    setWalletAddress("")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">AIent</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {/* Always show public nav items */}
            {publicNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground/80">
                {item.label}
              </Link>
            ))}
            {/* Only show protected nav items when logged in */}
            {user &&
              protectedNavItems.map((item) => (
                <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground/80">
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {!user ? (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="default" className="text-sm font-medium">
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleConnectWallet} className="hidden sm:inline-flex">
                <Wallet className="mr-2 h-4 w-4" />
                {isWalletConnected ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4) : "Connect Wallet"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault()
                      handleLogout()
                    }}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

