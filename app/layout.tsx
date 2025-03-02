import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "./context/AuthContext"
import { StickyNav } from "@/components/sticky-nav"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Background } from "@/components/background"
import { Toaster } from "react-hot-toast"
import "./globals.css"

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <title>AIent - AI Agent Marketplace</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        </head>
        <body className="bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <AuthProvider>
                <TooltipProvider delayDuration={0}>
                    <Background>
                        <div className="relative min-h-screen flex flex-col">
                            <StickyNav />
                            <main className="flex-1">{children}</main>
                        </div>
                    </Background>
                </TooltipProvider>
            </AuthProvider>
        </ThemeProvider>
        <Toaster
            position="top-center"
            toastOptions={{
                duration: 4000,
                style: {
                    background: "var(--background)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                },
                success: {
                    style: {
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                    },
                },
                error: {
                    style: {
                        background: "var(--destructive)",
                        color: "var(--destructive-foreground)",
                    },
                },
            }}
        />
        </body>
        </html>
    )
}

