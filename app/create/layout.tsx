import type { ReactNode } from "react"

export default function CreateAgentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative home-background">
      <div className="relative z-10">{children}</div>
    </div>
  )
}

