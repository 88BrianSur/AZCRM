"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"

export function StaffAvailability() {
  // Mock data for staff availability
  const staffMembers = [
    {
      id: "1",
      name: "Dr. Sarah Williams",
      role: "Therapist",
      availability: {
        monday: [{ start: "09:00", end: "17:00" }],
        tuesday: [{ start: "09:00", end: "17:00" }],
        wednesday: [{ start: "09:00", end: "17:00" }],
        thursday: [{ start: "09:00", end: "17:00" }],
        friday: [{ start: "09:00", end: "17:00" }],
        saturday: [],
        sunday: [],
      },
      timeOff: [
        { date: "2023-04-15", reason: "Personal Day" },
        { date: "2023-04-16", reason: "Personal Day" },
      ],
    },
    {
      id: "2",
      name: "Dr. Michael Johnson",
      role: "Psychiatrist",
      availability: {
        monday: [{ start: "10:00", end: "18:00" }],
        tuesday: [{ start: "10:00", end: "18:00" }],
        wednesday: [],
        thursday: [{ start: "10:00", end: "18:00" }],
        friday: [{ start: "10:00", end: "18:00" }],
        saturday: [],
        sunday: [],
      },
      timeOff: [
        { date: "2023-04-12", reason: "Conference" },
        { date: "2023-04-13", reason: "Conference" },
        { date: "2023-04-14", reason: "Conference" },
      ],
    },
    {
      id: "3",
      name: "Jane Wilson",
      role: "Case Manager",
      availability: {
        monday: [{ start: "08:00", end: "16:00" }],
        tuesday: [{ start: "08:00", end: "16:00" }],
        wednesday: [{ start: "08:00", end: "16:00" }],
        thursday: [{ start: "08:00", end: "16:00" }],
        friday: [{ start: "08:00", end: "16:00" }],
        saturday: [],
        sunday: [],
      },
      timeOff: [],
    },
    {
      id: "4",
      name: "Robert Brown",
      role: "Counselor",
      availability: {
        monday: [],
        tuesday: [{ start: "12:00", end: "20:00" }],
        wednesday: [{ start: "12:00", end: "20:00" }],
        thursday: [{ start: "12:00", end: "20:00" }],
        friday: [{ start: "12:00", end: "20:00" }],
        saturday: [{ start: "10:00", end: "14:00" }],
        sunday: [],
      },
      timeOff: [
        { date: "2023-04-22", reason: "Vacation" },
        { date: "2023-04-23", reason: "Vacation" },
        { date: "2023-04-24", reason: "Vacation" },
        { date: "2023-04-25", reason: "Vacation" },
        { date: "2023-04-26", reason: "Vacation" },
      ],
    },
    {
      id: "5",
      name: "Lisa Davis",
      role: "Nurse",
      availability: {
        monday: [{ start: "07:00", end: "15:00" }],
        tuesday: [{ start: "07:00", end: "15:00" }],
        wednesday: [{ start: "07:00", end: "15:00" }],
        thursday: [{ start: "07:00", end: "15:00" }],
        friday: [{ start: "07:00", end: "15:00" }],
        saturday: [],
        sunday: [],
      },
      timeOff: [{ date: "2023-04-17", reason: "Medical Appointment" }],
    },
  ]

  return (
    <Tabs defaultValue="regular">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="regular">Regular Availability</TabsTrigger>
          <TabsTrigger value="timeoff">Time Off Requests</TabsTrigger>
        </TabsList>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Time Off
        </Button>
      </div>

      <TabsContent value="regular" className="space-y-4">
        {staffMembers.map((staff) => (
          <Card key={staff.id}>
            <CardHeader className="pb-2">
              <CardTitle>{staff.name}</CardTitle>
              <CardDescription>{staff.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => {
                  const dayKey = day.toLowerCase() as keyof typeof staff.availability
                  const dayAvailability = staff.availability[dayKey]

                  return (
                    <div key={day} className="space-y-2">
                      <div className="text-sm font-medium">{day}</div>
                      {dayAvailability.length > 0 ? (
                        dayAvailability.map((slot, slotIndex) => (
                          <div key={slotIndex} className="text-xs p-2 bg-primary/10 rounded-md text-center">
                            {slot.start} - {slot.end}
                          </div>
                        ))
                      ) : (
                        <div className="text-xs p-2 bg-muted rounded-md text-center text-muted-foreground">
                          Not Available
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="timeoff" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {staffMembers.map((staff) => (
            <Card key={staff.id}>
              <CardHeader>
                <CardTitle>{staff.name}</CardTitle>
                <CardDescription>{staff.role}</CardDescription>
              </CardHeader>
              <CardContent>
                {staff.timeOff.length > 0 ? (
                  <div className="space-y-2">
                    {staff.timeOff.map((timeOff, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                        <div>
                          <div className="font-medium">{new Date(timeOff.date).toLocaleDateString()}</div>
                          <div className="text-sm text-muted-foreground">{timeOff.reason}</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No time off requests</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
