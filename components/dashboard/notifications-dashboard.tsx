"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, CheckCircle, FileText, Settings, User } from "lucide-react"

// Mock notification data
const notifications = [
  {
    id: 1,
    type: "client",
    title: "New client intake completed",
    description: "John Smith's intake process has been completed",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "meeting",
    title: "Upcoming team meeting",
    description: "Weekly staff meeting at 2:00 PM today",
    time: "30 minutes ago",
    read: false,
  },
  {
    id: 3,
    type: "note",
    title: "Progress note requires review",
    description: "Dr. Williams submitted a progress note for your review",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    type: "client",
    title: "Client status updated",
    description: "Maria Garcia has completed Phase 2 of treatment",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "milestone",
    title: "Sobriety milestone achieved",
    description: "Robert Johnson has reached 90 days of sobriety",
    time: "5 hours ago",
    read: true,
  },
  {
    id: 6,
    type: "meeting",
    title: "Appointment rescheduled",
    description: "Sarah Williams rescheduled her appointment to tomorrow at 10:00 AM",
    time: "Yesterday",
    read: true,
  },
  {
    id: 7,
    type: "note",
    title: "New case note added",
    description: "A new case note has been added for David Brown",
    time: "Yesterday",
    read: true,
  },
  {
    id: 8,
    type: "client",
    title: "Client discharge summary",
    description: "Discharge summary for Thomas Anderson is ready for review",
    time: "2 days ago",
    read: true,
  },
]

export function NotificationsDashboard() {
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    clientUpdates: true,
    appointmentReminders: true,
    systemAlerts: true,
    teamMessages: true,
  })
  const [activeNotifications, setActiveNotifications] = useState(notifications)

  const unreadCount = activeNotifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setActiveNotifications(
      activeNotifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  const markAsRead = (id: number) => {
    setActiveNotifications(
      activeNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "client":
        return <User className="h-5 w-5 text-blue-500" />
      case "meeting":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "note":
        return <FileText className="h-5 w-5 text-green-500" />
      case "milestone":
        return <CheckCircle className="h-5 w-5 text-amber-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>View all your recent notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No notifications to display</p>
                </div>
              ) : (
                activeNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-4 p-3 rounded-lg ${
                      notification.read ? "bg-background" : "bg-muted"
                    }`}
                  >
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark read
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
              <CardDescription>View your unread notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeNotifications.filter((n) => !n.read).length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No unread notifications</p>
                </div>
              ) : (
                activeNotifications
                  .filter((n) => !n.read)
                  .map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-4 p-3 rounded-lg bg-muted">
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark read
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Notifications</CardTitle>
              <CardDescription>Notifications related to clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeNotifications.filter((n) => n.type === "client").length === 0 ? (
                <div className="text-center py-8">
                  <User className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No client notifications</p>
                </div>
              ) : (
                activeNotifications
                  .filter((n) => n.type === "client")
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start space-x-4 p-3 rounded-lg ${
                        notification.read ? "bg-background" : "bg-muted"
                      }`}
                    >
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                          </div>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark read
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Notifications</CardTitle>
              <CardDescription>Notifications related to meetings and appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeNotifications.filter((n) => n.type === "meeting").length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No meeting notifications</p>
                </div>
              ) : (
                activeNotifications
                  .filter((n) => n.type === "meeting")
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start space-x-4 p-3 rounded-lg ${
                        notification.read ? "bg-background" : "bg-muted"
                      }`}
                    >
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                          </div>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark read
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Delivery Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, email: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Push Notifications</label>
                      <p className="text-xs text-muted-foreground">Receive notifications in your browser</p>
                    </div>
                    <Switch
                      checked={notificationSettings.push}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, push: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">SMS Notifications</label>
                      <p className="text-xs text-muted-foreground">Receive notifications via text message</p>
                    </div>
                    <Switch
                      checked={notificationSettings.sms}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, sms: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Client Updates</label>
                      <p className="text-xs text-muted-foreground">
                        Notifications about client status changes and updates
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.clientUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, clientUpdates: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Appointment Reminders</label>
                      <p className="text-xs text-muted-foreground">
                        Reminders about upcoming appointments and meetings
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.appointmentReminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, appointmentReminders: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">System Alerts</label>
                      <p className="text-xs text-muted-foreground">Important system alerts and announcements</p>
                    </div>
                    <Switch
                      checked={notificationSettings.systemAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, systemAlerts: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Team Messages</label>
                      <p className="text-xs text-muted-foreground">Messages and updates from team members</p>
                    </div>
                    <Switch
                      checked={notificationSettings.teamMessages}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, teamMessages: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
