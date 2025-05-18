"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Users, Calendar, Award, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { SkeletonLoader } from "@/components/skeleton-loader"

// Mock client data with sobriety information
const mockClients = [
  {
    id: "1",
    name: "John Smith",
    days: 365,
    milestone: "1 Year",
    checkIns: [
      { date: "2023-05-01", status: "maintained" },
      { date: "2023-06-01", status: "maintained" },
      { date: "2023-07-01", status: "maintained" },
      { date: "2023-08-01", status: "maintained" },
      { date: "2023-09-01", status: "maintained" },
      { date: "2023-10-01", status: "maintained" },
      { date: "2023-11-01", status: "maintained" },
      { date: "2023-12-01", status: "maintained" },
      { date: "2024-01-01", status: "maintained" },
      { date: "2024-02-01", status: "maintained" },
      { date: "2024-03-01", status: "maintained" },
      { date: "2024-04-01", status: "maintained" },
      { date: "2024-05-01", status: "maintained" },
    ],
    history: [{ startDate: "2023-05-01", endDate: null, days: 365 }],
  },
  {
    id: "2",
    name: "Maria Garcia",
    days: 180,
    milestone: "6 Months",
    checkIns: [
      { date: "2023-11-01", status: "maintained" },
      { date: "2023-12-01", status: "maintained" },
      { date: "2024-01-01", status: "maintained" },
      { date: "2024-02-01", status: "maintained" },
      { date: "2024-03-01", status: "maintained" },
      { date: "2024-04-01", status: "maintained" },
      { date: "2024-05-01", status: "maintained" },
    ],
    history: [{ startDate: "2023-11-01", endDate: null, days: 180 }],
  },
  {
    id: "3",
    name: "Robert Johnson",
    days: 90,
    milestone: "90 Days",
    checkIns: [
      { date: "2024-02-01", status: "maintained" },
      { date: "2024-03-01", status: "maintained" },
      { date: "2024-04-01", status: "maintained" },
      { date: "2024-05-01", status: "maintained" },
    ],
    history: [{ startDate: "2024-02-01", endDate: null, days: 90 }],
  },
  {
    id: "4",
    name: "Sarah Williams",
    days: 30,
    milestone: "30 Days",
    checkIns: [
      { date: "2024-04-01", status: "maintained" },
      { date: "2024-05-01", status: "maintained" },
    ],
    history: [
      { startDate: "2023-01-01", endDate: "2023-03-15", days: 74 },
      { startDate: "2023-06-10", endDate: "2023-10-05", days: 117 },
      { startDate: "2024-04-01", endDate: null, days: 30 },
    ],
  },
  {
    id: "5",
    name: "Michael Brown",
    days: 7,
    milestone: "1 Week",
    checkIns: [
      { date: "2024-04-24", status: "maintained" },
      { date: "2024-05-01", status: "maintained" },
    ],
    history: [
      { startDate: "2023-02-01", endDate: "2023-05-10", days: 98 },
      { startDate: "2023-07-15", endDate: "2023-08-20", days: 36 },
      { startDate: "2023-10-01", endDate: "2024-01-15", days: 106 },
      { startDate: "2024-04-24", endDate: null, days: 7 },
    ],
  },
]

export default function SobrietyTrackerPage() {
  const [isAddingCheckIn, setIsAddingCheckIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [clientFilter, setClientFilter] = useState<string[]>([])
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleClientToggle = (client: string) => {
    setClientFilter((prev) => (prev.includes(client) ? prev.filter((c) => c !== client) : [...prev, client]))
  }

  const handleAddCheckIn = (checkInData: any) => {
    // In a real app, this would add the check-in to the database
    console.log("Adding check-in:", checkInData)
    setIsAddingCheckIn(false)
    toast({
      title: "Check-in recorded",
      description: "The sobriety check-in has been recorded successfully.",
    })
  }

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (clientFilter.length === 0 || clientFilter.includes(client.name)),
  )

  const selectedClientData = selectedClient ? mockClients.find((client) => client.id === selectedClient) : null

  return (
    <div className="container mx-auto space-y-6">
      <PageHeader
        title="Sobriety Tracker"
        description="Monitor and record client sobriety progress"
        actions={
          <Button onClick={() => setIsAddingCheckIn(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Check-in
          </Button>
        }
      />

      {isAddingCheckIn ? (
        <Card>
          <CardHeader>
            <CardTitle>New Sobriety Check-in</CardTitle>
            <CardDescription>Record a new sobriety check-in for a client</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Select a client</option>
                    {mockClients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="maintained">Maintained Sobriety</option>
                    <option value="relapsed">Relapsed</option>
                    <option value="reset">Reset Counter</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  placeholder="Enter any additional notes..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingCheckIn(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleAddCheckIn({ client: "John Smith", status: "maintained" })}>
                  Save Check-in
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
                placeholder="Search clients..."
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Clients
                  {clientFilter.length > 0 && ` (${clientFilter.length})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {mockClients.map((client) => (
                  <DropdownMenuCheckboxItem
                    key={client.id}
                    checked={clientFilter.includes(client.name)}
                    onCheckedChange={() => handleClientToggle(client.name)}
                  >
                    {client.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">
                <TrendingUp className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="individual">
                <Calendar className="mr-2 h-4 w-4" />
                Individual Progress
              </TabsTrigger>
              <TabsTrigger value="milestones">
                <Award className="mr-2 h-4 w-4" />
                Milestones
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {isLoading ? (
                <SkeletonLoader className="h-[400px]" />
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Program Sobriety Overview</CardTitle>
                      <CardDescription>Aggregate sobriety data for all clients</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <h3 className="text-2xl font-bold mb-2">Sobriety Statistics</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <div className="text-3xl font-bold">{filteredClients.length}</div>
                              <div className="text-sm text-muted-foreground">Active Clients</div>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <div className="text-3xl font-bold">
                                {Math.round(
                                  filteredClients.reduce((acc, client) => acc + client.days, 0) /
                                    filteredClients.length,
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">Avg. Days Sober</div>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <div className="text-3xl font-bold">
                                {filteredClients.filter((c) => c.days >= 30).length}
                              </div>
                              <div className="text-sm text-muted-foreground">30+ Days</div>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <div className="text-3xl font-bold">
                                {filteredClients.filter((c) => c.days >= 90).length}
                              </div>
                              <div className="text-sm text-muted-foreground">90+ Days</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="individual" className="mt-6">
              {isLoading ? (
                <SkeletonLoader className="h-[500px]" />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Individual Client Progress</CardTitle>
                    <CardDescription>Select a client to view detailed sobriety progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <label htmlFor="client-select" className="block text-sm font-medium mb-2">
                        Select Client
                      </label>
                      <select
                        id="client-select"
                        className="w-full p-2 border rounded-md"
                        value={selectedClient || ""}
                        onChange={(e) => setSelectedClient(e.target.value)}
                      >
                        <option value="">-- Select a client --</option>
                        {mockClients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name} ({client.days} days)
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedClient ? (
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="text-xl font-bold">{selectedClientData?.name}</h3>
                            <p className="text-muted-foreground">Current streak: {selectedClientData?.days} days</p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                              <Award className="mr-1 h-4 w-4" />
                              {selectedClientData?.milestone}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Sobriety History</h4>
                          <div className="space-y-2">
                            {selectedClientData?.history.map((period, i) => (
                              <div key={i} className="flex justify-between p-2 bg-muted/50 rounded-md">
                                <div>
                                  {new Date(period.startDate).toLocaleDateString()} -
                                  {period.endDate ? new Date(period.endDate).toLocaleDateString() : "Present"}
                                </div>
                                <div className="font-medium">{period.days} days</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Recent Check-ins</h4>
                          <div className="space-y-2">
                            {selectedClientData?.checkIns
                              .slice(-5)
                              .reverse()
                              .map((checkIn, i) => (
                                <div key={i} className="flex justify-between p-2 bg-muted/50 rounded-md">
                                  <div>{new Date(checkIn.date).toLocaleDateString()}</div>
                                  <div className="capitalize font-medium">{checkIn.status}</div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[300px]">
                        <p className="text-muted-foreground">
                          Select a client from the dropdown to view their progress
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="milestones" className="mt-6">
              {isLoading ? (
                <SkeletonLoader className="h-[500px]" />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Sobriety Milestones</CardTitle>
                    <CardDescription>Celebrate client achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredClients.map((client, index) => (
                        <div key={index} className="flex items-center p-3 border rounded-lg">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                            <span className="text-primary font-bold">{client.milestone.split(" ")[0]}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{client.name}</h4>
                            <p className="text-sm text-muted-foreground">{client.days} days of sobriety</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-auto"
                            onClick={() => {
                              toast({
                                title: "Milestone Celebrated",
                                description: `Congratulations sent to ${client.name} for reaching ${client.milestone}!`,
                              })
                            }}
                          >
                            <Award className="mr-2 h-4 w-4" />
                            Celebrate
                          </Button>
                        </div>
                      ))}

                      {filteredClients.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="rounded-full bg-muted p-3 mb-3">
                            <Award className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-medium">No milestones found</h3>
                          <p className="text-sm text-muted-foreground text-center max-w-sm mt-1">
                            No clients match your current search criteria or filter selection.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
