"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Award, AlertTriangle, Calendar } from "lucide-react"

interface SobrietyStatsProps {
  clients?: any[]
}

export function SobrietyStats({ clients = [] }: SobrietyStatsProps) {
  // Calculate statistics based on client data
  const calculateStats = () => {
    if (clients.length === 0) {
      return {
        averageSobriety: 0,
        averageTrend: 0,
        upcomingMilestones: 0,
        recentRelapses: 0,
        longestStreak: 0,
        longestClient: "None",
      }
    }

    const totalDays = clients.reduce((sum, client) => sum + client.days, 0)
    const averageSobriety = Math.round(totalDays / clients.length)

    // Simulate a trend (in a real app, this would compare to previous month)
    const averageTrend = Math.round(Math.random() * 20) - 5

    // Count clients with upcoming milestones (within 30 days)
    const upcomingMilestones = clients.filter((client) => {
      const nextMilestone = getNextMilestone(client.days)
      const daysToMilestone = nextMilestone - client.days
      return daysToMilestone <= 30 && daysToMilestone > 0
    }).length

    // Simulate recent relapses (in a real app, this would be actual data)
    const recentRelapses = Math.min(2, Math.floor(clients.length * 0.1))

    // Find longest streak
    const longestStreakClient = clients.reduce((longest, client) => (client.days > longest.days ? client : longest), {
      days: 0,
      name: "None",
    })

    return {
      averageSobriety,
      averageTrend,
      upcomingMilestones,
      recentRelapses,
      longestStreak: longestStreakClient.days,
      longestClient: longestStreakClient.name,
    }
  }

  // Helper function to get next milestone
  const getNextMilestone = (days: number) => {
    const milestones = [7, 30, 60, 90, 180, 365, 730, 1095]
    return milestones.find((m) => m > days) || (Math.floor(days / 365) + 1) * 365
  }

  const stats = calculateStats()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Sobriety</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
            <div className="text-2xl font-bold">{stats.averageSobriety} days</div>
          </div>
          <div className="flex items-center mt-1">
            {stats.averageTrend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <p className="text-xs text-muted-foreground">
              {stats.averageTrend > 0 ? "+" : ""}
              {stats.averageTrend} days from last month
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Award className="h-5 w-5 text-muted-foreground mr-2" />
            <div className="text-2xl font-bold">{stats.upcomingMilestones}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Within the next 30 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Recent Relapses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-muted-foreground mr-2" />
            <div className="text-2xl font-bold">{stats.recentRelapses}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">In the last 30 days</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Program Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium text-sm text-primary">Longest Streak</h3>
              <p className="text-xl font-bold mt-1">{stats.longestStreak} days</p>
              <p className="text-xs text-muted-foreground mt-1">By {stats.longestClient}</p>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium text-sm text-primary">Total Check-ins</h3>
              <p className="text-xl font-bold mt-1">
                {clients.reduce((sum, client) => sum + (client.checkIns?.length || 0), 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Across all clients</p>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium text-sm text-primary">Program Success Rate</h3>
              <p className="text-xl font-bold mt-1">
                {clients.length > 0 ? Math.round(((clients.length - stats.recentRelapses) / clients.length) * 100) : 0}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Based on current sobriety</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
