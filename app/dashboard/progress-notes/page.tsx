"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DateRangePicker } from "@/components/date-range-picker"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { SkeletonLoader } from "@/components/skeleton-loader"

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
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

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
    <div className="container mx-auto space-y-6">
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Select a client</option>
                    <option value="1">John Smith</option>
                    <option value="2">Maria Garcia</option>
                    <option value="3">Robert Johnson</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Note Type</label>
                  <select className="w-full p-2 border rounded-md">
                    {noteTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Note Content</label>
                <textarea
                  className="w-full p-2 border rounded-md min-h-[150px]"
                  placeholder="Enter note content here..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    handleAddNote({ client: "John Smith", type: "Individual Session", content: "Sample note" })
                  }
                >
                  Save Note
                </Button>
              </div>
            </div>
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

          {loading ? (
            <SkeletonLoader className="h-[500px]" />
          ) : (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">
                          {
                            ["Individual Session", "Group Session", "Medical", "Case Management", "Incident Report"][
                              i % 5
                            ]
                          }
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Client:{" "}
                          {["John Smith", "Maria Garcia", "Robert Johnson", "Sarah Williams", "Michael Brown"][i - 1]}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(2023, 5 + i, i * 3).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="mt-4 text-sm">
                      {
                        [
                          "Client participated actively in the session. Discussed coping strategies for cravings and made progress on identifying triggers.",
                          "Group discussion on relapse prevention. Client shared personal experiences and received positive feedback from peers.",
                          "Medication review completed. No adverse reactions reported. Continuing current regimen.",
                          "Reviewed housing situation and employment opportunities. Created action plan for job applications.",
                          "Client reported difficulty with roommate. Mediated discussion and established new house rules.",
                        ][i - 1]
                      }
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Author:{" "}
                        {
                          [
                            "Dr. Williams",
                            "Counselor Johnson",
                            "Nurse Garcia",
                            "Case Manager Smith",
                            "Staff Member Brown",
                          ][i - 1]
                        }
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
