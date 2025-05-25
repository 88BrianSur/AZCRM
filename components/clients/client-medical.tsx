"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, AlertTriangle, Edit, Trash2, Save, X } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"

interface ClientMedicalProps {
  clientId: string
}

// Mock data for fallback
const MOCK_MEDICAL_DATA = {
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

export function ClientMedical({ clientId }: ClientMedicalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [medicalData, setMedicalData] = useState({
    allergies: "",
    medications: [],
    conditions: [],
    vitals: [],
  })
  const [usingMockData, setUsingMockData] = useState(false)
  const [editingAllergies, setEditingAllergies] = useState(false)
  const [allergiesValue, setAllergiesValue] = useState("")

  // Medication editing states
  const [editingMedication, setEditingMedication] = useState(null)
  const [isAddingMedication, setIsAddingMedication] = useState(false)
  const [medicationForm, setMedicationForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    startDate: "",
    prescribedBy: "",
    notes: "",
  })

  // Condition editing states
  const [editingCondition, setEditingCondition] = useState(null)
  const [isAddingCondition, setIsAddingCondition] = useState(false)
  const [conditionForm, setConditionForm] = useState({
    name: "",
    diagnosedDate: "",
    diagnosedBy: "",
    status: "",
    notes: "",
  })

  // Vital editing states
  const [editingVital, setEditingVital] = useState(null)
  const [isAddingVital, setIsAddingVital] = useState(false)
  const [vitalForm, setVitalForm] = useState({
    date: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
    notes: "",
  })

  // Delete confirmation
  const [deleteType, setDeleteType] = useState("")
  const [deleteId, setDeleteId] = useState("")
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

  useEffect(() => {
    fetchMedicalData()
  }, [clientId])

  const fetchMedicalData = async () => {
    setLoading(true)
    try {
      // Immediately use mock data without trying to access the database
      // This avoids the error message when the table doesn't exist
      setMedicalData(MOCK_MEDICAL_DATA)
      setUsingMockData(true)
    } catch (error) {
      console.error("Error fetching medical data:", error)
      // Already using mock data, so no need to set it again
    } finally {
      setLoading(false)
    }
  }

  const saveMedicalData = async (updatedData) => {
    try {
      // Since we're using mock data, just update the local state
      setMedicalData({
        ...medicalData,
        ...updatedData,
      })

      toast({
        title: "Medical information updated (Mock)",
        description: "This is a mock update. Connect to Supabase to enable real data persistence.",
      })

      return true
    } catch (error) {
      console.error("Error saving medical data:", error)
      toast({
        title: "Error",
        description: "Failed to update medical information. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  // Allergies handlers
  const handleEditAllergies = () => {
    setAllergiesValue(medicalData.allergies)
    setEditingAllergies(true)
  }

  const handleSaveAllergies = async () => {
    const success = await saveMedicalData({ allergies: allergiesValue })
    if (success) {
      setEditingAllergies(false)
    }
  }

  // Medication handlers
  const handleAddMedication = () => {
    setMedicationForm({
      name: "",
      dosage: "",
      frequency: "",
      startDate: "",
      prescribedBy: "",
      notes: "",
    })
    setIsAddingMedication(true)
  }

  const handleEditMedication = (medication) => {
    setMedicationForm({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      startDate: medication.startDate,
      prescribedBy: medication.prescribedBy,
      notes: medication.notes,
    })
    setEditingMedication(medication.id)
  }

  const handleSaveMedication = async () => {
    const generateId = () => Math.random().toString(36).substring(2, 15)

    let updatedMedications
    if (editingMedication) {
      // Update existing medication
      updatedMedications = medicalData.medications.map((med) =>
        med.id === editingMedication ? { id: med.id, ...medicationForm } : med,
      )
    } else {
      // Add new medication
      updatedMedications = [...medicalData.medications, { id: generateId(), ...medicationForm }]
    }

    const success = await saveMedicalData({ medications: updatedMedications })
    if (success) {
      setIsAddingMedication(false)
      setEditingMedication(null)
    }
  }

  // Condition handlers
  const handleAddCondition = () => {
    setConditionForm({
      name: "",
      diagnosedDate: "",
      diagnosedBy: "",
      status: "",
      notes: "",
    })
    setIsAddingCondition(true)
  }

  const handleEditCondition = (condition) => {
    setConditionForm({
      name: condition.name,
      diagnosedDate: condition.diagnosedDate,
      diagnosedBy: condition.diagnosedBy,
      status: condition.status,
      notes: condition.notes,
    })
    setEditingCondition(condition.id)
  }

  const handleSaveCondition = async () => {
    const generateId = () => Math.random().toString(36).substring(2, 15)

    let updatedConditions
    if (editingCondition) {
      // Update existing condition
      updatedConditions = medicalData.conditions.map((cond) =>
        cond.id === editingCondition ? { id: cond.id, ...conditionForm } : cond,
      )
    } else {
      // Add new condition
      updatedConditions = [...medicalData.conditions, { id: generateId(), ...conditionForm }]
    }

    const success = await saveMedicalData({ conditions: updatedConditions })
    if (success) {
      setIsAddingCondition(false)
      setEditingCondition(null)
    }
  }

  // Vital handlers
  const handleAddVital = () => {
    setVitalForm({
      date: "",
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      weight: "",
      notes: "",
    })
    setIsAddingVital(true)
  }

  const handleEditVital = (vital) => {
    setVitalForm({
      date: vital.date,
      bloodPressure: vital.bloodPressure,
      heartRate: vital.heartRate,
      temperature: vital.temperature,
      weight: vital.weight,
      notes: vital.notes,
    })
    setEditingVital(vital.id)
  }

  const handleSaveVital = async () => {
    const generateId = () => Math.random().toString(36).substring(2, 15)

    let updatedVitals
    if (editingVital) {
      // Update existing vital
      updatedVitals = medicalData.vitals.map((vital) =>
        vital.id === editingVital ? { id: vital.id, ...vitalForm } : vital,
      )
    } else {
      // Add new vital
      updatedVitals = [...medicalData.vitals, { id: generateId(), ...vitalForm }]
    }

    const success = await saveMedicalData({ vitals: updatedVitals })
    if (success) {
      setIsAddingVital(false)
      setEditingVital(null)
    }
  }

  // Delete handlers
  const confirmDelete = (type, id) => {
    setDeleteType(type)
    setDeleteId(id)
    setIsDeleteAlertOpen(true)
  }

  const handleDelete = async () => {
    try {
      const updatedData = { ...medicalData }

      if (deleteType === "medication") {
        updatedData.medications = medicalData.medications.filter((med) => med.id !== deleteId)
      } else if (deleteType === "condition") {
        updatedData.conditions = medicalData.conditions.filter((cond) => cond.id !== deleteId)
      } else if (deleteType === "vital") {
        updatedData.vitals = medicalData.vitals.filter((vital) => vital.id !== deleteId)
      }

      const success = await saveMedicalData(updatedData)
      if (success) {
        setIsDeleteAlertOpen(false)
        toast({
          title: "Item deleted",
          description: `The ${deleteType} has been successfully deleted.`,
        })
      }
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error)
      toast({
        title: "Error",
        description: `Failed to delete ${deleteType}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const hasMedicalData =
    medicalData.allergies ||
    medicalData.medications.length > 0 ||
    medicalData.conditions.length > 0 ||
    medicalData.vitals.length > 0

  if (loading) {
    return <LoadingSpinner />
  }

  if (!hasMedicalData) {
    return (
      <EmptyState
        title="No medical information"
        description="No medical information has been recorded for this client yet."
        action={
          <Button onClick={() => setEditingAllergies(true)}>
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
      </div>

      {usingMockData && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-md mb-4">
          <p className="text-sm">
            Using mock data for demonstration. The client_medical table doesn't exist in the database yet.
          </p>
        </div>
      )}

      {/* Allergies */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
              Allergies
            </CardTitle>
            {!editingAllergies && (
              <Button variant="ghost" size="sm" onClick={handleEditAllergies}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editingAllergies ? (
            <div className="space-y-2">
              <Textarea
                value={allergiesValue}
                onChange={(e) => setAllergiesValue(e.target.value)}
                placeholder="Enter allergies, separated by commas"
                rows={2}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => setEditingAllergies(false)}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveAllergies}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p>{medicalData.allergies || "None reported"}</p>
          )}
        </CardContent>
      </Card>

      {/* Medications */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Current Medications</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleAddMedication}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingMedication || editingMedication ? (
            <div className="border rounded-md p-4 space-y-4">
              <h4 className="font-medium">{editingMedication ? "Edit Medication" : "Add Medication"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="med-name">Medication Name</Label>
                  <Input
                    id="med-name"
                    value={medicationForm.name}
                    onChange={(e) => setMedicationForm({ ...medicationForm, name: e.target.value })}
                    placeholder="Medication name"
                  />
                </div>
                <div>
                  <Label htmlFor="med-dosage">Dosage</Label>
                  <Input
                    id="med-dosage"
                    value={medicationForm.dosage}
                    onChange={(e) => setMedicationForm({ ...medicationForm, dosage: e.target.value })}
                    placeholder="e.g., 50mg"
                  />
                </div>
                <div>
                  <Label htmlFor="med-frequency">Frequency</Label>
                  <Input
                    id="med-frequency"
                    value={medicationForm.frequency}
                    onChange={(e) => setMedicationForm({ ...medicationForm, frequency: e.target.value })}
                    placeholder="e.g., Once daily"
                  />
                </div>
                <div>
                  <Label htmlFor="med-start-date">Start Date</Label>
                  <Input
                    id="med-start-date"
                    type="date"
                    value={medicationForm.startDate}
                    onChange={(e) => setMedicationForm({ ...medicationForm, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="med-prescribed-by">Prescribed By</Label>
                  <Input
                    id="med-prescribed-by"
                    value={medicationForm.prescribedBy}
                    onChange={(e) => setMedicationForm({ ...medicationForm, prescribedBy: e.target.value })}
                    placeholder="Doctor's name"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="med-notes">Notes</Label>
                  <Textarea
                    id="med-notes"
                    value={medicationForm.notes}
                    onChange={(e) => setMedicationForm({ ...medicationForm, notes: e.target.value })}
                    placeholder="Additional notes"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingMedication(false)
                    setEditingMedication(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveMedication}>Save</Button>
              </div>
            </div>
          ) : medicalData.medications.length > 0 ? (
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
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditMedication(med)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => confirmDelete("medication", med.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
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
            <Button variant="ghost" size="sm" onClick={handleAddCondition}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingCondition || editingCondition ? (
            <div className="border rounded-md p-4 space-y-4">
              <h4 className="font-medium">{editingCondition ? "Edit Condition" : "Add Condition"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cond-name">Condition Name</Label>
                  <Input
                    id="cond-name"
                    value={conditionForm.name}
                    onChange={(e) => setConditionForm({ ...conditionForm, name: e.target.value })}
                    placeholder="Condition name"
                  />
                </div>
                <div>
                  <Label htmlFor="cond-status">Status</Label>
                  <Input
                    id="cond-status"
                    value={conditionForm.status}
                    onChange={(e) => setConditionForm({ ...conditionForm, status: e.target.value })}
                    placeholder="e.g., Active, Remission"
                  />
                </div>
                <div>
                  <Label htmlFor="cond-diagnosed-date">Diagnosed Date</Label>
                  <Input
                    id="cond-diagnosed-date"
                    type="date"
                    value={conditionForm.diagnosedDate}
                    onChange={(e) => setConditionForm({ ...conditionForm, diagnosedDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cond-diagnosed-by">Diagnosed By</Label>
                  <Input
                    id="cond-diagnosed-by"
                    value={conditionForm.diagnosedBy}
                    onChange={(e) => setConditionForm({ ...conditionForm, diagnosedBy: e.target.value })}
                    placeholder="Doctor's name"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="cond-notes">Notes</Label>
                  <Textarea
                    id="cond-notes"
                    value={conditionForm.notes}
                    onChange={(e) => setConditionForm({ ...conditionForm, notes: e.target.value })}
                    placeholder="Additional notes"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingCondition(false)
                    setEditingCondition(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveCondition}>Save</Button>
              </div>
            </div>
          ) : medicalData.conditions.length > 0 ? (
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
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCondition(condition)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => confirmDelete("condition", condition.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
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
            <Button variant="ghost" size="sm" onClick={handleAddVital}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingVital || editingVital ? (
            <div className="border rounded-md p-4 space-y-4">
              <h4 className="font-medium">{editingVital ? "Edit Vital Signs" : "Add Vital Signs"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vital-date">Date</Label>
                  <Input
                    id="vital-date"
                    type="date"
                    value={vitalForm.date}
                    onChange={(e) => setVitalForm({ ...vitalForm, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="vital-bp">Blood Pressure</Label>
                  <Input
                    id="vital-bp"
                    value={vitalForm.bloodPressure}
                    onChange={(e) => setVitalForm({ ...vitalForm, bloodPressure: e.target.value })}
                    placeholder="e.g., 120/80"
                  />
                </div>
                <div>
                  <Label htmlFor="vital-hr">Heart Rate</Label>
                  <Input
                    id="vital-hr"
                    value={vitalForm.heartRate}
                    onChange={(e) => setVitalForm({ ...vitalForm, heartRate: e.target.value })}
                    placeholder="e.g., 72"
                  />
                </div>
                <div>
                  <Label htmlFor="vital-temp">Temperature (°F)</Label>
                  <Input
                    id="vital-temp"
                    value={vitalForm.temperature}
                    onChange={(e) => setVitalForm({ ...vitalForm, temperature: e.target.value })}
                    placeholder="e.g., 98.6"
                  />
                </div>
                <div>
                  <Label htmlFor="vital-weight">Weight (lbs)</Label>
                  <Input
                    id="vital-weight"
                    value={vitalForm.weight}
                    onChange={(e) => setVitalForm({ ...vitalForm, weight: e.target.value })}
                    placeholder="e.g., 180"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="vital-notes">Notes</Label>
                  <Textarea
                    id="vital-notes"
                    value={vitalForm.notes}
                    onChange={(e) => setVitalForm({ ...vitalForm, notes: e.target.value })}
                    placeholder="Additional notes"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingVital(false)
                    setEditingVital(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveVital}>Save</Button>
              </div>
            </div>
          ) : medicalData.vitals.length > 0 ? (
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
                    <th className="text-right font-medium py-2">Actions</th>
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
                      <td className="py-2 text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditVital(vital)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => confirmDelete("vital", vital.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this {deleteType}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
