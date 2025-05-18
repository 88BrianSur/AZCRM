import { PageHeader } from "@/components/page-header"

export default function StaffSchedulingLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader title="Staff Scheduling" description="Manage staff schedules and availability" />

      <div className="w-full h-10 bg-muted rounded-md animate-pulse max-w-md"></div>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-6 space-y-4">
          <div className="h-6 bg-muted rounded-md animate-pulse w-1/4"></div>
          <div className="h-4 bg-muted rounded-md animate-pulse w-1/3"></div>
        </div>
        <div className="p-6 border-t">
          <div className="h-[500px] bg-muted rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
