"use client"

import { useEffect, useState } from "react"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/page-header"
import { ClientList } from "@/components/clients/client-list"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClients() {
      try {
        const supabase = createClientSupabaseClient()
        const { data, error } = await supabase.from("clients").select("*")

        if (error) {
          console.error("Error fetching clients:", error)
          return
        }

        setClients(data || [])
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader heading="Clients" text="Manage your clients and their information." />
      {loading ? <LoadingSpinner /> : <ClientList clients={clients} />}
    </div>
  )
}
