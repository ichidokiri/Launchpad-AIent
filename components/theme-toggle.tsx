"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
                aria-label="Toggle theme"
            >
                <div className="h-5 w-5" />
            </button>
        )
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-300" /> : <Moon className="h-5 w-5 text-gray-800" />}
        </button>
    )
}

