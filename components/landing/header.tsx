'use client'

import Link from "next/link"
import { Leaf } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { signOut } from "@/app/actions/auth"

export function Header() {
  const { user } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 lg:px-16">
      <Link href="/" className="flex items-center gap-2">
        <Leaf className="h-7 w-7 text-primary" />
        <span className="font-serif text-2xl font-bold tracking-tight text-primary">
          krishiseva
        </span>
      </Link>
      <nav className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              href="/dashboard"
              className="rounded-2xl border border-primary/30 px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
            >
              Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-2xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-2xl border border-primary/30 px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-2xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
