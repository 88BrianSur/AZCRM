"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock alumni data
const mockAlumni = [
  {
    id: "1",
    name: "John Smith",
    graduationDate: "2023-01-15",
    status: "Active",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    sobrietyDays: 480,
    lastContact: "2023-05-10",
  },
  {
    id: "2",
    name: "Maria Garcia",
    graduationDate: "2022-11-20",
    status: "Engaged",
    email: "maria.garcia@example.com",
    phone: "555-987-6543",
    sobrietyDays: 550,
    lastContact: "2023-04-22",
  },
  {
    id: "3",
    name: "Robert Johnson",
    graduationDate: "2022-08-05",
    status: "Inactive",
    email: "robert.j@example.com",
    phone: "555-456-7890",
    sobrietyDays: 650,
    lastContact: "2022-12-15",
  },
  {
    id: "4",
    name: "Sarah Williams",
    graduationDate: "2023-03-10",
    status: "Active",
    email: "sarah.w@example.com",
    phone: "555-789-0123",
    sobrietyDays: 410,
    lastContact: "2023-05-01",
  },
  {
    id: "5",
    name: "David Brown",
    graduationDate: "2022-06-20",
    status: "Lost Contact",
    email: "david.b@example.com",
    phone: "555-234-5678",
    sobrietyDays: null,
    lastContact: "2022-09-15",
  },
]

export default function AlumniManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [isAddAlumniOpen, setIsAddAlumniOpen] = useState(false)

  const statuses = ["Active", "Inactive", "Engaged", "Lost Contact"]

  const handleStatusToggle = (status: string) => {
    setStatusFilter((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const filteredAlumni = mockAlumni.filter((alumni) => {
    const matchesSearch =
      alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.phone.includes(searchQuery)

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(alumni.status)

    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto space-y-6">
      <PageHeader
        title="Alumni Management"
        description="Stay connected with program graduates"
        actions={
          <Button onClick={() => setIsAddAlumniOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Alumni
          </Button>
        }
      />

      <Tabs defaultValue="directory" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="directory">Alumni Directory</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
        </TabsList>
        <TabsContent value="directory" className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative w-full sm:w-96">
              <Input
                placeholder="Search alumni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Status
                  {statusFilter.length > 0 && ` (${statusFilter.length})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {statuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={() => handleStatusToggle(status)}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAlumni.length > 0 ? (
              filteredAlumni.map((alumni) => (
                <Card key={alumni.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{alumni.name}</h3>
                        <p className="text-sm text-muted-foreground">{alumni.email}</p>
                        <p className="text-sm text-muted-foreground">{alumni.phone}</p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alumni.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : alumni.status === "Inactive"
                              ? "bg-gray-100 text-gray-800"
                              : alumni.status === "Engaged"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {alumni.status}
                      </div>
                    </div>
                    <div className="mt-4 text-sm">
                      <div className="flex justify-between">
                        <span>Graduation:</span>
                        <span className="font-medium">{new Date(alumni.graduationDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Sobriety:</span>
                        <span className="font-medium">
                          {alumni.sobrietyDays ? `${alumni.sobrietyDays} days` : "Unknown"}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Last Contact:</span>
                        <span className="font-medium">{new Date(alumni.lastContact).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        Contact
                      </Button>
                      <Button size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No alumni found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                  No alumni match your current search criteria or filter selection.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="engagement" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alumni Engagement</CardTitle>
              <CardDescription>Track and manage alumni engagement activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground">Next: Alumni Picnic (Jun 15)</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Recent Contacts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">In the last 30 days</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">68%</div>
                      <p className="text-xs text-muted-foreground">+5% from last month</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Upcoming Alumni Events</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Alumni Picnic", date: "2023-06-15", location: "City Park", attendees: 24 },
                      { name: "Recovery Workshop", date: "2023-07-10", location: "Community Center", attendees: 18 },
                      { name: "Monthly Support Group", date: "2023-06-25", location: "Main Office", attendees: 15 },
                    ].map((event, i) => (
                      <div key={i} className="flex items-center p-3 border rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <span className="text-primary font-bold">{new Date(event.date).getDate()}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{event.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()} • {event.location}
                          </p>
                        </div>
                        <div className="ml-auto flex items-center">
                          <span className="text-sm mr-4">{event.attendees} attending</span>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="outcomes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alumni Outcomes</CardTitle>
              <CardDescription>Track long-term recovery outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">1+ Year Sober</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">68%</div>
                      <p className="text-xs text-muted-foreground">Of all alumni</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Employed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">72%</div>
                      <p className="text-xs text-muted-foreground">Full or part-time</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Stable Housing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">85%</div>
                      <p className="text-xs text-muted-foreground">Independent or supported</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Relapse Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24%</div>
                      <p className="text-xs text-muted-foreground">Within first year</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Success Stories</h3>
                  <div className="space-y-4">
                    {[
                      { name: "John Smith", achievement: "2 years sober, new job as recovery coach" },
                      { name: "Maria Garcia", achievement: "Completed nursing degree, 18 months sober" },
                      { name: "Robert Johnson", achievement: "Reunited with family, stable housing for 1 year" },
                    ].map((story, i) => (
                      <div key={i} className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium">{story.name}</h4>
                        <p className="text-sm mt-1">{story.achievement}</p>
                        <Button variant="link" size="sm" className="px-0 mt-2">
                          Read full story
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isAddAlumniOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Alumni</CardTitle>
              <CardDescription>Add a graduate to the alumni program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input placeholder="First name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input placeholder="Last name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="Email address" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input placeholder="Phone number" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Graduation Date</label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select className="w-full p-2 border rounded-md">
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Sobriety Days</label>
                  <Input type="number" placeholder="Days" />
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddAlumniOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAddAlumniOpen(false)
                      // In a real app, this would add the alumni to the database
                    }}
                  >
                    Add Alumni
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
