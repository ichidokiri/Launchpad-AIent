"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { Wallet, User } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export function SiteHeader() {
  const { user, logout } = useAuth();
  const { address: walletAddress, isConnected: isWalletConnected } =
    useAccount();

  // Protected navigation items that require authentication
  const protectedNavItems = [
    { href: "/create", label: "Create" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/tradegpt", label: "TradeGPT" },
  ];

  // Public navigation items
  const publicNavItems = [{ href: "/", label: "Market" }];

  const { openConnectModal } = useConnectModal();

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
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground/80"
              >
                {item.label}
              </Link>
            ))}
            {/* Only show protected nav items when logged in */}
            {user &&
              protectedNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-foreground/80"
                >
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
              <Button
                variant="outline"
                size="sm"
                onClick={openConnectModal}
                className="hidden sm:inline-flex"
              >
                <Wallet className="mr-2 h-4 w-4" />
                {isWalletConnected && walletAddress
                  ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4)
                  : "Connect Wallet"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
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
                      e.preventDefault();
                      handleLogout();
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
  );
}
