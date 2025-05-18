"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddNoteDialog } from "@/components/notes/add-note-dialog"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { LoadingSpinner } from "@/components/loading-spinner"

export function ClientNotes({ clientId }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)

  useEffect(() => {
    async function fetchNotes() {
      try {
        const supabase = createClientSupabaseClient()

        // Fetch notes without trying to join with users table
        const { data, error } = await supabase
          .from("progress_notes") // Using progress_notes instead of notes
          .select("*")
          .eq("client_id", clientId)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching notes:", error)
          return
        }

        // If we have notes, fetch the author information separately
        if (data && data.length > 0) {
          // Get unique author IDs
          const authorIds = [...new Set(data.map((note) => note.author_id))]

          // Fetch author information
          const { data: authors, error: authorsError } = await supabase
            .from("users")
            .select("id, full_name")
            .in("id", authorIds)

          if (authorsError) {
            console.error("Error fetching authors:", authorsError)
          }

          // Create a map of author IDs to names
          const authorMap = {}
          if (authors) {
            authors.forEach((author) => {
              authorMap[author.id] = author.full_name
            })
          }

          // Add author names to notes
          const notesWithAuthors = data.map((note) => ({
            ...note,
            author_name: authorMap[note.author_id] || "Unknown",
          }))

          setNotes(notesWithAuthors)
        } else {
          setNotes([])
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    if (clientId) {
      fetchNotes()
    }
  }, [clientId])

  const handleNoteAdded = (newNote) => {
    // Fetch the author name for the new note
    async function fetchAuthorName() {
      try {
        const supabase = createClientSupabaseClient()
        const { data, error } = await supabase.from("users").select("full_name").eq("id", newNote.author_id).single()

        if (error) {
          console.error("Error fetching author name:", error)
          return
        }

        const noteWithAuthor = {
          ...newNote,
          author_name: data?.full_name || "Unknown",
        }

        setNotes([noteWithAuthor, ...notes])
      } catch (error) {
        console.error("Error:", error)
        // Still add the note even if we couldn't get the author name
        setNotes([{ ...newNote, author_name: "Unknown" }, ...notes])
      }
    }

    fetchAuthorName()
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Notes</h2>
        <Button onClick={() => setIsAddNoteOpen(true)}>Add Note</Button>
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No notes found for this client.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <CardTitle>{note.title}</CardTitle>
                <CardDescription>
                  {note.author_name} - {new Date(note.created_at).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{note.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddNoteDialog
        open={isAddNoteOpen}
        onOpenChange={setIsAddNoteOpen}
        clientId={clientId}
        onNoteAdded={handleNoteAdded}
      />
    </div>
  )
}
