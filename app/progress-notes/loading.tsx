import { SkeletonLoader } from "@/components/skeleton-loader"
import { PageHeader } from "@/components/page-header"

export default function ProgressNotesLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader title="Progress Notes" description="View and manage client progress notes" />

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="w-full md:w-96 h-10 bg-muted rounded-md animate-pulse"></div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="w-48 h-10 bg-muted rounded-md animate-pulse"></div>
          <div className="w-32 h-10 bg-muted rounded-md animate-pulse"></div>
        </div>
      </div>

      <SkeletonLoader count={5} height="h-32" />
    </div>
  )
}
