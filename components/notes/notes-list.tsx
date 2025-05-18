"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Note {
  id: string
  clientId: string
  type: string
  title: string
  content: string
  createdBy: string
  createdAt: string
}

interface NotesListProps {
  clientId?: string
  notes?: Note[]
  searchQuery?: string
  typeFilter?: string[]
  dateRange?: {
    from: Date | undefined
    to: Date | undefined
  }
  onEdit?: (note: Note) => void
  onDelete?: (noteId: string) => void
}

export function NotesList({
  clientId,
  notes: providedNotes,
  searchQuery = "",
  typeFilter = [],
  dateRange,
  onEdit,
  onDelete,
}: NotesListProps) {
  const [expandedNotes, setExpandedNotes] = useState<string[]>([])

  // Mock data for when no notes are provided
  const mockNotes: Note[] = [
    {
      id: "1",
      clientId: "client-1",
      type: "Individual Session",
      title: "Initial Assessment",
      content:
        "Client showed good engagement during the initial assessment. Discussed treatment goals and expectations. Client expressed motivation to maintain sobriety and work on underlying issues.",
      createdBy: "Dr. Sarah Johnson",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      clientId: "client-2",
      type: "Group Session",
      title: "Relapse Prevention Group",
      content:
        "Client participated actively in today's group session on relapse prevention strategies. Shared personal triggers and coping mechanisms. Demonstrated good insight into personal risk factors.",
      createdBy: "Michael Williams, LCSW",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      clientId: "client-1",
      type: "Medical",
      title: "Medication Review",
      content:
        "Reviewed current medications and side effects. Client reports taking medications as prescribed with no adverse effects. Vital signs stable. No changes to medication regimen at this time.",
      createdBy: "Dr. Robert Chen",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  // Use provided notes or mock data
  const notes = providedNotes || mockNotes

  // Apply filters if they exist
  const filteredNotes = notes.filter((note) => {
    // Filter by search query
    if (
      searchQuery &&
      !note.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !note.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by note type
    if (typeFilter.length > 0 && !typeFilter.includes(note.type)) {
      return false
    }

    // Filter by date range
    if (dateRange?.from || dateRange?.to) {
      const noteDate = new Date(note.createdAt)
      if (dateRange.from && noteDate < dateRange.from) {
        return false
      }
      if (dateRange.to) {
        const endDate = new Date(dateRange.to)
        endDate.setHours(23, 59, 59, 999)
        if (noteDate > endDate) {
          return false
        }
      }
    }

    // Filter by client ID if provided
    if (clientId && note.clientId !== clientId) {
      return false
    }

    return true
  })

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

  const handleEdit = (note: Note) => {
    if (onEdit) {
      onEdit(note)
    }
  }

  const handleDelete = (noteId: string) => {
    if (onDelete) {
      onDelete(noteId)
    }
  }

  return (
    <div className="space-y-4">
      {filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-muted p-3 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-muted-foreground"
                >
                  <path d="M14 4h6v6h-6z"></path>
                  <path d="M4 14h6v6H4z"></path>
                  <path d="M17 17h3v3h-3z"></path>
                  <path d="M4 4h6v6H4z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold">No notes found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery || typeFilter.length > 0 || dateRange?.from || dateRange?.to
                  ? "Try adjusting your filters to see more results."
                  : "Start by adding a new note."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        filteredNotes.map((note) => {
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
                          <DropdownMenuItem onClick={() => handleEdit(note)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Note
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(note.id)}>
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
        })
      )}
    </div>
  )
}
