"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { addMilestoneNote } from "@/app/actions/sobriety-actions"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { CheckCircle, Clock } from "lucide-react"

interface MilestoneProgressProps {
  currentStreak: number
  milestones: any[]
  clientId: string
}

export function MilestoneProgress({ currentStreak, milestones, clientId }: MilestoneProgressProps) {
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null)
  const [noteText, setNoteText] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Standard milestones to track
  const standardMilestones = [30, 60, 90, 180, 365, 730, 1095] // 30, 60, 90 days, 6 months, 1, 2, 3 years

  const handleSaveNote = async (milestoneId: string) => {
    if (!noteText.trim()) return

    setIsSaving(true)
    try {
      await addMilestoneNote(milestoneId, noteText)
      toast({
        title: "Note saved",
        description: "Your milestone note has been saved successfully.",
      })
      setEditingMilestone(null)
      setNoteText("")
    } catch (error) {
      console.error("Error saving note:", error)
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getMilestoneStatus = (days: number) => {
    const milestone = milestones.find((m) => m.days === days)
    if (milestone) {
      return { achieved: true, date: milestone.achieved_date, id: milestone.id, notes: milestone.notes }
    }
    return { achieved: false, date: null, id: null, notes: null }
  }

  return (
    <div className="space-y-6">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary text-primary-foreground">
              Current Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block">
              {currentStreak} / {standardMilestones[standardMilestones.length - 1]} days
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
          <div
            style={{
              width: `${Math.min(100, (currentStreak / standardMilestones[standardMilestones.length - 1]) * 100)}%`,
            }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
          ></div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {standardMilestones.map((days) => {
          const status = getMilestoneStatus(days)

          return (
            <Card key={days} className={`border ${status.achieved ? "border-green-200" : "border-gray-200"}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {status.achieved ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <h3 className="font-medium">
                      {days} Days
                      {days === 30 && " (1 Month)"}
                      {days === 60 && " (2 Months)"}
                      {days === 90 && " (3 Months)"}
                      {days === 180 && " (6 Months)"}
                      {days === 365 && " (1 Year)"}
                      {days === 730 && " (2 Years)"}
                      {days === 1095 && " (3 Years)"}
                    </h3>
                  </div>

                  <Badge variant={status.achieved ? "default" : "outline"}>
                    {status.achieved ? "Achieved" : `${Math.max(0, days - currentStreak)} days left`}
                  </Badge>
                </div>

                {status.achieved && status.date && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Achieved on {format(new Date(status.date), "MMMM d, yyyy")}
                  </p>
                )}

                {status.achieved && editingMilestone === status.id ? (
                  <div className="mt-3 space-y-2">
                    <Textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add a note about this milestone..."
                      className="text-sm"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingMilestone(null)
                          setNoteText("")
                        }}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={() => handleSaveNote(status.id!)} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Note"}
                      </Button>
                    </div>
                  </div>
                ) : status.achieved && status.notes ? (
                  <div className="mt-3">
                    <p className="text-sm">{status.notes}</p>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto mt-1"
                      onClick={() => {
                        setEditingMilestone(status.id!)
                        setNoteText(status.notes)
                      }}
                    >
                      Edit Note
                    </Button>
                  </div>
                ) : status.achieved ? (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto mt-2"
                    onClick={() => {
                      setEditingMilestone(status.id!)
                      setNoteText("")
                    }}
                  >
                    Add Note
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
