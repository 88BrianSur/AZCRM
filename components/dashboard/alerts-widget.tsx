"use client"

import { useState, useEffect } from "react"
import type { Alert } from "@/lib/types/alerts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCard } from "@/components/alerts/alert-card"
import { getActiveAlerts, resolveAlert, snoozeAlert, reactivateAlert, deleteAlert } from "@/lib/data/alerts"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { CreateAlertDialog } from "@/components/alerts/create-alert-dialog"
import { EditAlertDialog } from "@/components/alerts/edit-alert-dialog"
import { Bell, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AlertsWidgetProps {
  maxAlerts?: number
  clientId?: string
}

export function AlertsWidget({ maxAlerts = 3, clientId }: AlertsWidgetProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)

  useEffect(() => {
    loadAlerts()
  }, [clientId])

  const loadAlerts = () => {
    setIsLoading(true)

    // Get active alerts
    let activeAlerts = getActiveAlerts()

    // Filter by client if clientId is provided
    if (clientId) {
      activeAlerts = activeAlerts.filter((alert) => alert.clientId === clientId)
    }

    // Sort by priority and due date
    activeAlerts.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder]
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder]

      if (aPriority !== bPriority) {
        return aPriority - bPriority
      }

      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

    // Limit to maxAlerts
    activeAlerts = activeAlerts.slice(0, maxAlerts)

    setAlerts(activeAlerts)
    setIsLoading(false)
  }

  const handleResolveAlert = (alertId: string) => {
    const updatedAlert = resolveAlert(alertId, "current-user") // In a real app, get the current user ID
    updateAlertInState(updatedAlert)
  }

  const handleSnoozeAlert = (alertId: string, days: number) => {
    const snoozeDate = new Date()
    snoozeDate.setDate(snoozeDate.getDate() + days)
    const updatedAlert = snoozeAlert(alertId, snoozeDate)
    updateAlertInState(updatedAlert)
  }

  const handleReactivateAlert = (alertId: string) => {
    const updatedAlert = reactivateAlert(alertId)
    updateAlertInState(updatedAlert)
  }

  const handleEditAlert = (alert: Alert) => {
    setSelectedAlert(alert)
    setIsEditDialogOpen(true)
  }

  const handleDeleteAlert = (alertId: string) => {
    deleteAlert(alertId)
    setAlerts(alerts.filter((alert) => alert.id !== alertId))
  }

  const handleUpdateAlert = (updatedAlert: Alert) => {
    updateAlertInState(updatedAlert)
    setIsEditDialogOpen(false)
  }

  const handleCreateAlert = (newAlert: Alert) => {
    setAlerts((prevAlerts) => {
      const newAlerts = [newAlert, ...prevAlerts]
      return newAlerts.slice(0, maxAlerts)
    })
    setIsCreateDialogOpen(false)
    toast({
      title: "Alert created",
      description: "The new alert has been created successfully.",
    })
  }

  const updateAlertInState = (updatedAlert: Alert) => {
    if (updatedAlert.status !== "active") {
      // Remove non-active alerts from the widget
      setAlerts(alerts.filter((alert) => alert.id !== updatedAlert.id))
      loadAlerts() // Reload to get the next active alert
    } else {
      // Update the alert in the state
      setAlerts(alerts.map((alert) => (alert.id === updatedAlert.id ? updatedAlert : alert)))
    }
  }

  const handleViewAllAlerts = () => {
    router.push("/alerts")
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Alerts
          </CardTitle>
          <CardDescription>Recent alerts requiring attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Alerts
          </CardTitle>
          {clientId && (
            <Button variant="outline" size="sm" onClick={() => setIsCreateDialogOpen(true)}>
              Add Alert
            </Button>
          )}
        </div>
        <CardDescription>Recent alerts requiring attention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No active alerts at this time</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onResolve={handleResolveAlert}
              onSnooze={handleSnoozeAlert}
              onReactivate={handleReactivateAlert}
              onEdit={handleEditAlert}
              onDelete={handleDeleteAlert}
              compact={true}
            />
          ))
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleViewAllAlerts}>
          View All Alerts
        </Button>
      </CardFooter>

      <CreateAlertDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateAlert}
        clientId={clientId}
      />

      {selectedAlert && (
        <EditAlertDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          alert={selectedAlert}
          onSubmit={handleUpdateAlert}
        />
      )}
    </Card>
  )
}
