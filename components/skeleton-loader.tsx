import { cn } from "@/lib/utils"

interface SkeletonLoaderProps {
  count?: number
  height?: string
  className?: string
}

export function SkeletonLoader({ count = 1, height = "h-16", className }: SkeletonLoaderProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn("bg-muted rounded-md animate-pulse", height, className)} aria-hidden="true"></div>
      ))}
    </div>
  )
}
