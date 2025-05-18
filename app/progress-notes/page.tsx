"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DateRangePicker } from "@/components/date-range-picker"
import { CreateNoteForm } from "@/components/notes/create-note-form"
import { NotesList } from "@/components/notes/notes-list"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export default function ProgressNotesPage() {
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const { toast } = useToast()

  const noteTypes = ["Individual Session", "Group Session", "Medical", "Case Management", "Incident Report"]

  const handleTypeToggle = (type: string) => {
    setTypeFilter((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

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
        title="Progress Notes"
        description="View and manage client progress notes"
        actions={
          <Button onClick={() => setIsAddingNote(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        }
      />

      {isAddingNote ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Note</CardTitle>
            <CardDescription>Create a new progress note</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateNoteForm onSubmit={handleAddNote} onCancel={() => setIsAddingNote(false)} />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative w-full md:w-96">
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <DateRangePicker value={dateRange} onChange={setDateRange} align="start" className="w-full sm:w-auto" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Note Type
                    {typeFilter.length > 0 && ` (${typeFilter.length})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {noteTypes.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={typeFilter.includes(type)}
                      onCheckedChange={() => handleTypeToggle(type)}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <NotesList searchQuery={searchQuery} typeFilter={typeFilter} dateRange={dateRange} />
        </>
      )}
    </div>
  )
}
