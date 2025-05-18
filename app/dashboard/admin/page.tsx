"use client"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function DashboardAdminRedirect() {
  useEffect(() => {
    redirect("/admin")
  }, [])

  return <div>Redirecting to admin panel...</div>
}
