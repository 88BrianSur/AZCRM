"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function ClientPage() {
  const params = useParams()
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)

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

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>Basic information about the client.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{client.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{client.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Admission Date</p>
              <p className="text-sm text-muted-foreground">{new Date(client.admission_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm text-muted-foreground">{client.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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

      <EditClientDialog open={isEditOpen} onOpenChange={setIsEditOpen} client={client} onClientUpdated={setClient} />
    </div>
  )
}
