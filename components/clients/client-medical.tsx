"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, AlertTriangle } from "lucide-react"
import { EmptyState } from "@/components/empty-state"

interface ClientMedicalProps {
  clientId: string
}

export function ClientMedical({ clientId }: ClientMedicalProps) {
  // Mock data - in a real app, this would come from an API or database
  const medicalData = {
    allergies: "Penicillin, Peanuts",
    medications: [
      {
        id: "1",
        name: "Sertraline",
        dosage: "50mg",
        frequency: "Once daily",
        startDate: "2023-01-20",
        prescribedBy: "Dr. Johnson",
        notes: "For depression and anxiety",
      },
      {
        id: "2",
        name: "Lorazepam",
        dosage: "0.5mg",
        frequency: "As needed",
        startDate: "2023-01-20",
        prescribedBy: "Dr. Johnson",
        notes: "For acute anxiety episodes",
      },
    ],
    conditions: [
      {
        id: "1",
        name: "Major Depressive Disorder",
        diagnosedDate: "2022-11-15",
        diagnosedBy: "Dr. Smith",
        status: "Active",
        notes: "Moderate severity",
      },
      {
        id: "2",
        name: "Generalized Anxiety Disorder",
        diagnosedDate: "2022-11-15",
        diagnosedBy: "Dr. Smith",
        status: "Active",
        notes: "Responds well to medication",
      },
    ],
    vitals: [
      {
        id: "1",
        date: "2023-05-10",
        bloodPressure: "120/80",
        heartRate: "72",
        temperature: "98.6",
        weight: "180",
        notes: "Stable",
      },
      {
        id: "2",
        date: "2023-04-12",
        bloodPressure: "118/78",
        heartRate: "70",
        temperature: "98.4",
        weight: "182",
        notes: "Slight weight gain",
      },
    ],
  }

  const hasMedicalData =
    medicalData.medications.length > 0 || medicalData.conditions.length > 0 || medicalData.vitals.length > 0

  if (!hasMedicalData) {
    return (
      <EmptyState
        title="No medical information"
        description="No medical information has been recorded for this client yet."
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Medical Information
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Medical Information</h3>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Record
        </Button>
      </div>

      {/* Allergies */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
            Allergies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{medicalData.allergies || "None reported"}</p>
        </CardContent>
      </Card>

      {/* Medications */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Current Medications</CardTitle>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add medication</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {medicalData.medications.length > 0 ? (
            <div className="space-y-4">
              {medicalData.medications.map((med) => (
                <div key={med.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{med.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {med.dosage} • {med.frequency}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>
                      <span className="font-medium">Started:</span> {med.startDate}
                    </p>
                    <p>
                      <span className="font-medium">Prescribed by:</span> {med.prescribedBy}
                    </p>
                    {med.notes && <p className="mt-1">{med.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No medications recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Medical Conditions */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Medical Conditions</CardTitle>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add condition</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {medicalData.conditions.length > 0 ? (
            <div className="space-y-4">
              {medicalData.conditions.map((condition) => (
                <div key={condition.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{condition.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Status: <span className="font-medium">{condition.status}</span>
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>
                      <span className="font-medium">Diagnosed:</span> {condition.diagnosedDate} by{" "}
                      {condition.diagnosedBy}
                    </p>
                    {condition.notes && <p className="mt-1">{condition.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No medical conditions recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Vitals */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Vital Signs History</CardTitle>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add vitals</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {medicalData.vitals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium py-2">Date</th>
                    <th className="text-left font-medium py-2">BP</th>
                    <th className="text-left font-medium py-2">HR</th>
                    <th className="text-left font-medium py-2">Temp</th>
                    <th className="text-left font-medium py-2">Weight</th>
                    <th className="text-left font-medium py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {medicalData.vitals.map((vital) => (
                    <tr key={vital.id} className="border-b">
                      <td className="py-2">{vital.date}</td>
                      <td className="py-2">{vital.bloodPressure}</td>
                      <td className="py-2">{vital.heartRate}</td>
                      <td className="py-2">{vital.temperature}°F</td>
                      <td className="py-2">{vital.weight} lbs</td>
                      <td className="py-2">{vital.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No vital signs recorded</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
