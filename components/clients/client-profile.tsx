"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Check, X } from "lucide-react"

export function ClientProfile({ client, onClientUpdated }) {
  const { toast } = useToast()
  const [editingField, setEditingField] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
    email: client.email || "",
    phone: client.phone || "",
    intake_date: client.intake_date || "",
    status: client.status || "",
    program_type: client.program_type || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEdit = (field: string) => {
    setEditingField(field)
    setFormValues((prev) => ({
      ...prev,
      [field]: client[field] || "",
    }))
  }

  const handleCancel = () => {
    setEditingField(null)
  }

  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async (field: string) => {
    try {
      setIsSubmitting(true)
      const supabase = createClientSupabaseClient()

      const updateData = {
        [field]: formValues[field],
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("clients").update(updateData).eq("id", client.id).select()

      if (error) {
        throw error
      }

      toast({
        title: "Field updated",
        description: `${field.replace("_", " ")} has been updated successfully.`,
      })

      setEditingField(null)

      if (onClientUpdated && data && data[0]) {
        onClientUpdated({
          ...client,
          ...updateData,
        })
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error)
      toast({
        title: "Error",
        description: `Failed to update ${field.replace("_", " ")}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderEditableField = (label: string, field: string, type = "text") => {
    const isEditing = editingField === field

    return (
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">{label}</p>
          {!isEditing && (
            <Button variant="ghost" size="sm" onClick={() => handleEdit(field)} className="h-8 px-2">
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            {type === "select" ? (
              <Select value={formValues[field]} onValueChange={(value) => handleChange(field, value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select program type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1/2way">1/2way</SelectItem>
                  <SelectItem value="LFW">LFW</SelectItem>
                  <SelectItem value="3/4">3/4</SelectItem>
                  <SelectItem value="Jackies House">Jackies House</SelectItem>
                  <SelectItem value="Falkenstein Fortress">Falkenstein Fortress</SelectItem>
                  <SelectItem value="Olive Branch">Olive Branch</SelectItem>
                  <SelectItem value="Alumni">Alumni</SelectItem>
                </SelectContent>
              </Select>
            ) : type === "date" ? (
              <Input
                type="date"
                value={formValues[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full"
              />
            ) : (
              <Input
                type={type}
                value={formValues[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full"
              />
            )}
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={() => handleSave(field)} disabled={isSubmitting}>
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleCancel} disabled={isSubmitting}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {field === "intake_date" && client[field]
              ? new Date(client[field]).toLocaleDateString()
              : client[field] || "N/A"}
          </p>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
        <CardDescription>Basic information about the client.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderEditableField("Email", "email", "email")}
          {renderEditableField("Phone", "phone", "tel")}
          {renderEditableField("Intake Date", "intake_date", "date")}
          {renderEditableField("Program Type", "program_type", "select")}
          {renderEditableField("Status", "status")}
        </div>
      </CardContent>
    </Card>
  )
}
