import { SkeletonLoader } from "@/components/skeleton-loader"
import { PageHeader } from "@/components/page-header"

export default function ClientDetailsLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader title="Loading Client Details..." description="Please wait while we load the client information" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-card rounded-lg border shadow-sm p-6">
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded-md animate-pulse w-1/2"></div>
            <div className="h-4 bg-muted rounded-md animate-pulse w-1/3"></div>
            <div className="space-y-2 pt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="h-4 bg-muted rounded-md animate-pulse w-1/4"></div>
                  <div className="h-5 bg-muted rounded-md animate-pulse w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-card rounded-lg border shadow-sm p-6">
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded-md animate-pulse w-1/3"></div>
            <div className="h-4 bg-muted rounded-md animate-pulse w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="h-4 bg-muted rounded-md animate-pulse w-1/3"></div>
                  <div className="h-5 bg-muted rounded-md animate-pulse w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-10 bg-muted rounded-md animate-pulse w-full max-w-md"></div>
        <SkeletonLoader count={3} height="h-24" />
      </div>
    </div>
  )
}
