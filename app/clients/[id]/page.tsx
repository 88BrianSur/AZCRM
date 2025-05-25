"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { ClientNotes } from "@/components/clients/client-notes"
import { ClientMedical } from "@/components/clients/client-medical"
import { ClientLegal } from "@/components/clients/client-legal"
import { ClientInsurance } from "@/components/clients/client-insurance"
import { ClientEmergencyContacts } from "@/components/clients/client-emergency-contacts"
import { ClientDocuments } from "@/components/clients/client-documents"
import { EditClientDialog } from "@/components/clients/edit-client-dialog"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ClientProfile } from "@/components/clients/client-profile"

export default function ClientPage() {
  const params = useParams()
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchClient() {
      try {
        const supabase = createClientSupabaseClient()
        const { data, error } = await supabase.from("clients").select("*").eq("id", params.id).single()

        if (error) {
          console.error("Error fetching client:", error)
          return
        }

        setClient(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchClient()
    }
  }, [params.id])

  const handleClientUpdate = (updatedClient) => {
    setClient(updatedClient)
    router.refresh()
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!client) {
    return <div>Client not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {client.first_name} {client.last_name}
        </h1>
        <Button onClick={() => setIsEditOpen(true)}>Edit Client</Button>
      </div>

      <ClientProfile client={client} onClientUpdated={handleClientUpdate} />

      <Tabs defaultValue="notes">
        <TabsList className="grid grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="notes">
          <ClientNotes clientId={client.id} />
        </TabsContent>
        <TabsContent value="medical">
          <ClientMedical clientId={client.id} />
        </TabsContent>
        <TabsContent value="legal">
          <ClientLegal clientId={client.id} />
        </TabsContent>
        <TabsContent value="insurance">
          <ClientInsurance clientId={client.id} />
        </TabsContent>
        <TabsContent value="emergency">
          <ClientEmergencyContacts clientId={client.id} />
        </TabsContent>
        <TabsContent value="documents">
          <ClientDocuments clientId={client.id} />
        </TabsContent>
      </Tabs>

      <EditClientDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        client={client}
        onClientUpdated={handleClientUpdate}
      />
    </div>
  )
}
