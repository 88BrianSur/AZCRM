import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { getCurrentUser } from "@/lib/auth/mock-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AZ House Recovery CRM",
  description: "Client Management System for AZ House Recovery",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get current user for layout decisions
  const user = await getCurrentUser()

  // Determine if this is an auth page
  const isAuthPage =
    children.toString().includes("auth/login") ||
    children.toString().includes("auth/register") ||
    children.toString().includes("unauthorized")

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
