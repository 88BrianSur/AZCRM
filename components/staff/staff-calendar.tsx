"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Edit, Trash2, Plus, Clock, ChevronLeft, ChevronRight } from "lucide-react"

interface StaffCalendarProps {
  view: "weekly" | "monthly"
  onAddShift: (shiftData: any) => void
  onEditShift: (shiftData: any) => void
  onDeleteShift: (shiftId: string) => void
}

// Staff color mapping
const STAFF_COLORS = {
  "1": {
    bg: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-800 dark:text-blue-100",
    border: "border-blue-200 dark:border-blue-800",
    color: "#3b82f6",
  },
  "2": {
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-800 dark:text-green-100",
    border: "border-green-200 dark:border-green-800",
    color: "#22c55e",
  },
  "3": {
    bg: "bg-purple-100 dark:bg-purple-900",
    text: "text-purple-800 dark:text-purple-100",
    border: "border-purple-200 dark:border-purple-800",
    color: "#a855f7",
  },
  "4": {
    bg: "bg-amber-100 dark:bg-amber-900",
    text: "text-amber-800 dark:text-amber-100",
    border: "border-amber-200 dark:border-amber-800",
    color: "#f59e0b",
  },
  "5": {
    bg: "bg-rose-100 dark:bg-rose-900",
    text: "text-rose-800 dark:text-rose-100",
    border: "border-rose-200 dark:border-rose-800",
    color: "#f43f5e",
  },
}

export function StaffCalendar({ view, onAddShift, onEditShift, onDeleteShift }: StaffCalendarProps) {
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false)
  const [isEditShiftOpen, setIsEditShiftOpen] = useState(false)
  const [isDeleteShiftOpen, setIsDeleteShiftOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAllShiftsOpen, setIsAllShiftsOpen] = useState(false)
  const [dayShifts, setDayShifts] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Mock data for staff and shifts
  const staffMembers = [
    { id: "1", name: "Dr. Sarah Williams", role: "Therapist" },
    { id: "2", name: "Dr. Michael Johnson", role: "Psychiatrist" },
    { id: "3", name: "Jane Wilson", role: "Case Manager" },
    { id: "4", name: "Robert Brown", role: "Counselor" },
    { id: "5", name: "Lisa Davis", role: "Nurse" },
  ]

  const shifts = [
    {
      id: "1",
      staffId: "1",
      staffName: "Dr. Sarah Williams",
      date: "2023-04-10",
      startTime: "09:00",
      endTime: "17:00",
      role: "Therapist",
    },
    {
      id: "2",
      staffId: "2",
      staffName: "Dr. Michael Johnson",
      date: "2023-04-10",
      startTime: "10:00",
      endTime: "18:00",
      role: "Psychiatrist",
    },
    {
      id: "3",
      staffId: "3",
      staffName: "Jane Wilson",
      date: "2023-04-10",
      startTime: "08:00",
      endTime: "16:00",
      role: "Case Manager",
    },
    {
      id: "4",
      staffId: "4",
      staffName: "Robert Brown",
      date: "2023-04-12",
      startTime: "12:00",
      endTime: "20:00",
      role: "Counselor",
    },
    {
      id: "5",
      staffId: "5",
      staffName: "Lisa Davis",
      date: "2023-04-13",
      startTime: "07:00",
      endTime: "15:00",
      role: "Nurse",
    },
    {
      id: "6",
      staffId: "1",
      staffName: "Dr. Sarah Williams",
      date: "2023-04-12",
      startTime: "09:00",
      endTime: "17:00",
      role: "Therapist",
    },
    {
      id: "7",
      staffId: "2",
      staffName: "Dr. Michael Johnson",
      date: "2023-04-13",
      startTime: "10:00",
      endTime: "18:00",
      role: "Psychiatrist",
    },
  ]

  const handleAddShift = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsAddShiftOpen(false)
      onAddShift({
        staffId: "1",
        staffName: "Dr. Sarah Williams",
        date: "2023-04-14",
        startTime: "09:00",
        endTime: "17:00",
        role: "Therapist",
      })
    }, 1000)
  }

  const handleEditShift = () => {
    if (!selectedShift) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsEditShiftOpen(false)
      onEditShift({
        ...selectedShift,
        startTime: "10:00",
        endTime: "18:00",
      })
    }, 1000)
  }

  const handleDeleteShift = () => {
    if (!selectedShift) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsDeleteShiftOpen(false)
      onDeleteShift(selectedShift.id)
    }, 1000)
  }

  const openEditShiftDialog = (shift: any) => {
    setSelectedShift(shift)
    setIsEditShiftOpen(true)
  }

  const openDeleteShiftDialog = (shift: any) => {
    setSelectedShift(shift)
    setIsDeleteShiftOpen(true)
  }

  const openAllShiftsDialog = (shifts: any[], date: string) => {
    setDayShifts(shifts)
    setSelectedDate(date)
    setIsAllShiftsOpen(true)
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {staffMembers.map((staff) => (
            <div key={staff.id} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: STAFF_COLORS[staff.id as keyof typeof STAFF_COLORS].color }}
              />
              <span className="text-xs">{staff.name}</span>
            </div>
          ))}
        </div>
        <Button onClick={() => setIsAddShiftOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Shift
        </Button>
      </div>

      {view === "weekly" ? (
        <WeeklyCalendarView
          shifts={shifts}
          staffColors={STAFF_COLORS}
          onEditShift={openEditShiftDialog}
          onDeleteShift={openDeleteShiftDialog}
          onViewAllShifts={openAllShiftsDialog}
        />
      ) : (
        <MonthlyCalendarView
          shifts={shifts}
          staffColors={STAFF_COLORS}
          onEditShift={openEditShiftDialog}
          onDeleteShift={openDeleteShiftDialog}
          onViewAllShifts={openAllShiftsDialog}
          currentMonth={currentMonth}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
        />
      )}

      {/* Add Shift Dialog */}
      <Dialog open={isAddShiftOpen} onOpenChange={setIsAddShiftOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Shift</DialogTitle>
            <DialogDescription>Create a new staff shift in the schedule.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="staff">Staff Member</Label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name} ({staff.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" defaultValue="2023-04-14" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" type="time" defaultValue="09:00" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" type="time" defaultValue="17:00" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input id="notes" placeholder="Any special instructions or notes" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddShiftOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddShift} disabled={isSubmitting}>
              {isSubmitting ? <LoadingSpinner className="mr-2" /> : null}
              {isSubmitting ? "Adding..." : "Add Shift"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Shift Dialog */}
      <Dialog open={isEditShiftOpen} onOpenChange={setIsEditShiftOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Shift</DialogTitle>
            <DialogDescription>Modify the selected staff shift.</DialogDescription>
          </DialogHeader>
          {selectedShift && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-staff">Staff Member</Label>
                <Select defaultValue={selectedShift.staffId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name} ({staff.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input id="edit-date" type="date" defaultValue={selectedShift.date} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-startTime">Start Time</Label>
                  <Input id="edit-startTime" type="time" defaultValue={selectedShift.startTime} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-endTime">End Time</Label>
                  <Input id="edit-endTime" type="time" defaultValue={selectedShift.endTime} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Notes (Optional)</Label>
                <Input id="edit-notes" placeholder="Any special instructions or notes" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditShiftOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditShift} disabled={isSubmitting}>
              {isSubmitting ? <LoadingSpinner className="mr-2" /> : null}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Shift Dialog */}
      <Dialog open={isDeleteShiftOpen} onOpenChange={setIsDeleteShiftOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Shift</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this shift? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedShift && (
            <div className="py-4">
              <p>
                <strong>Staff:</strong> {selectedShift.staffName}
              </p>
              <p>
                <strong>Date:</strong> {selectedShift.date}
              </p>
              <p>
                <strong>Time:</strong> {selectedShift.startTime} - {selectedShift.endTime}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteShiftOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteShift} disabled={isSubmitting}>
              {isSubmitting ? <LoadingSpinner className="mr-2" /> : null}
              {isSubmitting ? "Deleting..." : "Delete Shift"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* All Shifts for a Day Dialog */}
      <Dialog open={isAllShiftsOpen} onOpenChange={setIsAllShiftsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>All Shifts for {selectedDate}</DialogTitle>
            <DialogDescription>Viewing all scheduled shifts for this day.</DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              {dayShifts.map((shift) => {
                const staffColor = STAFF_COLORS[shift.staffId as keyof typeof STAFF_COLORS]
                return (
                  <Card key={shift.id} className={`${staffColor.border} border-l-4`}>
                    <CardContent className="p-4 flex justify-between items-start">
                      <div>
                        <div className="font-medium">{shift.staffName}</div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {shift.startTime} - {shift.endTime}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{shift.role}</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsAllShiftsOpen(false)
                            openEditShiftDialog(shift)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsAllShiftsOpen(false)
                            openDeleteShiftDialog(shift)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAllShiftsOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsAllShiftsOpen(false)
                setIsAddShiftOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function WeeklyCalendarView({ shifts, staffColors, onEditShift, onDeleteShift, onViewAllShifts }: any) {
  // Mock data for days of the week
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const hours = Array.from({ length: 14 }, (_, i) => i + 7) // 7 AM to 8 PM

  // Group shifts by day and hour
  const shiftsByDayAndHour = days.map((day, dayIndex) => {
    return hours.map((hour) => {
      // Find shifts for this day and hour
      return shifts.filter(
        (shift: any) =>
          new Date(shift.date).getDay() === (dayIndex + 1) % 7 &&
          Number.parseInt(shift.startTime.split(":")[0]) <= hour &&
          Number.parseInt(shift.endTime.split(":")[0]) > hour,
      )
    })
  })

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-8 gap-2">
          <div className="sticky left-0 bg-background p-2"></div>
          {days.map((day) => (
            <div key={day} className="p-2 text-center font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-8 gap-2">
          <div className="sticky left-0 bg-background space-y-2">
            {hours.map((hour) => (
              <div key={hour} className="h-20 p-2 text-sm text-muted-foreground">
                {hour}:00
              </div>
            ))}
          </div>
          {days.map((day, dayIndex) => (
            <div key={day} className="space-y-2">
              {hours.map((hour, hourIndex) => {
                const dayShifts = shiftsByDayAndHour[dayIndex][hourIndex]
                const hasMultipleShifts = dayShifts.length > 1

                return (
                  <div key={hour} className="h-20 border border-dashed rounded-md p-1 relative">
                    {dayShifts.length > 0 && (
                      <>
                        {/* Show first shift */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Card
                                className={`${staffColors[dayShifts[0].staffId].bg} ${staffColors[dayShifts[0].staffId].text} ${staffColors[dayShifts[0].staffId].border} border-l-4 h-full hover:bg-opacity-80 cursor-pointer transition-all`}
                                onClick={() => onEditShift(dayShifts[0])}
                              >
                                <CardContent className="p-2 text-xs">
                                  <div className="font-medium truncate">{dayShifts[0].staffName}</div>
                                  <div className="text-muted-foreground">
                                    {dayShifts[0].startTime} - {dayShifts[0].endTime}
                                  </div>
                                </CardContent>
                              </Card>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1">
                                <p className="font-medium">{dayShifts[0].staffName}</p>
                                <p>{dayShifts[0].role}</p>
                                <p>
                                  {dayShifts[0].startTime} - {dayShifts[0].endTime}
                                </p>
                                <div className="flex space-x-2 mt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onEditShift(dayShifts[0])
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onDeleteShift(dayShifts[0])
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Show indicator for additional shifts */}
                        {hasMultipleShifts && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-1 right-1 text-xs py-0 h-6"
                            onClick={() => onViewAllShifts(dayShifts, `${day}, ${hour}:00`)}
                          >
                            +{dayShifts.length - 1} more
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MonthlyCalendarView({
  shifts,
  staffColors,
  onEditShift,
  onDeleteShift,
  onViewAllShifts,
  currentMonth,
  prevMonth,
  nextMonth,
}: any) {
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  // Create calendar days array with empty slots for days from previous/next months
  const calendarDays = []

  // Add empty slots for days from previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Add days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  // Calculate rows needed (6 rows max in a month view)
  const rows = Math.ceil(calendarDays.length / 7)

  // Fill remaining slots with null for next month
  const remainingSlots = rows * 7 - calendarDays.length
  for (let i = 0; i < remainingSlots; i++) {
    calendarDays.push(null)
  }

  // Group shifts by day
  const shiftsByDay: Record<string, any[]> = {}

  shifts.forEach((shift: any) => {
    const shiftDate = new Date(shift.date)
    if (shiftDate.getMonth() === month && shiftDate.getFullYear() === year) {
      const day = shiftDate.getDate()
      if (!shiftsByDay[day]) {
        shiftsByDay[day] = []
      }
      shiftsByDay[day].push(shift)
    }
  })

  // Format month name
  const monthName = currentMonth.toLocaleString("default", { month: "long" })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <h2 className="text-xl font-semibold">
          {monthName} {year}
        </h2>
        <Button variant="outline" size="sm" onClick={nextMonth}>
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center font-medium bg-muted">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`min-h-[120px] border rounded-md p-2 ${day === null ? "bg-muted/30" : "bg-background"}`}
          >
            {day !== null && (
              <>
                <div className="font-medium mb-2">{day}</div>
                <div className="space-y-1 overflow-y-auto max-h-[80px]">
                  {shiftsByDay[day]?.slice(0, 2).map((shift: any) => {
                    const staffColor = staffColors[shift.staffId]
                    return (
                      <div
                        key={shift.id}
                        className={`text-xs p-1 rounded cursor-pointer ${staffColor.bg} ${staffColor.text} ${staffColor.border} border-l-2`}
                        onClick={() => onEditShift(shift)}
                      >
                        <div className="font-medium truncate">{shift.staffName}</div>
                        <div className="text-muted-foreground">
                          {shift.startTime} - {shift.endTime}
                        </div>
                      </div>
                    )
                  })}

                  {shiftsByDay[day]?.length > 2 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full text-xs mt-1"
                      onClick={() => onViewAllShifts(shiftsByDay[day], `${monthName} ${day}, ${year}`)}
                    >
                      +{shiftsByDay[day].length - 2} more
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
