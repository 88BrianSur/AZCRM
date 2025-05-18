import type { Alert, AlertType, AlertStatus, AlertPriority } from "@/lib/types/alerts"
import { v4 as uuidv4 } from "uuid"

// Mock data for alerts
export const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "medication",
    title: "Medication Refill Needed",
    description: "John Smith's antidepressant medication needs to be refilled within 5 days.",
    clientId: "1",
    clientName: "John Smith",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    status: "active",
    priority: "high",
    assignedTo: "dr-williams",
    relatedRecordId: "med-123",
    relatedRecordType: "medication",
    relatedRecordUrl: "/clients/1/medical",
  },
  {
    id: "2",
    type: "appointment",
    title: "Upcoming Therapy Session",
    description: "Maria Garcia has a therapy session scheduled for tomorrow at 2:00 PM.",
    clientId: "2",
    clientName: "Maria Garcia",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    status: "active",
    priority: "medium",
    assignedTo: "dr-johnson",
    relatedRecordId: "appt-456",
    relatedRecordType: "appointment",
    relatedRecordUrl: "/clients/2",
  },
  {
    id: "3",
    type: "documentation",
    title: "Missing Insurance Information",
    description: "Robert Johnson's insurance documentation is incomplete. Please update before the end of the week.",
    clientId: "3",
    clientName: "Robert Johnson",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    status: "active",
    priority: "medium",
    relatedRecordId: "ins-789",
    relatedRecordType: "insurance",
    relatedRecordUrl: "/clients/3/insurance",
  },
  {
    id: "4",
    type: "legal",
    title: "Court Date Reminder",
    description: "Sarah Williams has a court appearance scheduled for next week. Ensure all documentation is prepared.",
    clientId: "4",
    clientName: "Sarah Williams",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    status: "active",
    priority: "high",
    assignedTo: "dr-brown",
    relatedRecordId: "legal-101",
    relatedRecordType: "legal",
    relatedRecordUrl: "/clients/4/legal",
  },
  {
    id: "5",
    type: "medication",
    title: "Medication Side Effect Check",
    description: "Michael Brown reported side effects from new medication. Follow up required.",
    clientId: "5",
    clientName: "Michael Brown",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    status: "active",
    priority: "urgent",
    assignedTo: "dr-smith",
    relatedRecordId: "med-202",
    relatedRecordType: "medication",
    relatedRecordUrl: "/clients/5/medical",
  },
  {
    id: "6",
    type: "custom",
    title: "Family Meeting Preparation",
    description: "Jennifer Davis has a family meeting scheduled. Prepare progress report and treatment plan updates.",
    clientId: "6",
    clientName: "Jennifer Davis",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    status: "snoozed",
    priority: "medium",
    assignedTo: "dr-williams",
    snoozeUntil: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Snoozed for 1 day
    relatedRecordUrl: "/clients/6",
  },
  {
    id: "7",
    type: "insurance",
    title: "Insurance Expiration",
    description: "David Miller's insurance coverage expires in 10 days. Contact insurance provider for renewal.",
    clientId: "7",
    clientName: "David Miller",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    status: "active",
    priority: "medium",
    relatedRecordId: "ins-303",
    relatedRecordType: "insurance",
    relatedRecordUrl: "/clients/7/insurance",
  },
  {
    id: "8",
    type: "appointment",
    title: "Missed Appointment Follow-up",
    description: "Lisa Wilson missed her scheduled appointment yesterday. Contact client to reschedule.",
    clientId: "8",
    clientName: "Lisa Wilson",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    dueDate: new Date(Date.now()).toISOString(), // Today
    status: "active",
    priority: "high",
    assignedTo: "dr-jones",
    relatedRecordId: "appt-404",
    relatedRecordType: "appointment",
    relatedRecordUrl: "/clients/8",
  },
  {
    id: "9",
    type: "documentation",
    title: "Treatment Plan Update Required",
    description: "John Smith's treatment plan needs to be updated for the quarterly review.",
    clientId: "1",
    clientName: "John Smith",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    status: "resolved",
    priority: "medium",
    assignedTo: "dr-williams",
    resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Resolved 1 day ago
    resolvedBy: "dr-williams",
    relatedRecordUrl: "/clients/1",
  },
  {
    id: "10",
    type: "custom",
    title: "Discharge Planning",
    description: "Maria Garcia is scheduled for discharge in 2 weeks. Begin preparation of discharge documentation.",
    clientId: "2",
    clientName: "Maria Garcia",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    status: "active",
    priority: "low",
    assignedTo: "dr-johnson",
    relatedRecordUrl: "/clients/2",
  },
]

// Function to get all alerts
export const getAlerts = () => {
  return mockAlerts
}

// Function to get alerts by client ID
export const getAlertsByClientId = (clientId: string) => {
  return mockAlerts.filter((alert) => alert.clientId === clientId)
}

// Function to get active alerts
export const getActiveAlerts = () => {
  return mockAlerts.filter((alert) => alert.status === "active")
}

// Function to get alerts by type
export const getAlertsByType = (type: AlertType) => {
  return mockAlerts.filter((alert) => alert.type === type)
}

// Function to get alerts by status
export const getAlertsByStatus = (status: AlertStatus) => {
  return mockAlerts.filter((alert) => alert.status === status)
}

// Function to get alerts by priority
export const getAlertsByPriority = (priority: AlertPriority) => {
  return mockAlerts.filter((alert) => alert.priority === priority)
}

// Function to get alerts due within a certain number of days
export const getAlertsDueWithinDays = (days: number) => {
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + days)

  return mockAlerts.filter((alert) => {
    const dueDate = new Date(alert.dueDate)
    return dueDate <= futureDate && alert.status === "active"
  })
}

// Function to create a new alert
export const createAlert = (alertData: Omit<Alert, "id" | "createdAt">) => {
  const newAlert: Alert = {
    ...alertData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  }

  // In a real app, this would add the alert to the database
  mockAlerts.push(newAlert)
  return newAlert
}

// Function to update an alert
export const updateAlert = (id: string, alertData: Partial<Alert>) => {
  const alertIndex = mockAlerts.findIndex((alert) => alert.id === id)

  if (alertIndex === -1) {
    throw new Error(`Alert with ID ${id} not found`)
  }

  mockAlerts[alertIndex] = {
    ...mockAlerts[alertIndex],
    ...alertData,
  }

  return mockAlerts[alertIndex]
}

// Function to mark an alert as resolved
export const resolveAlert = (id: string, resolvedBy: string) => {
  return updateAlert(id, {
    status: "resolved",
    resolvedAt: new Date().toISOString(),
    resolvedBy,
  })
}

// Function to snooze an alert
export const snoozeAlert = (id: string, snoozeUntil: Date) => {
  return updateAlert(id, {
    status: "snoozed",
    snoozeUntil: snoozeUntil.toISOString(),
  })
}

// Function to reactivate a snoozed alert
export const reactivateAlert = (id: string) => {
  return updateAlert(id, {
    status: "active",
    snoozeUntil: undefined,
  })
}

// Function to delete an alert
export const deleteAlert = (id: string) => {
  const alertIndex = mockAlerts.findIndex((alert) => alert.id === id)

  if (alertIndex === -1) {
    throw new Error(`Alert with ID ${id} not found`)
  }

  mockAlerts.splice(alertIndex, 1)
}

// Function to check for alerts that need to be generated
export const checkForAutomaticAlerts = () => {
  // In a real app, this would query the database for conditions that should trigger alerts
  // For example:
  // - Check for medications that need refills within 7 days
  // - Check for appointments within 48 hours
  // - Check for missing documentation

  // For now, we'll just return the mock alerts
  return mockAlerts
}

// Function to check for snoozed alerts that should be reactivated
export const checkForSnoozeExpiration = () => {
  const now = new Date().toISOString()

  mockAlerts.forEach((alert) => {
    if (alert.status === "snoozed" && alert.snoozeUntil && alert.snoozeUntil < now) {
      reactivateAlert(alert.id)
    }
  })
}
