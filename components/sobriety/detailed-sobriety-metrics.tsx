"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { SobrietyHeatmap } from "@/components/sobriety/sobriety-heatmap"
import { MilestoneProgress } from "@/components/sobriety/milestone-progress"
import { CheckInForm } from "@/components/sobriety/check-in-form"
import { getSobrietyData } from "@/app/actions/sobriety-actions"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Award, AlertTriangle, BarChart2, CheckCircle, Clock } from "lucide-react"
import { formatDistanceToNow, format, differenceInDays } from "date-fns"

interface DetailedSobrietyMetricsProps {
  clientId: string
}

export function DetailedSobrietyMetrics({ clientId }: DetailedSobrietyMetricsProps) {
  const [sobrietyData, setSobrietyData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)

  useEffect(() => {
    async function loadSobrietyData() {
      try {
        const data = await getSobrietyData(clientId)
        setSobrietyData(data)
      } catch (error) {
        console.error("Error loading sobriety data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSobrietyData()
  }, [clientId])

  const handleCheckInComplete = async () => {
    setIsCheckInOpen(false)
    setLoading(true)
    try {
      const data = await getSobrietyData(clientId)
      setSobrietyData(data)
    } catch (error) {
      console.error("Error refreshing sobriety data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const clientData = sobrietyData?.clientData || {}
  const logs = sobrietyData?.logs || []
  const milestones = sobrietyData?.milestones || []

  // Calculate time since program entry
  const programEntryDate = clientData.admission_date ? new Date(clientData.admission_date) : null
  const daysSinceEntry = programEntryDate ? differenceInDays(new Date(), programEntryDate) : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sobriety Tracking</h2>
        <Button onClick={() => setIsCheckInOpen(true)}>Record Check-In</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clientData.current_streak || 0} days</div>
            <p className="text-sm text-muted-foreground">Keep going! Every day counts.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-amber-500" />
              Longest Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clientData.longest_streak || 0} days</div>
            <p className="text-sm text-muted-foreground">Personal best record</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Last Relapse
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clientData.last_relapse_date ? (
              <>
                <div className="text-xl font-bold">{format(new Date(clientData.last_relapse_date), "MMM d, yyyy")}</div>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(clientData.last_relapse_date), { addSuffix: true })}
                </p>
              </>
            ) : (
              <div className="text-xl font-bold">No relapses recorded</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-blue-500" />
              Relapse Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clientData.relapse_count || 0}</div>
            <p className="text-sm text-muted-foreground">Total relapses recorded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-violet-500" />
              Milestones Achieved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{milestones.length}</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {milestones.map((milestone: any) => (
                <Badge key={milestone.id} variant="outline">
                  {milestone.days} days
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-emerald-500" />
              Program Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{daysSinceEntry} days</div>
            <p className="text-sm text-muted-foreground">Since program entry</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="heatmap">Calendar View</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sobriety Timeline</CardTitle>
              <CardDescription>History of check-ins and events</CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No check-ins recorded yet. Start tracking sobriety by adding a check-in.
                </p>
              ) : (
                <div className="relative pl-6 border-l">
                  {logs.map((log: any, index: number) => (
                    <div key={log.id} className="mb-8 relative">
                      <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
                      <div className="flex flex-col">
                        <time className="text-sm text-muted-foreground mb-1">
                          {format(new Date(log.check_in_date), "MMMM d, yyyy")}
                        </time>
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold">
                            {log.status === "sober" ? "Sobriety Check-in" : "Relapse Recorded"}
                          </h3>
                          <Badge
                            className={`ml-2 ${log.status === "sober" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {log.status === "sober" ? "Sober" : "Relapse"}
                          </Badge>
                        </div>
                        {log.notes && <p className="text-muted-foreground">{log.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sobriety Calendar</CardTitle>
              <CardDescription>Visual representation of sobriety check-ins</CardDescription>
            </CardHeader>
            <CardContent>
              <SobrietyHeatmap logs={logs} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sobriety Milestones</CardTitle>
              <CardDescription>Track progress towards important milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <MilestoneProgress
                currentStreak={clientData.current_streak || 0}
                milestones={milestones}
                clientId={clientId}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CheckInForm
        open={isCheckInOpen}
        onOpenChange={setIsCheckInOpen}
        clientId={clientId}
        onCheckInComplete={handleCheckInComplete}
      />
    </div>
  )
}
