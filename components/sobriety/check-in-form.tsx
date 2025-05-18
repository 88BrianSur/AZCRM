"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { addSobrietyCheckIn } from "@/app/actions/sobriety-actions"
import { useToast } from "@/hooks/use-toast"

interface CheckInFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  onCheckInComplete?: () => void
}

export function CheckInForm({ open, onOpenChange, clientId, onCheckInComplete }: CheckInFormProps) {
  const [status, setStatus] = useState<"sober" | "relapse">("sober")
  const [notes, setNotes] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await addSobrietyCheckIn(clientId, {
        status,
        notes,
        check_in_date: date.toISOString(),
      })

      toast({
        title: "Check-in recorded",
        description:
          status === "sober"
            ? "Sobriety check-in has been recorded successfully."
            : "Relapse has been recorded. Remember, recovery is a journey with ups and downs.",
      })

      // Reset form
      setStatus("sober")
      setNotes("")
      setDate(new Date())

      // Close dialog and notify parent
      onOpenChange(false)
      if (onCheckInComplete) {
        onCheckInComplete()
      }
    } catch (error) {
      console.error("Error recording check-in:", error)
      toast({
        title: "Error",
        description: "Failed to record check-in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Sobriety Check-In</DialogTitle>
          <DialogDescription>Track your sobriety journey by recording daily check-ins.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal mt-1", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Status</Label>
              <RadioGroup
                value={status}
                onValueChange={(value) => setStatus(value as "sober" | "relapse")}
                className="flex flex-col space-y-1 mt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sober" id="sober" />
                  <Label htmlFor="sober" className="cursor-pointer">
                    Maintained sobriety
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="relapse" id="relapse" />
                  <Label htmlFor="relapse" className="cursor-pointer">
                    Experienced a relapse
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about your day, feelings, triggers, or achievements..."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Record Check-In"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
