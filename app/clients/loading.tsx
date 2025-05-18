import { SkeletonLoader } from "@/components/skeleton-loader"
import { PageHeader } from "@/components/page-header"

export default function ClientsLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader title="Client Management" description="View and manage all clients" />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-full sm:w-96 h-10 bg-muted rounded-md animate-pulse"></div>
        <div className="w-32 h-10 bg-muted rounded-md animate-pulse ml-auto"></div>
      </div>

      <SkeletonLoader count={8} height="h-20" />
    </div>
  )
}
