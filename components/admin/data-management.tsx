"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Download } from "lucide-react"
import { createBackup, getBackups } from "@/app/actions/admin-actions"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"

type Backup = {
  id: string
  type: string
  status: string
  file_path: string
  created_at: string
  created_by: string
}

export function DataManagement() {
  const [isBackupRunning, setIsBackupRunning] = useState(false)
  const [isRestoreRunning, setIsRestoreRunning] = useState(false)
  const [isExportRunning, setIsExportRunning] = useState(false)
  const [isImportRunning, setIsImportRunning] = useState(false)
  const [isCleanupRunning, setIsCleanupRunning] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Form states
  const [backupType, setBackupType] = useState("full")
  const [backupLocation, setBackupLocation] = useState("local")
  const [exportFormat, setExportFormat] = useState("csv")
  const [dataType, setDataType] = useState("clients")
  const [cleanupType, setCleanupType] = useState("archive")
  const [dataAge, setDataAge] = useState("1year")

  useEffect(() => {
    loadBackups()
  }, [])

  const loadBackups = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getBackups()
      setBackups(data)
    } catch (err) {
      console.error("Failed to load backups:", err)
      setError("Failed to load backups. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBackup = async () => {
    setIsBackupRunning(true)
    setSuccess(null)
    setError(null)

    try {
      const result = await createBackup()
      setSuccess(result.message || "Backup completed successfully!")
      toast({
        title: "Backup created",
        description: "The database backup has been created successfully.",
      })
      loadBackups()
    } catch (err) {
      console.error("Failed to create backup:", err)
      setError(err.message || "Failed to create backup. Please try again.")
    } finally {
      setIsBackupRunning(false)
    }
  }

  const handleRestore = () => {
    setIsRestoreRunning(true)
    setSuccess(null)
    setError(null)

    // Simulate API call
    setTimeout(() => {
      setIsRestoreRunning(false)
      setSuccess("Restore completed successfully!")
      toast({
        title: "Backup restored",
        description: "The database has been restored successfully.",
      })
    }, 3000)
  }

  const handleExport = () => {
    setIsExportRunning(true)
    setSuccess(null)
    setError(null)

    // Simulate API call
    setTimeout(() => {
      setIsExportRunning(false)
      setSuccess("Data exported successfully!")
      toast({
        title: "Data exported",
        description: `The ${dataType} data has been exported successfully in ${exportFormat.toUpperCase()} format.`,
      })
    }, 2500)
  }

  const handleImport = () => {
    setIsImportRunning(true)
    setSuccess(null)
    setError(null)

    // Simulate API call
    setTimeout(() => {
      setIsImportRunning(false)
      setSuccess("Data imported successfully!")
      toast({
        title: "Data imported",
        description: "The data has been imported successfully.",
      })
    }, 3500)
  }

  const handleCleanup = () => {
    setIsCleanupRunning(true)
    setSuccess(null)
    setError(null)

    // Simulate API call
    setTimeout(() => {
      setIsCleanupRunning(false)
      setSuccess("Data cleanup completed successfully!")
      toast({
        title: "Data cleanup completed",
        description: `The ${cleanupType} operation has been completed successfully.`,
      })
    }, 4000)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Tabs defaultValue="backup" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
        <TabsTrigger value="import">Import & Export</TabsTrigger>
        <TabsTrigger value="cleanup">Data Cleanup</TabsTrigger>
        <TabsTrigger value="logs">Database Logs</TabsTrigger>
      </TabsList>

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <TabsContent value="backup" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Database Backup</CardTitle>
            <CardDescription>Create and manage database backups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="backupType">Backup Type</Label>
                <Select value={backupType} onValueChange={setBackupType}>
                  <SelectTrigger id="backupType">
                    <SelectValue placeholder="Select backup type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Backup</SelectItem>
                    <SelectItem value="incremental">Incremental Backup</SelectItem>
                    <SelectItem value="differential">Differential Backup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="backupLocation">Backup Location</Label>
                <Select value={backupLocation} onValueChange={setBackupLocation}>
                  <SelectTrigger id="backupLocation">
                    <SelectValue placeholder="Select backup location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="cloud">Cloud Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Recent Backups</h3>
              <div className="border rounded-md overflow-hidden">
                {backups.length > 0 ? (
                  <div className="divide-y">
                    {backups.slice(0, 5).map((backup) => (
                      <div key={backup.id} className="p-3 flex justify-between items-center">
                        <div>
                          <div className="font-medium">
                            {backup.type.charAt(0).toUpperCase() + backup.type.slice(1)} Backup
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(backup.created_at).toLocaleString()}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No backups found</div>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <Button onClick={handleBackup} disabled={isBackupRunning} className="flex-1">
                {isBackupRunning && <LoadingSpinner className="mr-2" />}
                {isBackupRunning ? "Creating Backup..." : "Create Backup"}
              </Button>
              <Button onClick={handleRestore} disabled={isRestoreRunning} variant="outline" className="flex-1">
                {isRestoreRunning && <LoadingSpinner className="mr-2" />}
                {isRestoreRunning ? "Restoring..." : "Restore Backup"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="import" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Import & Export Data</CardTitle>
            <CardDescription>Import and export data in various formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exportFormat">Export Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger id="exportFormat">
                    <SelectValue placeholder="Select export format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataType">Data Type</Label>
                <Select value={dataType} onValueChange={setDataType}>
                  <SelectTrigger id="dataType">
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clients">Clients</SelectItem>
                    <SelectItem value="notes">Progress Notes</SelectItem>
                    <SelectItem value="sobriety">Sobriety Records</SelectItem>
                    <SelectItem value="alumni">Alumni Records</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <Button onClick={handleExport} disabled={isExportRunning} className="flex-1">
                {isExportRunning && <LoadingSpinner className="mr-2" />}
                {isExportRunning ? "Exporting Data..." : "Export Data"}
              </Button>
              <Button onClick={handleImport} disabled={isImportRunning} variant="outline" className="flex-1">
                {isImportRunning && <LoadingSpinner className="mr-2" />}
                {isImportRunning ? "Importing Data..." : "Import Data"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="cleanup" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Data Cleanup</CardTitle>
            <CardDescription>Clean up old or redundant data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cleanupType">Cleanup Type</Label>
                <Select value={cleanupType} onValueChange={setCleanupType}>
                  <SelectTrigger id="cleanupType">
                    <SelectValue placeholder="Select cleanup type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="archive">Archive Old Data</SelectItem>
                    <SelectItem value="remove">Remove Duplicates</SelectItem>
                    <SelectItem value="optimize">Optimize Database</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataAge">Data Age</Label>
                <Select value={dataAge} onValueChange={setDataAge}>
                  <SelectTrigger id="dataAge">
                    <SelectValue placeholder="Select data age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6months">Older than 6 months</SelectItem>
                    <SelectItem value="1year">Older than 1 year</SelectItem>
                    <SelectItem value="2years">Older than 2 years</SelectItem>
                    <SelectItem value="all">All Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <Button onClick={handleCleanup} disabled={isCleanupRunning} className="flex-1">
                {isCleanupRunning && <LoadingSpinner className="mr-2" />}
                {isCleanupRunning ? "Cleaning Up Data..." : "Run Cleanup"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="logs" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Database Logs</CardTitle>
            <CardDescription>View and analyze database logs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-md h-64 overflow-y-auto font-mono text-sm">
              <p className="text-gray-500">[2023-05-15 08:30:22] INFO: Database backup completed successfully</p>
              <p className="text-gray-500">[2023-05-14 14:15:43] INFO: 3 client records imported</p>
              <p className="text-gray-500">[2023-05-14 10:22:15] WARNING: Duplicate record detected during import</p>
              <p className="text-gray-500">[2023-05-13 16:45:30] INFO: Database optimization completed</p>
              <p className="text-gray-500">[2023-05-12 09:12:18] ERROR: Backup failed - insufficient storage</p>
              <p className="text-gray-500">[2023-05-11 11:30:45] INFO: 25 records archived successfully</p>
              <p className="text-gray-500">[2023-05-10 15:20:33] INFO: Database backup completed successfully</p>
              <p className="text-gray-500">[2023-05-09 13:10:27] WARNING: Slow query detected in client search</p>
            </div>
            <div className="flex justify-end">
              <Button variant="outline">Download Logs</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
