"use client"

import { Button } from "@/components/ui/button"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import type { ButtonProps } from "@/components/ui/button"
import type { ReactNode } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"

interface ButtonWithTooltipProps extends ButtonProps {
  children: ReactNode
  tooltip?: string
  tooltipSide?: "top" | "right" | "bottom" | "left"
  tooltipAlign?: "start" | "center" | "end"
}

export function ButtonWithTooltip({
  children,
  tooltip,
  tooltipSide = "top",
  tooltipAlign = "center",
  ...props
}: ButtonWithTooltipProps) {
  if (!tooltip) {
    return <Button {...props}>{children}</Button>
  }

  return (
    <TooltipProvider>
      <TooltipWrapper content={tooltip} side={tooltipSide} align={tooltipAlign}>
        <Button {...props}>{children}</Button>
      </TooltipWrapper>
    </TooltipProvider>
  )
}
