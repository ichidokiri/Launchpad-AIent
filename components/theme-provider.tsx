"use client"

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemeProviderProps } from "next-themes"
import type { ReactNode } from "react"

// Use the correct type from next-themes
type ThemeProviderProps = {
  children: ReactNode
} & Omit<NextThemeProviderProps, "children">

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

