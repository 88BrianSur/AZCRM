"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Mail, Phone, MapPin, User, Briefcase, Heart, FileText, Edit, UserPlus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { mockAlumni } from "./alumni-list"
import { EditAlumniDialog } from "./edit-alumni-dialog"

interface ViewAlumniDialogProps {
  alumni: (typeof mockAlumni)[0]
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: (updatedAlumni: (typeof mockAlumni)[0]) => void
}

export function ViewAlumniDialog({ alumni, open, onOpenChange, onUpdate }: ViewAlumniDialogProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentAlumni, setCurrentAlumni] = useState<(typeof mockAlumni)[0]>(alumni)

  // Update local alumni data when prop changes
  if (alumni.id !== currentAlumni.id) {
    setCurrentAlumni(alumni)
  }

  const handleAlumniUpdate = (updatedAlumni: (typeof mockAlumni)[0]) => {
    setCurrentAlumni(updatedAlumni)
    if (onUpdate) {
      onUpdate(updatedAlumni)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {currentAlumni.firstName} {currentAlumni.lastName}
                </DialogTitle>
                <DialogDescription className="mt-1 flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(currentAlumni.status)}>{currentAlumni.status}</Badge>
                  {currentAlumni.sobrietyDays !== null && (
                    <Badge variant="outline" className="bg-primary/5">
                      {currentAlumni.sobrietyDays} days sober
                    </Badge>
                  )}
                </DialogDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="program">Program</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="h-[60vh] mt-2">
              <TabsContent value="overview" className="p-6 pt-2">
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <Mail className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <div>{currentAlumni.email}</div>
                          <div className="text-muted-foreground">Email</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <div>{currentAlumni.phone}</div>
                          <div className="text-muted-foreground">Phone</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <div>{currentAlumni.address}</div>
                          <div className="text-muted-foreground">Address</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <div>{new Date(currentAlumni.birthDate).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">Birth Date</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <div>{currentAlumni.gender}</div>
                          <div className="text-muted-foreground">Gender</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Briefcase className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <div>{currentAlumni.employmentStatus}</div>
                          <div className="text-muted-foreground">Employment Status</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Emergency Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <UserPlus className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <div>{currentAlumni.emergencyContact.name}</div>
                          <div className="text-muted-foreground">Name</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Heart className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <div>{currentAlumni.emergencyContact.relationship}</div>
                          <div className="text-muted-foreground">Relationship</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <div>{currentAlumni.emergencyContact.phone}</div>
                          <div className="text-muted-foreground">Phone</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="program" className="p-6 pt-2">
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Program Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <div>{currentAlumni.programDetails.program}</div>
                          <div className="text-muted-foreground">Program Type</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <div>{currentAlumni.programDetails.duration}</div>
                          <div className="text-muted-foreground">Duration</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <div>{currentAlumni.programDetails.counselor}</div>
                          <div className="text-muted-foreground">Counselor</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Recovery Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <div>{new Date(currentAlumni.graduationDate).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">Graduation Date</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <div>{new Date(currentAlumni.lastContact).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">Last Contact</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Badge variant={currentAlumni.sobrietyDays !== null ? "success" : "outline"} className="mt-1">
                          {currentAlumni.sobrietyDays !== null
                            ? `${currentAlumni.sobrietyDays} days sober`
                            : "Sobriety unknown"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="p-6 pt-2">
                <div className="space-y-4">
                  {currentAlumni.notes.length > 0 ? (
                    currentAlumni.notes.map((note, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center justify-between">
                            <span>{new Date(note.date).toLocaleDateString()}</span>
                            <Badge variant="outline" className="font-normal">
                              Note
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <p>{note.content}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center text-muted-foreground">
                        <p>No notes available for this alumni.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </ScrollArea>

            <DialogFooter className="p-6 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Alumni
              </Button>
            </DialogFooter>
          </Tabs>
        </DialogContent>
      </Dialog>

      {isEditDialogOpen && (
        <EditAlumniDialog
          alumni={currentAlumni}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleAlumniUpdate}
        />
      )}
    </>
  )
}

// Helper function to determine badge variant based on status
function getStatusBadgeVariant(
  status: string,
): "default" | "secondary" | "outline" | "destructive" | "success" | "warning" {
  switch (status) {
    case "Active":
      return "success"
    case "Engaged":
      return "secondary"
    case "Inactive":
      return "outline"
    case "Lost Contact":
      return "destructive"
    default:
      return "outline"
  }
}
