"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"

export function AlumniOutcomes() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="sobriety">Sobriety</TabsTrigger>
        <TabsTrigger value="employment">Employment</TabsTrigger>
        <TabsTrigger value="housing">Housing</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Outcome Metrics</CardTitle>
            <CardDescription>Program success indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Sobriety Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">Alumni sober for 1+ year</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Employment Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">82%</div>
                  <p className="text-xs text-muted-foreground">Alumni employed or in school</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Stable Housing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">91%</div>
                  <p className="text-xs text-muted-foreground">Alumni in stable housing</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Long-term Outcomes</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span>Sobriety Maintained</span>
                  </div>
                  <div className="w-full max-w-md bg-muted rounded-full h-2.5 mx-4">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                  <span className="font-medium">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Employed Full-time</span>
                  </div>
                  <div className="w-full max-w-md bg-muted rounded-full h-2.5 mx-4">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                  <span className="font-medium">65%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Improved Relationships</span>
                  </div>
                  <div className="w-full max-w-md bg-muted rounded-full h-2.5 mx-4">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "72%" }}></div>
                  </div>
                  <span className="font-medium">72%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span>No Legal Issues</span>
                  </div>
                  <div className="w-full max-w-md bg-muted rounded-full h-2.5 mx-4">
                    <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "88%" }}></div>
                  </div>
                  <span className="font-medium">88%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span>Continued Recovery Support</span>
                  </div>
                  <div className="w-full max-w-md bg-muted rounded-full h-2.5 mx-4">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "81%" }}></div>
                  </div>
                  <span className="font-medium">81%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sobriety" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Sobriety Milestones</h3>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Record Update
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { name: "John Smith", days: 365, milestone: "1 Year" },
                  { name: "Maria Garcia", days: 180, milestone: "6 Months" },
                  { name: "Sarah Williams", days: 90, milestone: "90 Days" },
                  { name: "Michael Brown", days: 30, milestone: "30 Days" },
                  { name: "Jennifer Davis", days: 548, milestone: "18 Months" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <span className="text-primary font-bold">{item.milestone.split(" ")[0]}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.days} days of sobriety</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Update
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="employment" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Employment Status</CardTitle>
            <CardDescription>Current employment metrics for alumni</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <div className="text-2xl font-bold">65%</div>
                  <div className="text-sm text-muted-foreground">Full-time Employment</div>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <div className="text-2xl font-bold">12%</div>
                  <div className="text-sm text-muted-foreground">Part-time Employment</div>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <div className="text-2xl font-bold">5%</div>
                  <div className="text-sm text-muted-foreground">In Education/Training</div>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <div className="text-2xl font-bold">18%</div>
                  <div className="text-sm text-muted-foreground">Seeking Employment</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Employment by Industry</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Healthcare</span>
                    </div>
                    <div className="w-full max-w-md bg-muted rounded-full h-2.5 mx-4">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "22%" }}></div>
                    </div>
                    <span className="font-medium">22%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Construction</span>
                    </div>
                    <div className="w-full max-w-md bg-muted rounded-full h-2.5 mx-4">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "18%" }}></div>
                    </div>
                    <span className="font-medium">18%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span>Retail</span>
                    </div>
                    <div className="w-full max-w-md bg-muted rounded-full h-2.5 mx-4">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span>Food Service</span>
                    </div>
                    <div className="w-full max-w-md bg-muted rounded-full h-2.5 mx-4">
                      <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "12%" }}></div>
                    </div>
                    <span className="font-medium">12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Other</span>
                    </div>
                    <div className="w-full max-w-md bg-muted rounded-full h-2.5 mx-4">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "33%" }}></div>
                    </div>
                    <span className="font-medium">33%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="housing" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Housing Stability</CardTitle>
            <CardDescription>Current housing metrics for alumni</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <div className="text-2xl font-bold">45%</div>
                  <div className="text-sm text-muted-foreground">Own Home</div>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <div className="text-2xl font-bold">38%</div>
                  <div className="text-sm text-muted-foreground">Rent Apartment</div>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <div className="text-2xl font-bold">8%</div>
                  <div className="text-sm text-muted-foreground">Sober Living</div>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <div className="text-2xl font-bold">9%</div>
                  <div className="text-sm text-muted-foreground">With Family</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Housing Stability Over Time</h3>
                <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">Housing stability chart will be displayed here</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
