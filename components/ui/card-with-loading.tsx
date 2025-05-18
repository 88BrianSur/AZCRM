"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { ReactNode } from "react"

interface CardWithLoadingProps {
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  isLoading?: boolean
  loadingHeight?: string
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
}

export function CardWithLoading({
  title,
  description,
  children,
  footer,
  isLoading = false,
  loadingHeight = "h-32",
  className,
  headerClassName,
  contentClassName,
  footerClassName,
}: CardWithLoadingProps) {
  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader className={headerClassName}>
          {title && (isLoading ? <Skeleton className="h-6 w-1/3" /> : <CardTitle>{title}</CardTitle>)}

          {description &&
            (isLoading ? <Skeleton className="h-4 w-2/3 mt-2" /> : <CardDescription>{description}</CardDescription>)}
        </CardHeader>
      )}

      <CardContent className={contentClassName}>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className={loadingHeight} />
          </div>
        ) : (
          children
        )}
      </CardContent>

      {footer && (
        <CardFooter className={footerClassName}>{isLoading ? <Skeleton className="h-10 w-full" /> : footer}</CardFooter>
      )}
    </Card>
  )
}
