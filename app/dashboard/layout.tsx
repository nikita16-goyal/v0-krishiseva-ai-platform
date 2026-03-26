'use client'

import React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-auto">
          <div className="flex-1 px-6 py-8 lg:px-10">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
