"use client"

import { useState, useEffect } from "react"
import type { Alert } from "@/lib/types/alerts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertList } from "@/components/alerts/alert-list"
import { Button } from "@/components/ui/button"
import { CreateAlertDialog } from "@/components/alerts/create-alert-dialog"
import { getAlerts, getAlertsDueWithinDays, checkForSnoozeExpiration } from "@/lib/data/alerts"
import { RefreshCcw, Bell, AlertTriangle, Clock } from "lucide-react"

export function AlertDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const loadAlerts = () => {
    setIsLoading(true)

    // Check for snoozed alerts that should be reactivated
    checkForSnoozeExpiration()

    // Get all alerts
    const allAlerts = getAlerts()
    setAlerts(allAlerts)
    setIsLoading(false)
  }

  useEffect(() => {
    loadAlerts()

    // Set up interval to check for alerts every minute
    const interval = setInterval(() => {
      checkForSnoozeExpiration()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    loadAlerts()
  }

  const handleCreateAlert = (newAlert: Alert) => {
    setAlerts((prevAlerts) => [...prevAlerts, newAlert])
    setIsCreateDialogOpen(false)
  }

  const handleAlertsChange = (updatedAlerts: Alert[]) => {
    setAlerts(updatedAlerts)
  }

  // Get counts for the summary cards
  const activeAlerts = alerts.filter((alert) => alert.status === "active")
  const urgentAlerts = alerts.filter((alert) => alert.priority === "urgent" && alert.status === "active")
  const dueTodayAlerts = getAlertsDueWithinDays(1).filter((alert) => alert.status === "active")
  const medicationAlerts = alerts.filter((alert) => alert.type === "medication" && alert.status === "active")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alert Management</h1>
          <p className="text-muted-foreground">Manage and track all alerts in the system.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Bell className="mr-2 h-4 w-4" />
            Create Alert
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeAlerts.length === 0 ? "No active alerts" : `${activeAlerts.length} alerts requiring attention`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgentAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {urgentAlerts.length === 0 ? "No urgent alerts" : `${urgentAlerts.length} alerts marked as urgent`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dueTodayAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {dueTodayAlerts.length === 0 ? "No alerts due today" : `${dueTodayAlerts.length} alerts due today`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medication Alerts</CardTitle>
            <span className="text-blue-500">💊</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicationAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {medicationAlerts.length === 0
                ? "No medication alerts"
                : `${medicationAlerts.length} medication-related alerts`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
          <TabsTrigger value="today">Due Today</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Alerts</CardTitle>
              <CardDescription>View and manage all alerts in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertList
                alerts={alerts}
                onAlertsChange={handleAlertsChange}
                loading={isLoading}
                showFilters={true}
                showSearch={true}
                showCreateButton={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>View and manage all active alerts requiring attention.</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertList
                alerts={activeAlerts}
                onAlertsChange={handleAlertsChange}
                loading={isLoading}
                showFilters={true}
                showSearch={true}
                showCreateButton={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="urgent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Urgent Alerts</CardTitle>
              <CardDescription>View and manage all urgent alerts requiring immediate attention.</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertList
                alerts={urgentAlerts}
                onAlertsChange={handleAlertsChange}
                loading={isLoading}
                showFilters={true}
                showSearch={true}
                showCreateButton={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="today" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Due Today</CardTitle>
              <CardDescription>View and manage all alerts due today.</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertList
                alerts={dueTodayAlerts}
                onAlertsChange={handleAlertsChange}
                loading={isLoading}
                showFilters={true}
                showSearch={true}
                showCreateButton={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateAlertDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onSubmit={handleCreateAlert} />
    </div>
  )
}
