import type React from "react"
import { StickySidebar } from "@/components/layout/sticky-sidebar"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { PageTransition } from "@/components/layout/page-transition"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-background">
      <StickySidebar />

      <div className="md:pl-64">
        <main className="p-4 md:p-6">
          <div className="mb-6">
            <Breadcrumb />
          </div>

          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      <Toaster />
    </div>
  )
}
