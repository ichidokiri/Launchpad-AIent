"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/context/AuthContext"
import { ThemeToggle } from "./theme-toggle"
import { Wallet, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function StickyNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "Market", href: "/" },
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
    <nav className="sticky top-0 z-50 w-full bg-black border-b border-gray-800">
      <div className="w-full px-4">
        <div className="mx-auto max-w-[1400px] flex h-14 items-center justify-between">
          <div className="flex items-center">
            <Link href="/home" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-lg text-white">AIent</span>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center space-x-6 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors hover:text-gray-300 font-semibold ${
                    pathname === item.href ? "text-white" : "text-gray-400"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            {/* Wallet Button - Hidden on small mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnectWallet}
              className="hidden sm:inline-flex bg-[#2F2F2F] border-gray-700 text-white hover:bg-gray-600"
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isWalletConnected ? truncateAddress(walletAddress) : "Connect Wallet"}
            </Button>

            {/* Authentication Buttons - Hidden on mobile */}
            <div className="hidden sm:flex items-center space-x-2">
              {!user ? (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-base font-semibold text-white hover:bg-gray-800">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="ghost" className="text-base font-semibold text-white hover:bg-gray-800">
                      Register
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-sm font-semibold text-gray-300">{user.email}</span>
                  <Button
                    variant="ghost"
                    className="text-sm font-semibold text-white hover:bg-gray-800"
                    onClick={() => logout()}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>

            <ThemeToggle />

            {/* Mobile Menu Button - Only visible on mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white hover:bg-gray-800"
                  aria-label="Menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px] bg-black border-gray-800 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                    <span className="font-bold text-lg text-white">Menu</span>
                  </div>

                  <div className="flex-1 overflow-auto py-4">
                    <div className="px-4 py-2 space-y-4">
                      {/* Mobile Navigation Links */}
                      <div className="space-y-1">
                        {navItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block py-2 px-3 rounded-md text-base font-medium ${
                              pathname === item.href
                                ? "bg-gray-800 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>

                      {/* Mobile Wallet Button */}
                      <div className="pt-4 border-t border-gray-800">
                        <Button
                          variant="outline"
                          onClick={handleConnectWallet}
                          className="w-full bg-[#2F2F2F] border-gray-700 text-white hover:bg-gray-600"
                        >
                          <Wallet className="mr-2 h-4 w-4" />
                          {isWalletConnected ? truncateAddress(walletAddress) : "Connect Wallet"}
                        </Button>
                      </div>

                      {/* Mobile Authentication */}
                      <div className="pt-4 border-t border-gray-800 space-y-2">
                        {!user ? (
                          <>
                            <Link href="/login" className="block w-full">
                              <Button variant="outline" className="w-full text-white border-gray-700 hover:bg-gray-800">
                                Login
                              </Button>
                            </Link>
                            <Link href="/register" className="block w-full">
                              <Button variant="outline" className="w-full text-white border-gray-700 hover:bg-gray-800">
                                Register
                              </Button>
                            </Link>
                          </>
                        ) : (
                          <>
                            <div className="text-sm font-semibold text-gray-300 px-2 py-1">{user.email}</div>
                            <Button
                              variant="outline"
                              className="w-full text-white border-gray-700 hover:bg-gray-800"
                              onClick={() => {
                                logout()
                                setIsMenuOpen(false)
                              }}
                            >
                              Logout
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

