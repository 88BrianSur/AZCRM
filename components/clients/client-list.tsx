"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AddClientDialog } from "@/components/clients/add-client-dialog"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function ClientList({ clients = [] }) {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [clientsList, setClientsList] = useState(clients)
  const { toast } = useToast()

  const handleDeleteClient = async (id) => {
    try {
      const supabase = createClientSupabaseClient()
      const { error } = await supabase.from("clients").delete().eq("id", id)

      if (error) {
        throw error
      }

      setClientsList(clientsList.filter((client) => client.id !== id))
      toast({
        title: "Client deleted",
        description: "The client has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting client:", error)
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddClient = (newClient) => {
    setClientsList([...clientsList, newClient])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Client List</h2>
        <Button onClick={() => setIsAddClientOpen(true)}>Add Client</Button>
      </div>

      {clientsList.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No clients found. Add a client to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clientsList.map((client) => (
            <Card key={client.id}>
              <CardHeader>
                <CardTitle>
                  {client.first_name} {client.last_name}
                </CardTitle>
                <CardDescription>
                  {client.email}
                  <br />
                  {client.phone}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Admission Date: {new Date(client.admission_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">Status: {client.status}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/clients/${client.id}`}>View Details</Link>
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteClient(client.id)}>
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AddClientDialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen} onClientAdded={handleAddClient} />
    </div>
  )
}
