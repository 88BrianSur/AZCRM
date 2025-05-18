"use client"

import { useState, useEffect } from "react"
import type { Alert, AlertType, AlertStatus, AlertPriority } from "@/lib/types/alerts"
import { AlertCard } from "@/components/alerts/alert-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, X, AlertTriangle } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { CreateAlertDialog } from "@/components/alerts/create-alert-dialog"
import { EditAlertDialog } from "@/components/alerts/edit-alert-dialog"
import { resolveAlert, snoozeAlert, reactivateAlert, deleteAlert } from "@/lib/data/alerts"
import { Skeleton } from "@/components/ui/skeleton"

interface AlertListProps {
  alerts: Alert[]
  onAlertsChange?: (alerts: Alert[]) => void
  showFilters?: boolean
  showSearch?: boolean
  showCreateButton?: boolean
  compact?: boolean
  clientId?: string
  loading?: boolean
}

export function AlertList({
  alerts: initialAlerts,
  onAlertsChange,
  showFilters = true,
  showSearch = true,
  showCreateButton = true,
  compact = false,
  clientId,
  loading = false,
}: AlertListProps) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>(initialAlerts)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<AlertStatus | "all">("all")
  const [typeFilters, setTypeFilters] = useState<AlertType[]>([])
  const [priorityFilters, setPriorityFilters] = useState<AlertPriority[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  useEffect(() => {
    setAlerts(initialAlerts)
  }, [initialAlerts])

  useEffect(() => {
    let filtered = [...alerts]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (alert) =>
          alert.title.toLowerCase().includes(query) ||
          alert.description.toLowerCase().includes(query) ||
          alert.clientName.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((alert) => alert.status === statusFilter)
    }

    // Apply type filters
    if (typeFilters.length > 0) {
      filtered = filtered.filter((alert) => typeFilters.includes(alert.type))
    }

    // Apply priority filters
    if (priorityFilters.length > 0) {
      filtered = filtered.filter((alert) => priorityFilters.includes(alert.priority))
    }

    // Apply client filter if provided
    if (clientId) {
      filtered = filtered.filter((alert) => alert.clientId === clientId)
    }

    setFilteredAlerts(filtered)
  }, [alerts, searchQuery, statusFilter, typeFilters, priorityFilters, clientId])

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
    const updatedAlerts = alerts.filter((alert) => alert.id !== alertId)
    setAlerts(updatedAlerts)
    if (onAlertsChange) {
      onAlertsChange(updatedAlerts)
    }
  }

  const handleUpdateAlert = (updatedAlert: Alert) => {
    updateAlertInState(updatedAlert)
    setIsEditDialogOpen(false)
  }

  const handleCreateAlert = (newAlert: Alert) => {
    const updatedAlerts = [...alerts, newAlert]
    setAlerts(updatedAlerts)
    if (onAlertsChange) {
      onAlertsChange(updatedAlerts)
    }
    setIsCreateDialogOpen(false)
  }

  const updateAlertInState = (updatedAlert: Alert) => {
    const updatedAlerts = alerts.map((alert) => (alert.id === updatedAlert.id ? updatedAlert : alert))
    setAlerts(updatedAlerts)
    if (onAlertsChange) {
      onAlertsChange(updatedAlerts)
    }
  }

  const toggleTypeFilter = (type: AlertType) => {
    if (typeFilters.includes(type)) {
      setTypeFilters(typeFilters.filter((t) => t !== type))
    } else {
      setTypeFilters([...typeFilters, type])
    }
  }

  const togglePriorityFilter = (priority: AlertPriority) => {
    if (priorityFilters.includes(priority)) {
      setPriorityFilters(priorityFilters.filter((p) => p !== priority))
    } else {
      setPriorityFilters([...priorityFilters, priority])
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setTypeFilters([])
    setPriorityFilters([])
    setShowAdvancedFilters(false)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredAlerts.length === 0 && !loading) {
    return (
      <div className="space-y-4">
        {(showSearch || showFilters) && (
          <div className="flex flex-col sm:flex-row gap-4">
            {showSearch && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
            {showFilters && (
              <div className="flex gap-2">
                <Tabs
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as AlertStatus | "all")}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={showAdvancedFilters ? "bg-muted" : ""}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            )}
            {showCreateButton && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="whitespace-nowrap">
                Create Alert
              </Button>
            )}
          </div>
        )}

        {showAdvancedFilters && (
          <div className="p-4 border rounded-md bg-muted/50 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Advanced Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Alert Type</Label>
              <div className="flex flex-wrap gap-2">
                {(["medication", "appointment", "documentation", "legal", "insurance", "custom"] as AlertType[]).map(
                  (type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={typeFilters.includes(type)}
                        onCheckedChange={() => toggleTypeFilter(type)}
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </label>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex flex-wrap gap-2">
                {(["low", "medium", "high", "urgent"] as AlertPriority[]).map((priority) => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={priorityFilters.includes(priority)}
                      onCheckedChange={() => togglePriorityFilter(priority)}
                    />
                    <label
                      htmlFor={`priority-${priority}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <EmptyState
          title="No alerts found"
          description={
            searchQuery || statusFilter !== "all" || typeFilters.length > 0 || priorityFilters.length > 0
              ? "Try adjusting your search or filter criteria"
              : "There are no alerts to display at this time"
          }
          icon={<AlertTriangle className="h-10 w-10 text-muted-foreground" />}
          action={
            showCreateButton ? <Button onClick={() => setIsCreateDialogOpen(true)}>Create Alert</Button> : undefined
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {(showSearch || showFilters) && (
        <div className="flex flex-col sm:flex-row gap-4">
          {showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
          {showFilters && (
            <div className="flex gap-2">
              <Tabs
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as AlertStatus | "all")}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={showAdvancedFilters ? "bg-muted" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          )}
          {showCreateButton && (
            <Button onClick={() => setIsCreateDialogOpen(true)} className="whitespace-nowrap">
              Create Alert
            </Button>
          )}
        </div>
      )}

      {showAdvancedFilters && (
        <div className="p-4 border rounded-md bg-muted/50 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Advanced Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Alert Type</Label>
            <div className="flex flex-wrap gap-2">
              {(["medication", "appointment", "documentation", "legal", "insurance", "custom"] as AlertType[]).map(
                (type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={typeFilters.includes(type)}
                      onCheckedChange={() => toggleTypeFilter(type)}
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  </div>
                ),
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex flex-wrap gap-2">
              {(["low", "medium", "high", "urgent"] as AlertPriority[]).map((priority) => (
                <div key={priority} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${priority}`}
                    checked={priorityFilters.includes(priority)}
                    onCheckedChange={() => togglePriorityFilter(priority)}
                  />
                  <label
                    htmlFor={`priority-${priority}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onResolve={handleResolveAlert}
            onSnooze={handleSnoozeAlert}
            onReactivate={handleReactivateAlert}
            onEdit={handleEditAlert}
            onDelete={handleDeleteAlert}
            compact={compact}
          />
        ))}
      </div>

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
    </div>
  )
}
