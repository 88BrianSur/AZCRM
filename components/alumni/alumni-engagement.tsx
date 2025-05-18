"use client"

import { Badge } from "@/components/ui/badge"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, Users } from "lucide-react"

export function AlumniEngagement() {
  return (
    <Tabs defaultValue="events" className="space-y-4">
      <TabsList>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="communications">Communications</TabsTrigger>
        <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
      </TabsList>

      <TabsContent value="events" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Upcoming Alumni Events</h3>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Alumni Reunion Picnic",
              date: "2023-05-20",
              time: "12:00 PM - 4:00 PM",
              location: "Central Park",
              attendees: 28,
              description: "Annual alumni reunion picnic with games, food, and fellowship.",
            },
            {
              title: "Recovery Speaker Panel",
              date: "2023-04-15",
              time: "6:30 PM - 8:00 PM",
              location: "AZ House Main Hall",
              attendees: 45,
              description: "Alumni speakers sharing their recovery journey and success stories.",
            },
            {
              title: "Job Fair & Networking",
              date: "2023-06-10",
              time: "10:00 AM - 2:00 PM",
              location: "Community Center",
              attendees: 35,
              description: "Connect with employers and build professional networks.",
            },
            {
              title: "Wellness Workshop",
              date: "2023-05-05",
              time: "5:30 PM - 7:00 PM",
              location: "AZ House Wellness Room",
              attendees: 20,
              description: "Learn stress management and self-care techniques.",
            },
          ].map((event, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>
                      {new Date(event.date).toLocaleDateString()} • {event.time}
                    </CardDescription>
                  </div>
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{event.description}</p>
                  <p className="text-sm">
                    <span className="font-medium">Location:</span> {event.location}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{event.attendees} attending</span>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">Manage Event</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="communications" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Communication Campaigns</h3>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Email and text message campaigns to alumni</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Monthly Newsletter - April",
                  type: "Email",
                  sentDate: "2023-04-01",
                  recipients: 120,
                  openRate: "68%",
                  status: "Sent",
                },
                {
                  title: "Recovery Resources Update",
                  type: "Email",
                  sentDate: "2023-03-15",
                  recipients: 118,
                  openRate: "72%",
                  status: "Sent",
                },
                {
                  title: "Alumni Reunion Invitation",
                  type: "Email & SMS",
                  sentDate: "2023-03-10",
                  recipients: 125,
                  openRate: "85%",
                  status: "Sent",
                },
                {
                  title: "Employment Opportunities",
                  type: "Email",
                  sentDate: "",
                  recipients: 122,
                  openRate: "",
                  status: "Draft",
                },
              ].map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{campaign.title}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{campaign.type}</span>
                      {campaign.status === "Sent" && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Sent on {new Date(campaign.sentDate).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {campaign.status === "Sent" ? (
                      <div className="text-right">
                        <div className="text-sm">
                          <span className="font-medium">{campaign.recipients}</span> recipients
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{campaign.openRate}</span> open rate
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                    <Button variant="ghost" size="sm">
                      {campaign.status === "Sent" ? "View Report" : "Edit Draft"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="mentorship" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Alumni Mentorship Program</h3>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Match
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Mentorship Matches</CardTitle>
            <CardDescription>Alumni mentoring current clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  mentor: "John Smith",
                  mentee: "David Wilson",
                  startDate: "2023-02-15",
                  meetingFrequency: "Weekly",
                  lastMeeting: "2023-03-28",
                  status: "Active",
                },
                {
                  mentor: "Maria Garcia",
                  mentee: "Jennifer Adams",
                  startDate: "2023-01-10",
                  meetingFrequency: "Bi-weekly",
                  lastMeeting: "2023-03-20",
                  status: "Active",
                },
                {
                  mentor: "Robert Johnson",
                  mentee: "Michael Taylor",
                  startDate: "2023-03-05",
                  meetingFrequency: "Weekly",
                  lastMeeting: "2023-03-26",
                  status: "Active",
                },
              ].map((match, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="font-medium">
                        {match.mentor} → {match.mentee}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Started {new Date(match.startDate).toLocaleDateString()} • {match.meetingFrequency} meetings
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center gap-2">
                      <div className="text-sm">Last meeting: {new Date(match.lastMeeting).toLocaleDateString()}</div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mentorship Program Stats</CardTitle>
            <CardDescription>Current program metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg text-center">
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Active Matches</div>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg text-center">
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-muted-foreground">Available Mentors</div>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg text-center">
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
