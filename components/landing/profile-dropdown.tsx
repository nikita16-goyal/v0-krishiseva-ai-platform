'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, LogOut } from 'lucide-react'
import { signOut } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

interface ProfileDropdownProps {
  email?: string
}

export function ProfileDropdown({ email }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-2xl border border-primary/30 px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
      >
        <span className="hidden sm:inline">Profile</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card shadow-lg">
          <div className="border-b border-border px-4 py-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Account</p>
            <p className="mt-2 text-sm font-medium text-foreground break-all">{email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
