"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

// Map of path segments to display names
const pathMap: Record<string, string> = {
  dashboard: "Dashboard",
  clients: "Clients",
  "progress-notes": "Progress Notes",
  "sobriety-tracker": "Sobriety Tracker",
  "staff-scheduling": "Staff Scheduling",
  "alumni-management": "Alumni Management",
  alerts: "Alerts",
  admin: "Admin",
  notes: "Notes",
  settings: "Settings",
  new: "New",
}

interface BreadcrumbProps {
  className?: string
  clientName?: string
  alumniName?: string
  customItems?: { label: string; href?: string }[]
}

export function Breadcrumb({ className, clientName, alumniName, customItems }: BreadcrumbProps) {
  const pathname = usePathname()

  if (!pathname) return null

  // Split the pathname into segments
  const segments = pathname.split("/").filter(Boolean)

  // If we have custom items, use those instead
  if (customItems) {
    return (
      <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
        <Link href="/dashboard" className="flex items-center hover:text-foreground transition-colors">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4" />

        {customItems.map((item, index) => {
          const isLast = index === customItems.length - 1

          return (
            <div key={item.label} className="flex items-center">
              {item.href && !isLast ? (
                <>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-1" />
                </>
              ) : (
                <span className="font-medium text-foreground">{item.label}</span>
              )}
            </div>
          )
        })}
      </nav>
    )
  }

  // Build breadcrumb items
  const breadcrumbItems = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`
    let label = pathMap[segment] || segment

    // Handle client ID
    if (segments[0] === "clients" && index === 1 && clientName) {
      label = clientName
    }

    // Handle alumni ID
    if (segments[0] === "alumni-management" && index === 1 && alumniName) {
      label = alumniName
    }

    // Check if this is the last item
    const isLast = index === segments.length - 1

    return {
      label,
      path,
      isLast,
    }
  })

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      <Link href="/dashboard" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbItems.length > 0 && <ChevronRight className="h-4 w-4" />}

      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {!item.isLast ? (
            <>
              <Link href={item.path} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
            </>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
