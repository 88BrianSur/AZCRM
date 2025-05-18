import { SkeletonLoader } from "@/components/skeleton-loader"
import { PageHeader } from "@/components/page-header"

export default function ClientNotesLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader title="Loading Client Notes..." description="Please wait while we load the notes" />

      <SkeletonLoader count={5} height="h-32" />
    </div>
  )
}
