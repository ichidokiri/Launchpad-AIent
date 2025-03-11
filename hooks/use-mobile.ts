"use client"

import { useState, useEffect } from "react"

/**
 * A hook to detect if the current device is a mobile device
 * This is a simplified version to satisfy the sidebar.tsx dependency
 * @returns A boolean indicating if the current device is mobile
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if the screen width is mobile-sized
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // Standard mobile breakpoint
    }

    // Check on mount
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Clean up event listener
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

// Export the hook as both a named export and default export for compatibility
export default useIsMobile

