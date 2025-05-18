"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function StaffSchedulingPage() {
  const [activeView, setActiveView] = useState<"weekly" | "monthly">("weekly")
  const { toast } = useToast()

  const handleAddShift = (shiftData: any) => {
    // In a real app, this would add the shift to the database
    console.log("Adding shift:", shiftData)
    toast({
      title: "Shift added",
      description: "The staff shift has been added successfully.",
    })
  }

  const handleEditShift = (shiftData: any) => {
    // In a real app, this would update the shift in the database
    console.log("Editing shift:", shiftData)
    toast({
      title: "Shift updated",
      description: "The staff shift has been updated successfully.",
    })
  }

  const handleDeleteShift = (shiftId: string) => {
    // In a real app, this would delete the shift from the database
    console.log("Deleting shift:", shiftId)
    toast({
      title: "Shift deleted",
      description: "The staff shift has been removed from the schedule.",
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto space-y-6">
      <PageHeader
        title="Staff Scheduling"
        description="Manage staff schedules and availability"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setActiveView(activeView === "weekly" ? "monthly" : "weekly")}>
              <Calendar className="mr-2 h-4 w-4" />
              {activeView === "weekly" ? "Monthly View" : "Weekly View"}
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Shift
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="availability">Staff Availability</TabsTrigger>
        </TabsList>
        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{activeView === "weekly" ? "Weekly Schedule" : "Monthly Schedule"}</CardTitle>
              <CardDescription>
                {activeView === "weekly"
                  ? "View and manage staff shifts for the current week"
                  : "View and manage staff shifts for the current month"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 h-[500px]">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="border rounded-md p-2 h-full overflow-y-auto">
                      <div className="text-sm font-medium mb-2">{new Date(2023, 5, i + 1).getDate()}</div>
                      {i % 2 === 0 ? (
                        <>
                          <div className="bg-blue-100 p-2 rounded mb-2 text-xs">
                            <div className="font-medium">Dr. Williams</div>
                            <div>9:00 AM - 5:00 PM</div>
                          </div>
                          <div className="bg-green-100 p-2 rounded mb-2 text-xs">
                            <div className="font-medium">Nurse Garcia</div>
                            <div>12:00 PM - 8:00 PM</div>
                          </div>
                        </>
                      ) : i % 3 === 0 ? (
                        <>
                          <div className="bg-purple-100 p-2 rounded mb-2 text-xs">
                            <div className="font-medium">Counselor Johnson</div>
                            <div>10:00 AM - 6:00 PM</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-yellow-100 p-2 rounded mb-2 text-xs">
                            <div className="font-medium">Staff Member Brown</div>
                            <div>8:00 AM - 4:00 PM</div>
                          </div>
                          <div className="bg-red-100 p-2 rounded mb-2 text-xs">
                            <div className="font-medium">Case Manager Smith</div>
                            <div>1:00 PM - 9:00 PM</div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="availability" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Availability</CardTitle>
              <CardDescription>Manage staff availability preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {["Dr. Williams", "Nurse Garcia", "Counselor Johnson", "Case Manager Smith", "Staff Member Brown"].map(
                  (staff, i) => (
                    <div key={i} className="border rounded-md p-4">
                      <h3 className="font-medium text-lg mb-2">{staff}</h3>
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <div key={day} className="text-center text-sm font-medium">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, j) => (
                          <div
                            key={j}
                            className={`text-center p-2 rounded-md ${
                              (i === 0 && (j === 1 || j === 3 || j === 5)) ||
                              (i === 1 && (j === 2 || j === 4 || j === 6)) ||
                              (i === 2 && (j === 0 || j === 2 || j === 4)) ||
                              (i === 3 && (j === 1 || j === 3 || j === 5)) ||
                              (i === 4 && (j === 0 || j === 2 || j === 4 || j === 6))
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {(i === 0 && (j === 1 || j === 3 || j === 5)) ||
                            (i === 1 && (j === 2 || j === 4 || j === 6)) ||
                            (i === 2 && (j === 0 || j === 2 || j === 4)) ||
                            (i === 3 && (j === 1 || j === 3 || j === 5)) ||
                            (i === 4 && (j === 0 || j === 2 || j === 4 || j === 6))
                              ? "Available"
                              : "Unavailable"}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">
                          Edit Availability
                        </Button>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
