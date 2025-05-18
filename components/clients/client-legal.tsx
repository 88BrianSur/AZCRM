"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Calendar } from "lucide-react"
import { EmptyState } from "@/components/empty-state"

interface ClientLegalProps {
  clientId: string
}

export function ClientLegal({ clientId }: ClientLegalProps) {
  // Mock data - in a real app, this would come from an API or database
  const legalData = {
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
  }

  const hasLegalData =
    legalData.status !== "None" ||
    legalData.courtDates.length > 0 ||
    legalData.legalDocuments.length > 0 ||
    legalData.legalNotes.length > 0

  if (!hasLegalData) {
    return (
      <EmptyState
        title="No legal information"
        description="No legal information has been recorded for this client yet."
        action={
          <Button>
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
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Record
        </Button>
      </div>

      {/* Legal Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Legal Status</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Court Dates */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Upcoming Court Dates</CardTitle>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add court date</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {legalData.courtDates.length > 0 ? (
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
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
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
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Upload document</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {legalData.legalDocuments.length > 0 ? (
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
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
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
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add note</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {legalData.legalNotes.length > 0 ? (
            <div className="space-y-4">
              {legalData.legalNotes.map((note) => (
                <div key={note.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{note.date}</p>
                    <p className="text-sm text-muted-foreground">{note.author}</p>
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
    </div>
  )
}
