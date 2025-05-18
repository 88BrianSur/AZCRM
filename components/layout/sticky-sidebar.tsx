"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Users, FileText, Calendar, Award, UserPlus, Bell, Settings, Home, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Clients",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "Progress Notes",
    href: "/dashboard/progress-notes",
    icon: FileText,
  },
  {
    title: "Sobriety Tracker",
    href: "/dashboard/sobriety-tracker",
    icon: Award,
  },
  {
    title: "Staff Scheduling",
    href: "/dashboard/staff-scheduling",
    icon: Calendar,
  },
  {
    title: "Alumni Management",
    href: "/dashboard/alumni-management",
    icon: UserPlus,
  },
  {
    title: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Settings,
  },
]

export function StickySidebar() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const NavItems = () => (
    <div className="space-y-1">
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => isMobile && setIsOpen(false)}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </div>
  )

  // Mobile sidebar with sheet
  if (isMobile) {
    return (
      <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b bg-background px-4 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[280px] pr-0">
            <div className="px-2 py-6">
              <div className="mb-4 flex items-center justify-between px-4">
                <h2 className="text-lg font-semibold">AZ House CRM</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="px-2">
                  <NavItems />
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex-1 text-center">
          <h1 className="text-base font-semibold">AZ House CRM</h1>
        </div>
      </div>
    )
  }

  // Desktop sticky sidebar
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow border-r bg-background pt-5 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-5">
          <h2 className="text-lg font-semibold">AZ House CRM</h2>
        </div>
        <div className="flex-grow flex flex-col">
          <ScrollArea className="flex-1 px-3 py-2">
            <NavItems />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
