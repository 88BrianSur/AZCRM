"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Mail, Phone, AlertTriangle, User, Calendar, Briefcase, Clock } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { useRouter } from "next/navigation"
import { EditAlumniDialog } from "@/components/alumni/edit-alumni-dialog"
import { ViewAlumniDialog } from "@/components/alumni/view-alumni-dialog"
import { useToast } from "@/hooks/use-toast"
import { RecordContactDialog } from "@/components/alumni/record-contact-dialog"
import { UpdateSobrietyDialog } from "@/components/alumni/update-sobriety-dialog"
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

// Mock alumni data - in a real app, this would come from an API or database
export const mockAlumni = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    graduationDate: "2022-06-15",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    status: "Active",
    lastContact: "2023-03-10",
    employmentStatus: "Employed",
    sobrietyDays: 365,
    address: "123 Main St, Anytown, CA 90210",
    birthDate: "1985-04-12",
    gender: "Male",
    emergencyContact: {
      name: "Jane Smith",
      relationship: "Spouse",
      phone: "(555) 987-6543",
    },
    programDetails: {
      program: "Residential Treatment",
      duration: "90 days",
      counselor: "Dr. Michael Johnson",
    },
    notes: [
      { date: "2023-03-10", content: "Monthly check-in. Doing well at new job." },
      { date: "2023-02-10", content: "Attended alumni event. Shared recovery story." },
    ],
  },
  {
    id: "2",
    firstName: "Maria",
    lastName: "Garcia",
    graduationDate: "2022-08-22",
    email: "maria.garcia@example.com",
    phone: "(555) 987-6543",
    status: "Active",
    lastContact: "2023-03-05",
    employmentStatus: "Employed",
    sobrietyDays: 275,
    address: "456 Oak Ave, Somewhere, CA 90211",
    birthDate: "1990-07-23",
    gender: "Female",
    emergencyContact: {
      name: "Carlos Garcia",
      relationship: "Brother",
      phone: "(555) 234-5678",
    },
    programDetails: {
      program: "Intensive Outpatient",
      duration: "120 days",
      counselor: "Dr. Sarah Williams",
    },
    notes: [
      { date: "2023-03-05", content: "Quarterly review. Maintaining sobriety well." },
      { date: "2023-01-15", content: "Started new job as administrative assistant." },
    ],
  },
  {
    id: "3",
    firstName: "Robert",
    lastName: "Johnson",
    graduationDate: "2022-04-30",
    email: "robert.johnson@example.com",
    phone: "(555) 456-7890",
    status: "Inactive",
    lastContact: "2022-12-15",
    employmentStatus: "Unknown",
    sobrietyDays: null,
    address: "789 Pine St, Elsewhere, CA 90212",
    birthDate: "1978-11-05",
    gender: "Male",
    emergencyContact: {
      name: "Mary Johnson",
      relationship: "Mother",
      phone: "(555) 345-6789",
    },
    programDetails: {
      program: "Partial Hospitalization",
      duration: "60 days",
      counselor: "Dr. James Brown",
    },
    notes: [
      { date: "2022-12-15", content: "Difficult to reach. Missed last two check-ins." },
      { date: "2022-10-20", content: "Reported struggling with cravings. Referred to support group." },
    ],
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Williams",
    graduationDate: "2022-09-17",
    email: "sarah.williams@example.com",
    phone: "(555) 234-5678",
    status: "Engaged",
    lastContact: "2023-03-15",
    employmentStatus: "Student",
    sobrietyDays: 210,
    address: "101 Maple Dr, Nowhere, CA 90213",
    birthDate: "1995-02-18",
    gender: "Female",
    emergencyContact: {
      name: "David Williams",
      relationship: "Father",
      phone: "(555) 876-5432",
    },
    programDetails: {
      program: "Outpatient",
      duration: "180 days",
      counselor: "Dr. Elizabeth Taylor",
    },
    notes: [
      { date: "2023-03-15", content: "Enrolled in community college. Very motivated." },
      { date: "2023-02-01", content: "Volunteered to speak at next alumni event." },
    ],
  },
  {
    id: "5",
    firstName: "Michael",
    lastName: "Brown",
    graduationDate: "2022-02-09",
    email: "michael.brown@example.com",
    phone: "(555) 876-5432",
    status: "Lost Contact",
    lastContact: "2022-08-20",
    employmentStatus: "Unknown",
    sobrietyDays: null,
    address: "202 Cedar Ln, Anywhere, CA 90214",
    birthDate: "1982-09-30",
    gender: "Male",
    emergencyContact: {
      name: "Susan Brown",
      relationship: "Sister",
      phone: "(555) 765-4321",
    },
    programDetails: {
      program: "Residential Treatment",
      duration: "90 days",
      counselor: "Dr. Robert Davis",
    },
    notes: [
      { date: "2022-08-20", content: "Phone disconnected. Email bounced back." },
      { date: "2022-06-10", content: "Mentioned moving to a different state for work." },
    ],
  },
  {
    id: "6",
    firstName: "Jennifer",
    lastName: "Davis",
    graduationDate: "2022-07-03",
    email: "jennifer.davis@example.com",
    phone: "(555) 345-6789",
    status: "Active",
    lastContact: "2023-03-01",
    employmentStatus: "Employed",
    sobrietyDays: 245,
    address: "303 Birch Rd, Someplace, CA 90215",
    birthDate: "1988-12-07",
    gender: "Female",
    emergencyContact: {
      name: "Thomas Davis",
      relationship: "Husband",
      phone: "(555) 654-3210",
    },
    programDetails: {
      program: "Intensive Outpatient",
      duration: "120 days",
      counselor: "Dr. Patricia Miller",
    },
    notes: [
      { date: "2023-03-01", content: "Promoted at work. Celebrating 8 months sober." },
      { date: "2023-01-20", content: "Started mentoring a new program graduate." },
    ],
  },
]

interface AlumniListProps {
  searchQuery?: string
  statusFilter?: string[]
}

export function AlumniList({ searchQuery = "", statusFilter = [] }: AlumniListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedAlumni, setSelectedAlumni] = useState<(typeof mockAlumni)[0] | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isRecordContactOpen, setIsRecordContactOpen] = useState(false)
  const [isUpdateSobrietyOpen, setIsUpdateSobrietyOpen] = useState(false)
  const [isRemoveAlertOpen, setIsRemoveAlertOpen] = useState(false)
  const [alumniList, setAlumniList] = useState(mockAlumni)

  // Filter alumni based on search query and status filter
  const filteredAlumni = alumniList.filter((alumni) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      `${alumni.firstName} ${alumni.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(alumni.status)

    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (alumni: (typeof mockAlumni)[0]) => {
    setSelectedAlumni(alumni)
    setIsViewDialogOpen(true)
  }

  const handleEditAlumni = (alumni: (typeof mockAlumni)[0]) => {
    setSelectedAlumni(alumni)
    setIsEditDialogOpen(true)
  }

  const handleRecordContact = (alumni: (typeof mockAlumni)[0]) => {
    setSelectedAlumni(alumni)
    setIsRecordContactOpen(true)
  }

  const handleUpdateSobriety = (alumni: (typeof mockAlumni)[0]) => {
    setSelectedAlumni(alumni)
    setIsUpdateSobrietyOpen(true)
  }

  const handleRemoveAlumni = (alumni: (typeof mockAlumni)[0]) => {
    setSelectedAlumni(alumni)
    setIsRemoveAlertOpen(true)
  }

  const confirmRemoveAlumni = () => {
    if (selectedAlumni) {
      // In a real app, this would call an API to remove the alumni
      setAlumniList(alumniList.filter((a) => a.id !== selectedAlumni.id))

      toast({
        title: "Alumni Removed",
        description: `${selectedAlumni.firstName} ${selectedAlumni.lastName} has been removed from the system.`,
        variant: "destructive",
      })

      setIsRemoveAlertOpen(false)
    }
  }

  const handleSendEmail = (alumni: (typeof mockAlumni)[0]) => {
    // In a real app, this would open an email client or a compose email dialog
    window.open(`mailto:${alumni.email}?subject=Follow-up from Recovery Center&body=Hello ${alumni.firstName},`)

    toast({
      title: "Email Client Opened",
      description: `Composing email to ${alumni.firstName} ${alumni.lastName}.`,
    })
  }

  const handlePhoneCall = (alumni: (typeof mockAlumni)[0]) => {
    // In a real app, this would initiate a phone call or show a dialog with the phone number
    window.open(`tel:${alumni.phone.replace(/[^0-9]/g, "")}`)

    toast({
      title: "Phone Call Initiated",
      description: `Calling ${alumni.firstName} ${alumni.lastName} at ${alumni.phone}.`,
    })
  }

  const handleAlumniUpdate = (updatedAlumni: (typeof mockAlumni)[0]) => {
    // Update the alumni list with the edited alumni
    setAlumniList(alumniList.map((a) => (a.id === updatedAlumni.id ? updatedAlumni : a)))

    toast({
      title: "Alumni Updated",
      description: `${updatedAlumni.firstName} ${updatedAlumni.lastName}'s information has been updated.`,
    })
  }

  if (filteredAlumni.length === 0) {
    return (
      <EmptyState
        title="No alumni found"
        description={
          searchQuery || statusFilter.length > 0
            ? "Try adjusting your search or filter criteria"
            : "Get started by adding your first alumni"
        }
        icon={<AlertTriangle className="h-10 w-10 text-muted-foreground" />}
      />
    )
  }

  return (
    <div className="space-y-4">
      {filteredAlumni.map((alumni) => (
        <Card key={alumni.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              <div
                className="flex-1 p-6 cursor-pointer hover:bg-muted/30 transition-colors duration-200"
                onClick={() => handleViewDetails(alumni)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    {alumni.firstName} {alumni.lastName}
                  </h3>
                  <Badge variant={getStatusBadgeVariant(alumni.status)}>{alumni.status}</Badge>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-2" />
                    Graduated: {new Date(alumni.graduationDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-2" />
                    Last Contact: {new Date(alumni.lastContact).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-3 w-3 mr-2" />
                    Employment: {alumni.employmentStatus}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {alumni.sobrietyDays !== null ? (
                    <Badge variant="success">{alumni.sobrietyDays} days sober</Badge>
                  ) : (
                    <Badge variant="outline">Sobriety unknown</Badge>
                  )}
                </div>
              </div>
              <div className="flex sm:flex-col justify-end items-center gap-2 p-4 bg-muted/50">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSendEmail(alumni)
                  }}
                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Email</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePhoneCall(alumni)
                  }}
                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span className="sr-only">Call</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(alumni)}>View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditAlumni(alumni)}>Edit Alumni</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRecordContact(alumni)}>Record Contact</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateSobriety(alumni)}>Update Sobriety</DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleRemoveAlumni(alumni)}
                    >
                      Remove Alumni
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Dialogs */}
      {selectedAlumni && (
        <>
          <ViewAlumniDialog
            alumni={selectedAlumni}
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            onUpdate={handleAlumniUpdate}
          />

          <EditAlumniDialog
            alumni={selectedAlumni}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={handleAlumniUpdate}
          />

          <RecordContactDialog
            alumni={selectedAlumni}
            open={isRecordContactOpen}
            onOpenChange={setIsRecordContactOpen}
            onSave={handleAlumniUpdate}
          />

          <UpdateSobrietyDialog
            alumni={selectedAlumni}
            open={isUpdateSobrietyOpen}
            onOpenChange={setIsUpdateSobrietyOpen}
            onSave={handleAlumniUpdate}
          />

          <AlertDialog open={isRemoveAlertOpen} onOpenChange={setIsRemoveAlertOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove {selectedAlumni.firstName} {selectedAlumni.lastName} from the system.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmRemoveAlumni}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  )
}

// Helper function to determine badge variant based on status
function getStatusBadgeVariant(
  status: string,
): "default" | "secondary" | "outline" | "destructive" | "success" | "warning" {
  switch (status) {
    case "Active":
      return "success"
    case "Engaged":
      return "secondary"
    case "Inactive":
      return "outline"
    case "Lost Contact":
      return "destructive"
    default:
      return "outline"
  }
}
