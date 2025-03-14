"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Home, Settings, Users, ShoppingCart, Bot, BarChart, HelpCircle, Activity } from "lucide-react"

interface DashboardNavProps {
  items: {
    href: string
    title: string
    icon: keyof typeof icons
  }[]
}

const icons = {
  Home,
  Settings,
  Users,
  ShoppingCart,
  Bot,
  BarChart,
  HelpCircle,
  Activity,
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname()

  if (!items?.length) {
    return null
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = icons[item.icon]
        return (
          <Link
            key={index}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
              "justify-start",
            )}
          >
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            {item.title}
          </Link>
        )
      })}
      <Link
        href="/dashboard/diagnostics"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          pathname === "/dashboard/diagnostics" ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
          "justify-start",
        )}
      >
        <Activity className="mr-2 h-4 w-4" />
        Diagnostics
      </Link>
    </nav>
  )
}

