"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AddNoteDialog } from "@/components/notes/add-note-dialog"
import { EditNoteDialog } from "@/components/notes/edit-note-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getNotesByClientId } from "@/lib/db"

interface Note {
  id: string
  clientId: string
  title: string
  content: string
  createdAt: string
  authorId?: string
  createdBy: string
  type: string
}

interface ClientNotesProps {
  clientId: string
}

export function ClientNotes({ clientId }: ClientNotesProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)
  const [isEditNoteOpen, setIsEditNoteOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [expandedNotes, setExpandedNotes] = useState<string[]>([])
  const { toast } = useToast()

  // Always use mock data since no tables exist
  const usingMockData = true

  useEffect(() => {
    if (clientId) {
      fetchNotes()
    }
  }, [clientId])

  const fetchNotes = async () => {
    setLoading(true)
    try {
      // Since we know no tables exist, directly use mock data
      const mockNotes = await getNotesByClientId(clientId)
      setNotes(mockNotes)
    } catch (error) {
      console.error("Error fetching notes:", error)
      setNotes([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = (newNote: Note) => {
    setNotes([newNote, ...notes])
    toast({
      title: "Note added",
      description: "The note has been successfully added to mock data.",
    })
  }

  const handleEditNote = (updatedNote: Note) => {
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)))
    setSelectedNote(null)
    setIsEditNoteOpen(false)
    toast({
      title: "Note updated",
      description: "The note has been successfully updated in mock data.",
    })
  }

  const handleDeleteNote = async () => {
    if (!selectedNote) return

    try {
      // Only update local state since we're using mock data
      setNotes(notes.filter((note) => note.id !== selectedNote.id))
      setSelectedNote(null)
      setIsDeleteAlertOpen(false)

      toast({
        title: "Note deleted",
        description: "The note has been successfully deleted from mock data.",
      })
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleExpand = (noteId: string) => {
    setExpandedNotes((prev) => (prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId]))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Client Notes</h3>
        <Button onClick={() => setIsAddNoteOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-md mb-4">
        <p className="text-sm">
          Using mock data for demonstration. Database tables for notes have not been created yet.
        </p>
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="py-6">
            <div className="text-center">
              <p className="text-muted-foreground">No notes found for this client.</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsAddNoteOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Note
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => {
            const isExpanded = expandedNotes.includes(note.id)
            return (
              <Card key={note.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{note.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
                            {note.type}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(note.createdAt)}</span>
                          <span className="mx-2">•</span>
                          <span>{note.createdBy}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm" onClick={() => toggleExpand(note.id)}>
                          {isExpanded ? "Collapse" : "Expand"}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedNote(note)
                                setIsEditNoteOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Note
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedNote(note)
                                setIsDeleteAlertOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Note
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className={`mt-2 ${isExpanded ? "" : "line-clamp-2"}`}>
                      <p className="text-sm whitespace-pre-line">{note.content}</p>
                    </div>
                  </div>
                  {!isExpanded && note.content.length > 150 && (
                    <div className="px-4 pb-3">
                      <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => toggleExpand(note.id)}>
                        Read more
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <AddNoteDialog
        open={isAddNoteOpen}
        onOpenChange={setIsAddNoteOpen}
        clientId={clientId}
        onNoteAdded={handleAddNote}
        usingMockData={true}
      />

      {selectedNote && (
        <EditNoteDialog
          open={isEditNoteOpen}
          onOpenChange={setIsEditNoteOpen}
          note={selectedNote}
          onNoteUpdated={handleEditNote}
          usingMockData={true}
        />
      )}

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
