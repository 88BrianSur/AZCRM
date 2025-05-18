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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { mockAlumni } from "./alumni-list"

interface RecordContactDialogProps {
  alumni: (typeof mockAlumni)[0]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (updatedAlumni: (typeof mockAlumni)[0]) => void
}

export function RecordContactDialog({ alumni, open, onOpenChange, onSave }: RecordContactDialogProps) {
  const { toast } = useToast()
  const [contactType, setContactType] = useState("Phone Call")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create updated alumni object with new contact record
    const today = new Date().toISOString().split("T")[0]
    const updatedAlumni = {
      ...alumni,
      lastContact: today,
      notes: [
        {
          date: today,
          content: `${contactType}: ${notes}`,
        },
        ...alumni.notes,
      ],
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onOpenChange(false)

      // Reset form
      setContactType("Phone Call")
      setNotes("")

      // Call the onSave callback with the updated alumni
      if (onSave) {
        onSave(updatedAlumni)
      }

      toast({
        title: "Contact Recorded",
        description: `Contact with ${alumni.firstName} ${alumni.lastName} has been recorded.`,
      })
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Contact</DialogTitle>
          <DialogDescription>
            Record a new contact with {alumni.firstName} {alumni.lastName}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contactType">Contact Type</Label>
              <Select value={contactType} onValueChange={setContactType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contact type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Phone Call">Phone Call</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="In-Person">In-Person</SelectItem>
                  <SelectItem value="Video Call">Video Call</SelectItem>
                  <SelectItem value="Text Message">Text Message</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter details about the contact..."
                rows={5}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
