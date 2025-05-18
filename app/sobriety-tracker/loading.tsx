import { PageHeader } from "@/components/page-header"

export default function SobrietyTrackerLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader title="Sobriety Tracker" description="Monitor and record client sobriety progress" />

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="w-full md:w-96 h-10 bg-muted rounded-md animate-pulse"></div>
        <div className="w-32 h-10 bg-muted rounded-md animate-pulse"></div>
      </div>

      <div className="w-full h-10 bg-muted rounded-md animate-pulse max-w-md"></div>

      <div className="h-[400px] bg-muted rounded-lg animate-pulse"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-lg border shadow-sm p-6">
            <div className="space-y-4">
              <div className="h-5 bg-muted rounded-md animate-pulse w-1/2"></div>
              <div className="h-8 bg-muted rounded-md animate-pulse w-1/3"></div>
              <div className="h-4 bg-muted rounded-md animate-pulse w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
