"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar } from "lucide-react"
import { StaffCalendar } from "@/components/staff/staff-calendar"
import { StaffAvailability } from "@/components/staff/staff-availability"
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
    <div className="container mx-auto p-6 space-y-6">
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
              <StaffCalendar
                view={activeView}
                onAddShift={handleAddShift}
                onEditShift={handleEditShift}
                onDeleteShift={handleDeleteShift}
              />
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
              <StaffAvailability />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
