"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, Command, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home", icon: Zap },
    { href: "/dashboard", label: "Command Center", icon: Command },
    { href: "/create", label: "Create", icon: Plus },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <Zap className="h-6 w-6 text-primary" />
            <div className="absolute inset-0 animate-pulse-glow blur-sm">
              <Zap className="h-6 w-6 text-primary" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight text-gradient">AGENTIC AI</span>
        </Link>

        <div className="flex items-center gap-6">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
