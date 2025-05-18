import { PageHeader } from "@/components/page-header"
import { CardWithLoading } from "@/components/ui/card-with-loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Dashboard" description="Welcome to AZ House Recovery CRM" />

        <Skeleton className="h-10 w-10 rounded-md" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <CardWithLoading key={i} isLoading loadingHeight="h-24" />
          ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CardWithLoading title="Recent Alerts" isLoading />
            <CardWithLoading title="Quick Actions" className="md:col-span-1" isLoading />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
