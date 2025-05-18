"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Bell, Filter, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

// Mock alerts data
const mockAlerts = [
  {
    id: "1",
    title: "Missed Appointment",
    description: "John Smith missed his scheduled appointment on May 15, 2023",
    type: "appointment",
    priority: "high",
    status: "pending",
    createdAt: "2023-05-15T10:30:00Z",
    assignedTo: "Dr. Williams",
    client: "John Smith",
  },
  {
    id: "2",
    title: "Medication Refill Needed",
    description: "Maria Garcia needs a medication refill by May 20, 2023",
    type: "medication",
    priority: "medium",
    status: "in-progress",
    createdAt: "2023-05-12T14:45:00Z",
    assignedTo: "Nurse Johnson",
    client: "Maria Garcia",
  },
  {
    id: "3",
    title: "Insurance Expiring",
    description: "Robert Johnson's insurance coverage expires on June 1, 2023",
    type: "insurance",
    priority: "medium",
    status: "pending",
    createdAt: "2023-05-10T09:15:00Z",
    assignedTo: "Case Manager Smith",
    client: "Robert Johnson",
  },
  {
    id: "4",
    title: "Sobriety Milestone",
    description: "Sarah Williams has reached 90 days of sobriety",
    type: "milestone",
    priority: "low",
    status: "completed",
    createdAt: "2023-05-08T16:20:00Z",
    assignedTo: "Counselor Brown",
    client: "Sarah Williams",
  },
  {
    id: "5",
    title: "Housing Issue",
    description: "Michael Brown reported maintenance issues at his residence",
    type: "housing",
    priority: "high",
    status: "in-progress",
    createdAt: "2023-05-14T11:10:00Z",
    assignedTo: "Housing Coordinator Davis",
    client: "Michael Brown",
  },
]

export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [isAddAlertOpen, setIsAddAlertOpen] = useState(false)
  const { toast } = useToast()

  const alertTypes = ["appointment", "medication", "insurance", "milestone", "housing"]
  const alertStatuses = ["pending", "in-progress", "completed"]

  const handleTypeToggle = (type: string) => {
    setTypeFilter((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleStatusToggle = (status: string) => {
    setStatusFilter((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const filteredAlerts = mockAlerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.client.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter.length === 0 || typeFilter.includes(alert.type)
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(alert.status)

    return matchesSearch && matchesType && matchesStatus
  })

  const handleAddAlert = (alertData: any) => {
    // In a real app, this would add the alert to the database
    console.log("Adding alert:", alertData)
    setIsAddAlertOpen(false)
    toast({
      title: "Alert created",
      description: "The alert has been created successfully.",
    })
  }

  const handleResolveAlert = (alertId: string) => {
    // In a real app, this would update the alert status in the database
    console.log("Resolving alert:", alertId)
    toast({
      title: "Alert resolved",
      description: "The alert has been marked as completed.",
    })
  }

  return (
    <div className="container mx-auto space-y-6">
      <PageHeader
        title="Alerts Management"
        description="View and manage system alerts and notifications"
        actions={
          <Button onClick={() => setIsAddAlertOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Alert
          </Button>
        }
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-6">
          <div className="relative w-full sm:w-96">
            <Input
              placeholder="Search alerts..."
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

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Type
                  {typeFilter.length > 0 && ` (${typeFilter.length})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {alertTypes.map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={typeFilter.includes(type)}
                    onCheckedChange={() => handleTypeToggle(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Status
                  {statusFilter.length > 0 && ` (${statusFilter.length})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {alertStatuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={() => handleStatusToggle(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <Card key={alert.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div
                          className={`p-2 rounded-full mr-4 ${
                            alert.priority === "high"
                              ? "bg-red-100"
                              : alert.priority === "medium"
                                ? "bg-yellow-100"
                                : "bg-green-100"
                          }`}
                        >
                          <Bell
                            className={`h-5 w-5 ${
                              alert.priority === "high"
                                ? "text-red-600"
                                : alert.priority === "medium"
                                  ? "text-yellow-600"
                                  : "text-green-600"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{alert.title}</h3>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <span className="mr-4">Client: {alert.client}</span>
                            <span>Assigned to: {alert.assignedTo}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                            alert.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : alert.status === "in-progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {alert.status === "pending"
                            ? "Pending"
                            : alert.status === "in-progress"
                              ? "In Progress"
                              : "Completed"}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      {alert.status !== "completed" && (
                        <Button variant="outline" size="sm" onClick={() => handleResolveAlert(alert.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Resolved
                        </Button>
                      )}
                      <Button size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Bell className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No alerts found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                  No alerts match your current search criteria or filter selection.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {filteredAlerts.filter((a) => a.status === "pending").length > 0 ? (
              filteredAlerts
                .filter((a) => a.status === "pending")
                .map((alert) => (
                  <Card key={alert.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div
                            className={`p-2 rounded-full mr-4 ${
                              alert.priority === "high"
                                ? "bg-red-100"
                                : alert.priority === "medium"
                                  ? "bg-yellow-100"
                                  : "bg-green-100"
                            }`}
                          >
                            <AlertCircle
                              className={`h-5 w-5 ${
                                alert.priority === "high"
                                  ? "text-red-600"
                                  : alert.priority === "medium"
                                    ? "text-yellow-600"
                                    : "text-green-600"
                              }`}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">{alert.title}</h3>
                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                            <div className="flex items-center mt-2 text-sm text-muted-foreground">
                              <span className="mr-4">Client: {alert.client}</span>
                              <span>Assigned to: {alert.assignedTo}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="px-2 py-1 rounded-full text-xs font-medium mb-2 bg-yellow-100 text-yellow-800">
                            Pending
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleResolveAlert(alert.id)}>
                          <Clock className="mr-2 h-4 w-4" />
                          Mark In Progress
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No pending alerts</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                  There are no pending alerts that match your criteria.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          <div className="space-y-4">
            {filteredAlerts.filter((a) => a.status === "in-progress").length > 0 ? (
              filteredAlerts
                .filter((a) => a.status === "in-progress")
                .map((alert) => (
                  <Card key={alert.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div
                            className={`p-2 rounded-full mr-4 ${
                              alert.priority === "high"
                                ? "bg-red-100"
                                : alert.priority === "medium"
                                  ? "bg-yellow-100"
                                  : "bg-green-100"
                            }`}
                          >
                            <Clock
                              className={`h-5 w-5 ${
                                alert.priority === "high"
                                  ? "text-red-600"
                                  : alert.priority === "medium"
                                    ? "text-yellow-600"
                                    : "text-green-600"
                              }`}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">{alert.title}</h3>
                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                            <div className="flex items-center mt-2 text-sm text-muted-foreground">
                              <span className="mr-4">Client: {alert.client}</span>
                              <span>Assigned to: {alert.assignedTo}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="px-2 py-1 rounded-full text-xs font-medium mb-2 bg-blue-100 text-blue-800">
                            In Progress
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleResolveAlert(alert.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Resolved
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No in-progress alerts</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                  There are no in-progress alerts that match your criteria.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="space-y-4">
            {filteredAlerts.filter((a) => a.status === "completed").length > 0 ? (
              filteredAlerts
                .filter((a) => a.status === "completed")
                .map((alert) => (
                  <Card key={alert.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="p-2 rounded-full mr-4 bg-green-100">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">{alert.title}</h3>
                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                            <div className="flex items-center mt-2 text-sm text-muted-foreground">
                              <span className="mr-4">Client: {alert.client}</span>
                              <span>Assigned to: {alert.assignedTo}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="px-2 py-1 rounded-full text-xs font-medium mb-2 bg-green-100 text-green-800">
                            Completed
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No completed alerts</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                  There are no completed alerts that match your criteria.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {isAddAlertOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Alert</CardTitle>
              <CardDescription>Create a new alert or notification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input placeholder="Alert title" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    className="w-full p-2 border rounded-md min-h-[100px]"
                    placeholder="Alert description"
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <select className="w-full p-2 border rounded-md">
                      {alertTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Select a client</option>
                    <option value="John Smith">John Smith</option>
                    <option value="Maria Garcia">Maria Garcia</option>
                    <option value="Robert Johnson">Robert Johnson</option>
                    <option value="Sarah Williams">Sarah Williams</option>
                    <option value="Michael Brown">Michael Brown</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assign To</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Select a staff member</option>
                    <option value="Dr. Williams">Dr. Williams</option>
                    <option value="Nurse Johnson">Nurse Johnson</option>
                    <option value="Case Manager Smith">Case Manager Smith</option>
                    <option value="Counselor Brown">Counselor Brown</option>
                    <option value="Housing Coordinator Davis">Housing Coordinator Davis</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddAlertOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleAddAlert({
                        title: "New Alert",
                        description: "Alert description",
                        type: "appointment",
                        priority: "medium",
                        client: "John Smith",
                        assignedTo: "Dr. Williams",
                      })
                    }
                  >
                    Create Alert
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
