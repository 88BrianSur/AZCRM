import { PageHeader } from "@/components/page-header"
import { CardWithLoading } from "@/components/ui/card-with-loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminLoading() {
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
          <CardWithLoading title="User Management" isLoading loadingHeight="h-64" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
