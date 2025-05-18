import { PageHeader } from "@/components/page-header"
import { CardWithLoading } from "@/components/ui/card-with-loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/admin/user-management"
import { ActivityLogs } from "@/components/admin/activity-logs"
import { SystemSettings } from "@/components/admin/system-settings"
import { DataManagement } from "@/components/admin/data-management"
import { Suspense } from "react"

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Admin Panel" description="Manage system settings and user access" />

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Suspense fallback={<CardWithLoading title="User Management" isLoading />}>
            <CardWithLoading title="User Management">
              <UserManagement />
            </CardWithLoading>
          </Suspense>
        </TabsContent>

        <TabsContent value="logs">
          <Suspense fallback={<CardWithLoading title="Activity Logs" isLoading />}>
            <CardWithLoading title="Activity Logs">
              <ActivityLogs />
            </CardWithLoading>
          </Suspense>
        </TabsContent>

        <TabsContent value="settings">
          <Suspense fallback={<CardWithLoading title="System Settings" isLoading />}>
            <CardWithLoading title="System Settings">
              <SystemSettings />
            </CardWithLoading>
          </Suspense>
        </TabsContent>

        <TabsContent value="data">
          <Suspense fallback={<CardWithLoading title="Data Management" isLoading />}>
            <CardWithLoading title="Data Management">
              <DataManagement />
            </CardWithLoading>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
