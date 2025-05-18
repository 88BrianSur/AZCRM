"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { mockAlumni } from "./alumni-list"

interface UpdateSobrietyDialogProps {
  alumni: (typeof mockAlumni)[0]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (updatedAlumni: (typeof mockAlumni)[0]) => void
}

export function UpdateSobrietyDialog({ alumni, open, onOpenChange, onSave }: UpdateSobrietyDialogProps) {
  const { toast } = useToast()
  const [sobrietyStatus, setSobrietyStatus] = useState(alumni.sobrietyDays !== null ? "maintaining" : "unknown")
  const [sobrietyDate, setSobrietyDate] = useState<Date | undefined>(
    alumni.sobrietyDays !== null ? new Date(Date.now() - alumni.sobrietyDays * 24 * 60 * 60 * 1000) : undefined,
  )
  const [sobrietyDays, setSobrietyDays] = useState<number | null>(alumni.sobrietyDays)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculateSobrietyDays = (date: Date) => {
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleSobrietyDateChange = (date: Date | undefined) => {
    setSobrietyDate(date)
    if (date) {
      setSobrietyDays(calculateSobrietyDays(date))
    } else {
      setSobrietyDays(null)
    }
  }

  const handleStatusChange = (value: string) => {
    setSobrietyStatus(value)
    if (value === "unknown") {
      setSobrietyDays(null)
      setSobrietyDate(undefined)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create updated alumni object with new sobriety information
    const today = new Date().toISOString().split("T")[0]
    const updatedAlumni = {
      ...alumni,
      sobrietyDays: sobrietyStatus === "unknown" ? null : sobrietyDays,
      notes: [
        {
          date: today,
          content: `Sobriety Update: ${
            sobrietyStatus === "unknown"
              ? "Status unknown"
              : sobrietyStatus === "maintaining"
                ? `Maintaining sobriety - ${sobrietyDays} days`
                : `Relapse reported - Restarting sobriety count`
          }${notes ? ` - ${notes}` : ""}`,
        },
        ...alumni.notes,
      ],
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onOpenChange(false)

      // Call the onSave callback with the updated alumni
      if (onSave) {
        onSave(updatedAlumni)
      }

      toast({
        title: "Sobriety Updated",
        description: `Sobriety information for ${alumni.firstName} ${alumni.lastName} has been updated.`,
      })
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Sobriety</DialogTitle>
          <DialogDescription>
            Update sobriety information for {alumni.firstName} {alumni.lastName}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Current Status</Label>
              <RadioGroup value={sobrietyStatus} onValueChange={handleStatusChange} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maintaining" id="maintaining" />
                  <Label htmlFor="maintaining" className="cursor-pointer">
                    Maintaining Sobriety
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="relapse" id="relapse" />
                  <Label htmlFor="relapse" className="cursor-pointer">
                    Relapse Reported
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unknown" id="unknown" />
                  <Label htmlFor="unknown" className="cursor-pointer">
                    Status Unknown
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {sobrietyStatus !== "unknown" && (
              <div className="space-y-2">
                <Label>Sobriety Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !sobrietyDate && "text-muted-foreground",
                      )}
                      disabled={sobrietyStatus === "unknown"}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {sobrietyDate ? format(sobrietyDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={sobrietyDate}
                      onSelect={handleSobrietyDateChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {sobrietyDays !== null && (
                  <div className="text-sm text-muted-foreground mt-1">{sobrietyDays} days of sobriety as of today</div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional information..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
