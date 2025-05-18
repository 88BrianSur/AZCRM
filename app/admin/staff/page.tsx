"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Search, UserPlus, Phone, Mail, MapPin, Calendar, Clock, FileText, Shield } from "lucide-react"

// Mock data for staff members
const STAFF_MEMBERS = [
  {
    id: "1",
    name: "Dr. Sarah Williams",
    role: "Clinical Director",
    department: "Clinical",
    email: "sarah.williams@azhouse.org",
    phone: "(480) 555-1234",
    status: "Active",
    avatar: "/stylized-sw.png",
    hireDate: "2020-03-15",
    certifications: ["Licensed Clinical Psychologist", "EMDR Certified"],
    availability: "Full-time",
    address: "123 Main St, Phoenix, AZ 85001",
    emergencyContact: "John Williams, (480) 555-9876",
    bio: "Dr. Williams has over 15 years of experience in addiction treatment and recovery. She specializes in trauma-informed care and dual diagnosis treatment.",
    color: "#4f46e5", // Indigo color for calendar
  },
  {
    id: "2",
    name: "Michael Johnson",
    role: "Therapist",
    department: "Clinical",
    email: "michael.johnson@azhouse.org",
    phone: "(480) 555-2345",
    status: "Active",
    avatar: "/abstract-geometric-mj.png",
    hireDate: "2021-06-10",
    certifications: ["Licensed Professional Counselor", "CBT Certified"],
    availability: "Full-time",
    address: "456 Oak St, Tempe, AZ 85281",
    emergencyContact: "Lisa Johnson, (480) 555-8765",
    bio: "Michael specializes in cognitive behavioral therapy and motivational interviewing techniques for substance use disorders.",
    color: "#0891b2", // Cyan color for calendar
  },
  {
    id: "3",
    name: "Jennifer Lopez",
    role: "Case Manager",
    department: "Case Management",
    email: "jennifer.lopez@azhouse.org",
    phone: "(480) 555-3456",
    status: "Active",
    avatar: "/stylized-jl-logo.png",
    hireDate: "2022-01-15",
    certifications: ["Certified Case Manager", "NADAAC Certified"],
    availability: "Part-time",
    address: "789 Pine St, Scottsdale, AZ 85251",
    emergencyContact: "Robert Lopez, (480) 555-7654",
    bio: "Jennifer excels at connecting clients with community resources and ensuring continuity of care throughout the recovery journey.",
    color: "#059669", // Emerald color for calendar
  },
  {
    id: "4",
    name: "David Wilson",
    role: "Recovery Coach",
    department: "Recovery Support",
    email: "david.wilson@azhouse.org",
    phone: "(480) 555-4567",
    status: "Active",
    avatar: "/abstract-dw.png",
    hireDate: "2022-08-20",
    certifications: ["Certified Recovery Coach", "Peer Support Specialist"],
    availability: "Full-time",
    address: "101 Elm St, Mesa, AZ 85201",
    emergencyContact: "Sarah Wilson, (480) 555-6543",
    bio: "With 10 years of personal recovery experience, David provides authentic peer support and practical guidance to clients.",
    color: "#d97706", // Amber color for calendar
  },
  {
    id: "5",
    name: "Amanda Garcia",
    role: "Intake Coordinator",
    department: "Admissions",
    email: "amanda.garcia@azhouse.org",
    phone: "(480) 555-5678",
    status: "On Leave",
    avatar: "/abstract-geometric-AG.png",
    hireDate: "2021-11-05",
    certifications: ["Certified Addiction Counselor"],
    availability: "Full-time",
    address: "202 Cedar St, Chandler, AZ 85224",
    emergencyContact: "Miguel Garcia, (480) 555-5432",
    bio: "Amanda specializes in compassionate assessment and placement, ensuring clients receive the appropriate level of care.",
    color: "#be185d", // Pink color for calendar
  },
  {
    id: "6",
    name: "Robert Taylor",
    role: "Medical Director",
    department: "Medical",
    email: "robert.taylor@azhouse.org",
    phone: "(480) 555-6789",
    status: "Active",
    avatar: "/road-trip-scenic-route.png",
    hireDate: "2019-05-10",
    certifications: ["Board Certified Addiction Medicine", "MD"],
    availability: "Part-time",
    address: "303 Maple St, Gilbert, AZ 85233",
    emergencyContact: "Elizabeth Taylor, (480) 555-4321",
    bio: "Dr. Taylor oversees all medical aspects of treatment, specializing in addiction medicine and co-occurring disorders.",
    color: "#7c3aed", // Violet color for calendar
  },
  {
    id: "7",
    name: "Jessica Brown",
    role: "Therapist",
    department: "Clinical",
    email: "jessica.brown@azhouse.org",
    phone: "(480) 555-7890",
    status: "Inactive",
    avatar: "/stylized-jb-monogram.png",
    hireDate: "2020-09-15",
    certifications: ["Licensed Marriage and Family Therapist"],
    availability: "Full-time",
    address: "404 Birch St, Glendale, AZ 85301",
    emergencyContact: "Thomas Brown, (480) 555-3210",
    bio: "Jessica specializes in family systems therapy and helping clients rebuild relationships damaged by addiction.",
    color: "#db2777", // Fuchsia color for calendar
  },
]

// Staff detail component
function StaffDetail({ staff, onClose }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
          <AvatarFallback>
            {staff.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{staff.name}</h2>
          <div className="flex flex-wrap gap-2 items-center mt-1">
            <Badge
              variant={staff.status === "Active" ? "default" : staff.status === "On Leave" ? "warning" : "secondary"}
            >
              {staff.status}
            </Badge>
            <span className="text-muted-foreground">{staff.role}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{staff.department}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{staff.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{staff.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <span>{staff.address}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Hire Date: {new Date(staff.hireDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Availability: {staff.availability}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>Emergency Contact: {staff.emergencyContact}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Professional Background</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <h4 className="font-medium">Bio</h4>
                <p className="text-muted-foreground">{staff.bio}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {staff.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button>Edit Staff Member</Button>
      </div>
    </div>
  )
}

// Staff form component for add/edit
function StaffForm({ staff = null, onClose }) {
  const isEditing = !!staff

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" defaultValue={staff?.name || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" defaultValue={staff?.role || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select defaultValue={staff?.department || ""}>
            <SelectTrigger id="department">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Clinical">Clinical</SelectItem>
              <SelectItem value="Medical">Medical</SelectItem>
              <SelectItem value="Case Management">Case Management</SelectItem>
              <SelectItem value="Recovery Support">Recovery Support</SelectItem>
              <SelectItem value="Admissions">Admissions</SelectItem>
              <SelectItem value="Administration">Administration</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select defaultValue={staff?.status || "Active"}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue={staff?.email || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" defaultValue={staff?.phone || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hireDate">Hire Date</Label>
          <Input id="hireDate" type="date" defaultValue={staff?.hireDate || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="availability">Availability</Label>
          <Select defaultValue={staff?.availability || ""}>
            <SelectTrigger id="availability">
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="On-call">On-call</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" defaultValue={staff?.address || ""} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="emergencyContact">Emergency Contact</Label>
          <Input id="emergencyContact" defaultValue={staff?.emergencyContact || ""} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="certifications">Certifications (comma separated)</Label>
          <Input id="certifications" defaultValue={staff?.certifications?.join(", ") || ""} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio">Professional Bio</Label>
          <Textarea id="bio" rows={4} defaultValue={staff?.bio || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Calendar Color</Label>
          <div className="flex items-center gap-2">
            <Input id="color" type="color" className="w-12 h-10 p-1" defaultValue={staff?.color || "#4f46e5"} />
            <span className="text-sm text-muted-foreground">
              Color used for this staff member in the scheduling calendar
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button>{isEditing ? "Update Staff Member" : "Add Staff Member"}</Button>
      </div>
    </div>
  )
}

export default function StaffManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [activeTab, setActiveTab] = useState("all")

  // Filter staff based on search query and active tab
  const filteredStaff = STAFF_MEMBERS.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && staff.status === "Active"
    if (activeTab === "onLeave") return matchesSearch && staff.status === "On Leave"
    if (activeTab === "inactive") return matchesSearch && staff.status === "Inactive"

    return matchesSearch
  })

  const handleAddStaff = () => {
    setEditingStaff(null)
    setIsFormOpen(true)
  }

  const handleEditStaff = (staff) => {
    setEditingStaff(staff)
    setIsFormOpen(true)
  }

  const handleViewStaff = (staff) => {
    setSelectedStaff(staff)
    setIsDetailOpen(true)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader title="Staff Management" description="Manage staff members, roles, and permissions" />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="onLeave">On Leave</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button onClick={handleAddStaff} className="ml-auto sm:ml-2">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => (
          <Card key={staff.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                      <AvatarFallback>
                        {staff.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{staff.name}</h3>
                      <p className="text-sm text-muted-foreground">{staff.role}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewStaff(staff)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditStaff(staff)}>Edit Staff</DropdownMenuItem>
                      {staff.status === "Active" ? (
                        <DropdownMenuItem>Mark as On Leave</DropdownMenuItem>
                      ) : staff.status === "On Leave" ? (
                        <DropdownMenuItem>Mark as Active</DropdownMenuItem>
                      ) : null}
                      {staff.status !== "Inactive" ? (
                        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>Reactivate</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate">{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{staff.phone}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Badge
                    variant={
                      staff.status === "Active" ? "default" : staff.status === "On Leave" ? "warning" : "secondary"
                    }
                  >
                    {staff.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{staff.department}</span>
                </div>
              </div>

              <div className="border-t p-4 bg-muted/40 flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => handleViewStaff(staff)}>
                  View Details
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditStaff(staff)}>
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No staff members found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Staff Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Staff Details</DialogTitle>
          </DialogHeader>
          {selectedStaff && <StaffDetail staff={selectedStaff} onClose={() => setIsDetailOpen(false)} />}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Staff Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStaff ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
            <DialogDescription>
              {editingStaff
                ? "Update the staff member's information below."
                : "Fill out the form below to add a new staff member."}
            </DialogDescription>
          </DialogHeader>
          <StaffForm staff={editingStaff} onClose={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
