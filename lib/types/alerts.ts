export type AlertType = "medication" | "appointment" | "documentation" | "legal" | "insurance" | "custom"
export type AlertStatus = "active" | "snoozed" | "resolved"
export type AlertPriority = "low" | "medium" | "high" | "urgent"

export interface Alert {
  id: string
  type: AlertType
  title: string
  description: string
  clientId: string
  clientName: string
  createdAt: string
  dueDate: string
  status: AlertStatus
  priority: AlertPriority
  assignedTo?: string
  resolvedAt?: string
  resolvedBy?: string
  snoozeUntil?: string
  relatedRecordId?: string
  relatedRecordType?: string
  relatedRecordUrl?: string
}
