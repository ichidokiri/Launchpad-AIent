import type { ReactNode } from "react"
import { StickyNav } from "@/components/sticky-nav"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StickyNav />
      <main>{children}</main>
    </>
  )
}

