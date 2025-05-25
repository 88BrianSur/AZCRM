import type React from "react"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { PageTransition } from "@/components/layout/page-transition"
import { Toaster } from "@/components/ui/toaster"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <div className="mb-6">
        <Breadcrumb />
      </div>

      <PageTransition>{children}</PageTransition>

      <Toaster />
    </div>
  )
}
