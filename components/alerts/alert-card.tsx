"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow, format, parseISO } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertTriangle,
  Calendar,
  Check,
  Clock,
  Edit,
  ExternalLink,
  MoreHorizontal,
  Trash2,
  User,
  ZapIcon as ZZZ,
} from "lucide-react"
import type { Alert } from "@/lib/types/alerts"

interface AlertCardProps {
  alert: Alert
  onResolve: (alertId: string) => void
  onSnooze: (alertId: string, days: number) => void
  onReactivate: (alertId: string) => void
  onEdit: (alert: Alert) => void
  onDelete: (alertId: string) => void
  compact?: boolean
}

export function AlertCard({
  alert,
  onResolve,
  onSnooze,
  onReactivate,
  onEdit,
  onDelete,
  compact = false,
}: AlertCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "medication":
        return <span className="text-blue-500">💊</span>
      case "appointment":
        return <Calendar className="h-4 w-4 text-green-500" />
      case "documentation":
        return <span className="text-amber-500">📄</span>
      case "legal":
        return <span className="text-purple-500">⚖️</span>
      case "insurance":
        return <span className="text-teal-500">🏥</span>
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-blue-500"
      case "high":
        return "bg-amber-500"
      case "urgent":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "snoozed":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Snoozed
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, "MMM d, yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }

  const getTimeRemaining = (dueDate: string) => {
    try {
      const date = parseISO(dueDate)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return "Unknown"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex items-start gap-3">
          <div className={`w-1 self-stretch rounded-full ${getPriorityColor(alert.priority)}`}></div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getAlertTypeIcon(alert.type)}
                <h3 className={`font-medium ${compact ? "text-sm" : "text-base"}`}>{alert.title}</h3>
                {getStatusBadge(alert.status)}
              </div>
              <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {alert.status === "active" && (
                    <>
                      <DropdownMenuItem onClick={() => onResolve(alert.id)}>
                        <Check className="mr-2 h-4 w-4" />
                        Mark as resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSnooze(alert.id, 1)}>
                        <ZZZ className="mr-2 h-4 w-4" />
                        Snooze for 1 day
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSnooze(alert.id, 3)}>
                        <ZZZ className="mr-2 h-4 w-4" />
                        Snooze for 3 days
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSnooze(alert.id, 7)}>
                        <ZZZ className="mr-2 h-4 w-4" />
                        Snooze for 1 week
                      </DropdownMenuItem>
                    </>
                  )}
                  {alert.status === "snoozed" && (
                    <DropdownMenuItem onClick={() => onReactivate(alert.id)}>
                      <Clock className="mr-2 h-4 w-4" />
                      Reactivate alert
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onEdit(alert)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit alert
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(alert.id)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete alert
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className={`text-muted-foreground ${compact ? "text-xs" : "text-sm"}`}>{alert.description}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <User className="mr-1 h-3 w-3" />
                <Link href={`/clients/${alert.clientId}`} className="hover:underline">
                  {alert.clientName}
                </Link>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                Due {getTimeRemaining(alert.dueDate)}
              </div>
              {alert.status === "snoozed" && alert.snoozeUntil && (
                <div className="flex items-center">
                  <ZZZ className="mr-1 h-3 w-3" />
                  Snoozed until {formatDate(alert.snoozeUntil)}
                </div>
              )}
              {alert.status === "resolved" && alert.resolvedAt && (
                <div className="flex items-center">
                  <Check className="mr-1 h-3 w-3" />
                  Resolved on {formatDate(alert.resolvedAt)}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      {!compact && alert.relatedRecordUrl && (
        <CardFooter className="bg-muted/50 p-3 flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <Link href={alert.relatedRecordUrl}>
              <ExternalLink className="mr-2 h-3 w-3" />
              View related record
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
