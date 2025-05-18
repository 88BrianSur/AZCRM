"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/date-range-picker"
import { Search, Download, AlertCircle } from "lucide-react"
import { getActivityLogs } from "@/app/actions/admin-actions"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"

type ActivityLog = {
  id: string
  user_id: string
  user_name?: string
  action: string
  details: string
  ip_address: string
  created_at: string
}

export function ActivityLogs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadActivityLogs()
  }, [])

  const loadActivityLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getActivityLogs()
      setActivityLogs(data)
    } catch (err) {
      console.error("Failed to load activity logs:", err)
      setError("Failed to load activity logs. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleExportLogs = () => {
    // In a real app, this would generate a CSV or PDF file
    alert("This feature would export the filtered logs to a CSV file.")
  }

  // Filter logs based on search query, action filter, and date range
  const filteredLogs = activityLogs.filter((log) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      (log.user_name && log.user_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip_address.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by action
    const matchesAction = actionFilter === "" || log.action === actionFilter

    // Filter by date range
    let matchesDateRange = true
    if (dateRange.from) {
      const logDate = new Date(log.created_at)
      const fromDate = new Date(dateRange.from)
      fromDate.setHours(0, 0, 0, 0)

      if (dateRange.to) {
        const toDate = new Date(dateRange.to)
        toDate.setHours(23, 59, 59, 999)
        matchesDateRange = logDate >= fromDate && logDate <= toDate
      } else {
        matchesDateRange = logDate.toDateString() === fromDate.toDateString()
      }
    }

    return matchesSearch && matchesAction && matchesDateRange
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="Login">Login</SelectItem>
              <SelectItem value="Create">Create</SelectItem>
              <SelectItem value="Update">Update</SelectItem>
              <SelectItem value="Delete">Delete</SelectItem>
              <SelectItem value="Backup">Backup</SelectItem>
            </SelectContent>
          </Select>

          <DateRangePicker value={dateRange} onChange={setDateRange} align="start" className="w-full sm:w-auto" />

          <Button variant="outline" className="ml-auto" onClick={handleExportLogs}>
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Activity Logs</CardTitle>
          <CardDescription>View and filter system activity</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLogs.length > 0 ? (
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{log.user_name || "System"}</span>
                      <Badge
                        variant={
                          log.action === "Create"
                            ? "default"
                            : log.action === "Update"
                              ? "secondary"
                              : log.action === "Delete"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {log.action}
                      </Badge>
                    </div>
                    <p className="text-sm">{log.details}</p>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2 sm:mt-0 sm:text-right">
                    <div>{new Date(log.created_at).toLocaleString()}</div>
                    <div>IP: {log.ip_address}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No activity logs found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
