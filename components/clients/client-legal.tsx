"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Calendar, Edit, Trash2 } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/loading-spinner"
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
import { Label } from "@/components/ui/label"

interface ClientLegalProps {
  clientId: string
}

export function ClientLegal({ clientId }: ClientLegalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [legalData, setLegalData] = useState({
    status: "None",
    probationOfficer: {
      name: "",
      phone: "",
      email: "",
    },
    courtDates: [],
    legalDocuments: [],
    legalNotes: [],
  })
  const [usingMockData, setUsingMockData] = useState(false)

  // Status editing
  const [editingStatus, setEditingStatus] = useState(false)
  const [statusForm, setStatusForm] = useState({
    status: "",
    officerName: "",
    officerPhone: "",
    officerEmail: "",
  })

  // Court date editing
  const [editingCourtDate, setEditingCourtDate] = useState(null)
  const [isAddingCourtDate, setIsAddingCourtDate] = useState(false)
  const [courtDateForm, setCourtDateForm] = useState({
    date: "",
    time: "",
    location: "",
    judge: "",
    purpose: "",
    notes: "",
  })

  // Legal note editing
  const [editingLegalNote, setEditingLegalNote] = useState(null)
  const [isAddingLegalNote, setIsAddingLegalNote] = useState(false)
  const [legalNoteForm, setLegalNoteForm] = useState({
    date: "",
    author: "",
    content: "",
  })

  // Document editing
  const [editingDocument, setEditingDocument] = useState(null)
  const [isAddingDocument, setIsAddingDocument] = useState(false)
  const [documentForm, setDocumentForm] = useState({
    title: "",
    dateUploaded: "",
    uploadedBy: "",
    type: "",
  })

  // Delete confirmation
  const [deleteType, setDeleteType] = useState("")
  const [deleteId, setDeleteId] = useState("")
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

  useEffect(() => {
    fetchLegalData()
  }, [clientId])

  const fetchLegalData = async () => {
    setLoading(true)
    try {
      const supabase = createClientSupabaseClient()

      // Try to fetch from client_legal table
      const { data, error } = await supabase.from("client_legal").select("*").eq("client_id", clientId).single()

      if (error) {
        // Check if the error is because the table doesn't exist
        if (error.message.includes("does not exist") || error.message.includes("relation") || error.code === "42P01") {
          console.log("client_legal table doesn't exist, using mock data")
          throw new Error("client_legal table doesn't exist")
        }
        throw error
      }

      if (data) {
        // Parse JSON fields if they're stored as strings
        const courtDates = typeof data.court_dates === "string" ? JSON.parse(data.court_dates) : data.court_dates || []

        const legalDocuments =
          typeof data.legal_documents === "string" ? JSON.parse(data.legal_documents) : data.legal_documents || []

        const legalNotes = typeof data.legal_notes === "string" ? JSON.parse(data.legal_notes) : data.legal_notes || []

        const probationOfficer =
          typeof data.probation_officer === "string"
            ? JSON.parse(data.probation_officer)
            : data.probation_officer || { name: "", phone: "", email: "" }

        setLegalData({
          status: data.legal_status || "None",
          probationOfficer: probationOfficer,
          courtDates: courtDates,
          legalDocuments: legalDocuments,
          legalNotes: legalNotes,
        })
        setUsingMockData(false)
      }
    } catch (error) {
      console.log("Using mock legal data")
      // Fall back to mock data without showing an error
      setLegalData({
        status: "Probation",
        probationOfficer: {
          name: "Officer James Wilson",
          phone: "(555) 234-5678",
          email: "jwilson@probation.gov",
        },
        courtDates: [
          {
            id: "1",
            date: "2023-07-15",
            time: "10:00 AM",
            location: "Phoenix Municipal Court",
            judge: "Judge Martinez",
            purpose: "Status Hearing",
            notes: "Bring treatment progress report",
          },
        ],
        legalDocuments: [
          {
            id: "1",
            title: "Probation Terms",
            dateUploaded: "2023-01-18",
            uploadedBy: "Admin Staff",
            type: "PDF",
          },
          {
            id: "2",
            title: "Court Order for Treatment",
            dateUploaded: "2023-01-20",
            uploadedBy: "Admin Staff",
            type: "PDF",
          },
        ],
        legalNotes: [
          {
            id: "1",
            date: "2023-04-10",
            author: "Case Manager",
            content: "Client met with probation officer. Officer reports client is in compliance with all terms.",
          },
          {
            id: "2",
            date: "2023-03-15",
            author: "Legal Liaison",
            content: "Submitted treatment progress report to court. Judge satisfied with progress.",
          },
        ],
      })
      setUsingMockData(true)
    } finally {
      setLoading(false)
    }
  }

  const saveLegalData = async (updatedData) => {
    try {
      if (!usingMockData) {
        const supabase = createClientSupabaseClient()

        // Check if record exists
        const { data: existingData, error: checkError } = await supabase
          .from("client_legal")
          .select("id")
          .eq("client_id", clientId)
          .maybeSingle()

        if (checkError) {
          throw checkError
        }

        // Convert objects to JSON strings if needed
        const dataToSave = {
          ...updatedData,
          client_id: clientId,
          legal_status: updatedData.status,
          probation_officer:
            typeof updatedData.probationOfficer === "object"
              ? updatedData.probationOfficer
              : JSON.parse(updatedData.probationOfficer),
          court_dates:
            typeof updatedData.courtDates === "object" ? updatedData.courtDates : JSON.parse(updatedData.courtDates),
          legal_documents:
            typeof updatedData.legalDocuments === "object"
              ? updatedData.legalDocuments
              : JSON.parse(updatedData.legalDocuments),
          legal_notes:
            typeof updatedData.legalNotes === "object" ? updatedData.legalNotes : JSON.parse(updatedData.legalNotes),
        }

        if (existingData) {
          // Update existing record
          const { error } = await supabase
            .from("client_legal")
            .update({
              ...dataToSave,
              updated_at: new Date().toISOString(),
            })
            .eq("client_id", clientId)

          if (error) throw error
        } else {
          // Insert new record
          const { error } = await supabase.from("client_legal").insert([
            {
              ...dataToSave,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])

          if (error) throw error
        }
      }

      // Update local state
      setLegalData({
        ...legalData,
        ...updatedData,
      })

      toast({
        title: "Legal information updated",
        description: "The legal information has been successfully updated.",
      })

      return true
    } catch (error) {
      console.error("Error saving legal data:", error)

      // If we're using mock data, still update the UI
      if (usingMockData) {
        setLegalData({
          ...legalData,
          ...updatedData,
        })

        toast({
          title: "Mock data updated",
          description: "The legal information has been updated in the UI (using mock data).",
        })

        return true
      } else {
        toast({
          title: "Error",
          description: "Failed to update legal information. Please try again.",
          variant: "destructive",
        })
        return false
      }
    }
  }

  // Status handlers
  const handleEditStatus = () => {
    setStatusForm({
      status: legalData.status,
      officerName: legalData.probationOfficer?.name || "",
      officerPhone: legalData.probationOfficer?.phone || "",
      officerEmail: legalData.probationOfficer?.email || "",
    })
    setEditingStatus(true)
  }

  const handleSaveStatus = async () => {
    const updatedData = {
      status: statusForm.status,
      probationOfficer: {
        name: statusForm.officerName,
        phone: statusForm.officerPhone,
        email: statusForm.officerEmail,
      },
    }

    const success = await saveLegalData(updatedData)
    if (success) {
      setEditingStatus(false)
    }
  }

  // Court date handlers
  const handleAddCourtDate = () => {
    setCourtDateForm({
      date: "",
      time: "",
      location: "",
      judge: "",
      purpose: "",
      notes: "",
    })
    setIsAddingCourtDate(true)
  }

  const handleEditCourtDate = (courtDate) => {
    setCourtDateForm({
      date: courtDate.date,
      time: courtDate.time,
      location: courtDate.location,
      judge: courtDate.judge,
      purpose: courtDate.purpose,
      notes: courtDate.notes,
    })
    setEditingCourtDate(courtDate.id)
  }

  const handleSaveCourtDate = async () => {
    const generateId = () => Math.random().toString(36).substring(2, 15)

    let updatedCourtDates
    if (editingCourtDate) {
      // Update existing court date
      updatedCourtDates = legalData.courtDates.map((date) =>
        date.id === editingCourtDate ? { id: date.id, ...courtDateForm } : date,
      )
    } else {
      // Add new court date
      updatedCourtDates = [...legalData.courtDates, { id: generateId(), ...courtDateForm }]
    }

    const success = await saveLegalData({ courtDates: updatedCourtDates })
    if (success) {
      setIsAddingCourtDate(false)
      setEditingCourtDate(null)
    }
  }

  // Legal note handlers
  const handleAddLegalNote = () => {
    const today = new Date().toISOString().split("T")[0]
    setLegalNoteForm({
      date: today,
      author: "Current User",
      content: "",
    })
    setIsAddingLegalNote(true)
  }

  const handleEditLegalNote = (note) => {
    setLegalNoteForm({
      date: note.date,
      author: note.author,
      content: note.content,
    })
    setEditingLegalNote(note.id)
  }

  const handleSaveLegalNote = async () => {
    const generateId = () => Math.random().toString(36).substring(2, 15)

    let updatedLegalNotes
    if (editingLegalNote) {
      // Update existing note
      updatedLegalNotes = legalData.legalNotes.map((note) =>
        note.id === editingLegalNote ? { id: note.id, ...legalNoteForm } : note,
      )
    } else {
      // Add new note
      updatedLegalNotes = [...legalData.legalNotes, { id: generateId(), ...legalNoteForm }]
    }

    const success = await saveLegalData({ legalNotes: updatedLegalNotes })
    if (success) {
      setIsAddingLegalNote(false)
      setEditingLegalNote(null)
    }
  }

  // Document handlers
  const handleAddDocument = () => {
    const today = new Date().toISOString().split("T")[0]
    setDocumentForm({
      title: "",
      dateUploaded: today,
      uploadedBy: "Current User",
      type: "PDF",
    })
    setIsAddingDocument(true)
  }

  const handleEditDocument = (document) => {
    setDocumentForm({
      title: document.title,
      dateUploaded: document.dateUploaded,
      uploadedBy: document.uploadedBy,
      type: document.type,
    })
    setEditingDocument(document.id)
  }

  const handleSaveDocument = async () => {
    const generateId = () => Math.random().toString(36).substring(2, 15)

    let updatedDocuments
    if (editingDocument) {
      // Update existing document
      updatedDocuments = legalData.legalDocuments.map((doc) =>
        doc.id === editingDocument ? { id: doc.id, ...documentForm } : doc,
      )
    } else {
      // Add new document
      updatedDocuments = [...legalData.legalDocuments, { id: generateId(), ...documentForm }]
    }

    const success = await saveLegalData({ legalDocuments: updatedDocuments })
    if (success) {
      setIsAddingDocument(false)
      setEditingDocument(null)
    }
  }

  // Delete handlers
  const confirmDelete = (type, id) => {
    setDeleteType(type)
    setDeleteId(id)
    setIsDeleteAlertOpen(true)
  }

  const handleDelete = async () => {
    try {
      const updatedData = { ...legalData }

      if (deleteType === "courtDate") {
        updatedData.courtDates = legalData.courtDates.filter((date) => date.id !== deleteId)
      } else if (deleteType === "document") {
        updatedData.legalDocuments = legalData.legalDocuments.filter((doc) => doc.id !== deleteId)
      } else if (deleteType === "note") {
        updatedData.legalNotes = legalData.legalNotes.filter((note) => note.id !== deleteId)
      }

      const success = await saveLegalData(updatedData)
      if (success) {
        setIsDeleteAlertOpen(false)
        toast({
          title: "Item deleted",
          description: `The ${deleteType} has been successfully deleted.`,
        })
      }
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error)
      toast({
        title: "Error",
        description: `Failed to delete ${deleteType}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const hasLegalData =
    legalData.status !== "None" ||
    legalData.courtDates.length > 0 ||
    legalData.legalDocuments.length > 0 ||
    legalData.legalNotes.length > 0

  if (loading) {
    return <LoadingSpinner />
  }

  if (!hasLegalData) {
    return (
      <EmptyState
        title="No legal information"
        description="No legal information has been recorded for this client yet."
        action={
          <Button onClick={handleEditStatus}>
            <Plus className="mr-2 h-4 w-4" />
            Add Legal Information
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Legal Information</h3>
      </div>

      {usingMockData && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-md mb-4">
          <p className="text-sm">
            Using mock data for demonstration. Connect to Supabase to enable full functionality.
          </p>
        </div>
      )}

      {/* Legal Status */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Legal Status</CardTitle>
            {!editingStatus && (
              <Button variant="ghost" size="sm" onClick={handleEditStatus}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editingStatus ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="legal-status">Current Status</Label>
                <Select
                  value={statusForm.status}
                  onValueChange={(value) => setStatusForm({ ...statusForm, status: value })}
                >
                  <SelectTrigger id="legal-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Probation">Probation</SelectItem>
                    <SelectItem value="Parole">Parole</SelectItem>
                    <SelectItem value="Court-Ordered Treatment">Court-Ordered Treatment</SelectItem>
                    <SelectItem value="Pending Case">Pending Case</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {statusForm.status === "Probation" && (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Probation Officer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="officer-name">Officer Name</Label>
                      <Input
                        id="officer-name"
                        value={statusForm.officerName}
                        onChange={(e) => setStatusForm({ ...statusForm, officerName: e.target.value })}
                        placeholder="Officer's name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="officer-phone">Phone Number</Label>
                      <Input
                        id="officer-phone"
                        value={statusForm.officerPhone}
                        onChange={(e) => setStatusForm({ ...statusForm, officerPhone: e.target.value })}
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="officer-email">Email</Label>
                      <Input
                        id="officer-email"
                        type="email"
                        value={statusForm.officerEmail}
                        onChange={(e) => setStatusForm({ ...statusForm, officerEmail: e.target.value })}
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingStatus(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveStatus}>Save</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="font-medium">Current Status</p>
                <p>{legalData.status}</p>
              </div>

              {legalData.status === "Probation" && legalData.probationOfficer && (
                <div>
                  <p className="font-medium">Probation Officer</p>
                  <p>{legalData.probationOfficer.name}</p>
                  <p className="text-sm text-muted-foreground">{legalData.probationOfficer.phone}</p>
                  <p className="text-sm text-muted-foreground">{legalData.probationOfficer.email}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Court Dates */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Upcoming Court Dates</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleAddCourtDate}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingCourtDate || editingCourtDate ? (
            <div className="border rounded-md p-4 space-y-4">
              <h4 className="font-medium">{editingCourtDate ? "Edit Court Date" : "Add Court Date"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="court-date">Date</Label>
                  <Input
                    id="court-date"
                    type="date"
                    value={courtDateForm.date}
                    onChange={(e) => setCourtDateForm({ ...courtDateForm, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="court-time">Time</Label>
                  <Input
                    id="court-time"
                    value={courtDateForm.time}
                    onChange={(e) => setCourtDateForm({ ...courtDateForm, time: e.target.value })}
                    placeholder="e.g., 10:00 AM"
                  />
                </div>
                <div>
                  <Label htmlFor="court-location">Location</Label>
                  <Input
                    id="court-location"
                    value={courtDateForm.location}
                    onChange={(e) => setCourtDateForm({ ...courtDateForm, location: e.target.value })}
                    placeholder="Court location"
                  />
                </div>
                <div>
                  <Label htmlFor="court-judge">Judge</Label>
                  <Input
                    id="court-judge"
                    value={courtDateForm.judge}
                    onChange={(e) => setCourtDateForm({ ...courtDateForm, judge: e.target.value })}
                    placeholder="Judge's name"
                  />
                </div>
                <div>
                  <Label htmlFor="court-purpose">Purpose</Label>
                  <Input
                    id="court-purpose"
                    value={courtDateForm.purpose}
                    onChange={(e) => setCourtDateForm({ ...courtDateForm, purpose: e.target.value })}
                    placeholder="e.g., Status Hearing"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="court-notes">Notes</Label>
                  <Textarea
                    id="court-notes"
                    value={courtDateForm.notes}
                    onChange={(e) => setCourtDateForm({ ...courtDateForm, notes: e.target.value })}
                    placeholder="Additional notes"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingCourtDate(false)
                    setEditingCourtDate(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveCourtDate}>Save</Button>
              </div>
            </div>
          ) : legalData.courtDates.length > 0 ? (
            <div className="space-y-4">
              {legalData.courtDates.map((court) => (
                <div key={court.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className="bg-muted p-2 rounded-md">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{court.purpose}</h4>
                        <p className="text-sm">
                          {court.date} at {court.time}
                        </p>
                        <p className="text-sm text-muted-foreground">{court.location}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCourtDate(court)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => confirmDelete("courtDate", court.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>
                      <span className="font-medium">Judge:</span> {court.judge}
                    </p>
                    {court.notes && (
                      <p className="mt-1">
                        <span className="font-medium">Notes:</span> {court.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No upcoming court dates</p>
          )}
        </CardContent>
      </Card>

      {/* Legal Documents */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Legal Documents</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleAddDocument}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingDocument || editingDocument ? (
            <div className="border rounded-md p-4 space-y-4">
              <h4 className="font-medium">{editingDocument ? "Edit Document" : "Add Document"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="doc-title">Document Title</Label>
                  <Input
                    id="doc-title"
                    value={documentForm.title}
                    onChange={(e) => setDocumentForm({ ...documentForm, title: e.target.value })}
                    placeholder="Document title"
                  />
                </div>
                <div>
                  <Label htmlFor="doc-type">Document Type</Label>
                  <Select
                    value={documentForm.type}
                    onValueChange={(value) => setDocumentForm({ ...documentForm, type: value })}
                  >
                    <SelectTrigger id="doc-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="Word">Word</SelectItem>
                      <SelectItem value="Image">Image</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="doc-date">Date Uploaded</Label>
                  <Input
                    id="doc-date"
                    type="date"
                    value={documentForm.dateUploaded}
                    onChange={(e) => setDocumentForm({ ...documentForm, dateUploaded: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="doc-uploader">Uploaded By</Label>
                  <Input
                    id="doc-uploader"
                    value={documentForm.uploadedBy}
                    onChange={(e) => setDocumentForm({ ...documentForm, uploadedBy: e.target.value })}
                    placeholder="Name of uploader"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingDocument(false)
                    setEditingDocument(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveDocument}>Save</Button>
              </div>
            </div>
          ) : legalData.legalDocuments.length > 0 ? (
            <div className="space-y-2">
              {legalData.legalDocuments.map((doc) => (
                <div key={doc.id} className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded on {doc.dateUploaded} by {doc.uploadedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditDocument(doc)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => confirmDelete("document", doc.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No legal documents uploaded</p>
          )}
        </CardContent>
      </Card>

      {/* Legal Notes */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Legal Notes</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleAddLegalNote}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingLegalNote || editingLegalNote ? (
            <div className="border rounded-md p-4 space-y-4">
              <h4 className="font-medium">{editingLegalNote ? "Edit Note" : "Add Note"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="note-date">Date</Label>
                  <Input
                    id="note-date"
                    type="date"
                    value={legalNoteForm.date}
                    onChange={(e) => setLegalNoteForm({ ...legalNoteForm, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="note-author">Author</Label>
                  <Input
                    id="note-author"
                    value={legalNoteForm.author}
                    onChange={(e) => setLegalNoteForm({ ...legalNoteForm, author: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="note-content">Content</Label>
                  <Textarea
                    id="note-content"
                    value={legalNoteForm.content}
                    onChange={(e) => setLegalNoteForm({ ...legalNoteForm, content: e.target.value })}
                    placeholder="Note content"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingLegalNote(false)
                    setEditingLegalNote(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveLegalNote}>Save</Button>
              </div>
            </div>
          ) : legalData.legalNotes.length > 0 ? (
            <div className="space-y-4">
              {legalData.legalNotes.map((note) => (
                <div key={note.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{note.date}</p>
                    <div className="flex items-center">
                      <p className="text-sm text-muted-foreground mr-2">{note.author}</p>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditLegalNote(note)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => confirmDelete("note", note.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="mt-1 text-sm">{note.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No legal notes recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this {deleteType}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
