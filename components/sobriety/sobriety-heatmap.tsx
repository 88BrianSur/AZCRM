"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { format, eachDayOfInterval, startOfYear, endOfYear, isEqual, parseISO } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SobrietyHeatmapProps {
  logs: any[]
}

export function SobrietyHeatmap({ logs }: SobrietyHeatmapProps) {
  const [year, setYear] = useState(new Date().getFullYear())
  const [calendarData, setCalendarData] = useState<any[]>([])

  useEffect(() => {
    // Generate calendar data for the selected year
    const start = startOfYear(new Date(year, 0, 1))
    const end = endOfYear(new Date(year, 0, 1))

    const days = eachDayOfInterval({ start, end })

    // Map logs to days
    const mappedDays = days.map((day) => {
      const matchingLog = logs.find((log) => {
        const logDate = parseISO(log.check_in_date)
        return isEqual(
          new Date(day.getFullYear(), day.getMonth(), day.getDate()),
          new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate()),
        )
      })

      return {
        date: day,
        status: matchingLog ? matchingLog.status : null,
        notes: matchingLog ? matchingLog.notes : null,
      }
    })

    setCalendarData(mappedDays)
  }, [logs, year])

  // Group days by month and week for display
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1))

  // Get color for cell based on status
  const getCellColor = (status: string | null) => {
    if (!status) return "bg-gray-100"
    return status === "sober" ? "bg-green-500" : "bg-red-500"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button onClick={() => setYear(year - 1)} className="px-3 py-1 rounded border hover:bg-gray-100">
          &lt; {year - 1}
        </button>
        <h3 className="text-xl font-bold">{year}</h3>
        <button
          onClick={() => setYear(year + 1)}
          className="px-3 py-1 rounded border hover:bg-gray-100"
          disabled={year >= new Date().getFullYear()}
        >
          {year + 1} &gt;
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {months.map((month, monthIndex) => {
          // Get days for this month
          const monthDays = calendarData.filter((day) => day.date.getMonth() === monthIndex)

          // Calculate the day of week the month starts on (0 = Sunday)
          const firstDayOfWeek = new Date(year, monthIndex, 1).getDay()

          return (
            <Card key={monthIndex} className="overflow-hidden">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">{format(month, "MMMM")}</h4>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <div key={i} className="h-6 flex items-center justify-center font-medium">
                      {day}
                    </div>
                  ))}

                  {/* Empty cells for days before the month starts */}
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-6"></div>
                  ))}

                  {/* Actual days */}
                  {monthDays.map((day, i) => (
                    <TooltipProvider key={i}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-6 w-6 rounded-sm flex items-center justify-center cursor-pointer ${getCellColor(day.status)}`}
                          >
                            {day.date.getDate()}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <p className="font-medium">{format(day.date, "MMMM d, yyyy")}</p>
                            {day.status ? (
                              <>
                                <p className={day.status === "sober" ? "text-green-600" : "text-red-600"}>
                                  {day.status === "sober" ? "Sober" : "Relapse"}
                                </p>
                                {day.notes && <p className="text-gray-500">{day.notes}</p>}
                              </>
                            ) : (
                              <p className="text-gray-500">No check-in recorded</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
