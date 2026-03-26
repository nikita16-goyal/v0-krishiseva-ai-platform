"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Upload,
  Sprout,
  CloudSun,
  History,
  Leaf,
  LogOut,
} from "lucide-react"
import { signOut } from "@/app/actions/auth"
import { useState } from "react"
import { useRouter } from "next/navigation"

function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out failed:", error)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />
      {isLoading ? "Signing Out..." : "Sign Out"}
    </button>
  )
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/upload", label: "Upload Data", icon: Upload },
  { href: "/dashboard/recommendations", label: "Crop Recommendations", icon: Sprout },
  { href: "/dashboard/analytics", label: "Weather & Soil", icon: CloudSun },
  { href: "/dashboard/history", label: "History", icon: History },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6">
        <Leaf className="h-6 w-6 text-sidebar-primary" />
        <span className="font-serif text-xl font-bold text-sidebar-foreground">
          krishiseva
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border px-3 py-4 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4" />
          Back to Home
        </Link>
        <SignOutButton />
      </div>
    </aside>
  )
}
