"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus } from "lucide-react"
import { CreateNoteForm } from "@/components/notes/create-note-form"
import { NotesList } from "@/components/notes/notes-list"
import { useToast } from "@/hooks/use-toast"

export default function ClientNotesPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const clientId = params.id as string
  const [isAddingNote, setIsAddingNote] = useState(false)

  // Mock client data - in a real app, this would come from an API or database
  const clientName = "John Smith"

  const handleAddNote = (noteData: any) => {
    // In a real app, this would add the note to the database
    console.log("Adding note:", noteData)
    setIsAddingNote(false)
    toast({
      title: "Note added",
      description: "The note has been added successfully.",
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title={`Notes for ${clientName}`}
        description="View and manage client notes"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => router.push(`/clients/${clientId}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Client
            </Button>
            <Button onClick={() => setIsAddingNote(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </div>
        }
      />

      {isAddingNote ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Note</CardTitle>
            <CardDescription>Create a new note for {clientName}</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateNoteForm clientId={clientId} onSubmit={handleAddNote} onCancel={() => setIsAddingNote(false)} />
          </CardContent>
        </Card>
      ) : (
        <NotesList clientId={clientId} />
      )}
    </div>
  )
}
