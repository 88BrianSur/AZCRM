"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AlumniList } from "@/components/alumni/alumni-list"
import { AlumniEngagement } from "@/components/alumni/alumni-engagement"
import { AlumniOutcomes } from "@/components/alumni/alumni-outcomes"
import { AddAlumniDialog } from "@/components/alumni/add-alumni-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AlumniManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [isAddAlumniOpen, setIsAddAlumniOpen] = useState(false)

  const statuses = ["Active", "Inactive", "Engaged", "Lost Contact"]

  const handleStatusToggle = (status: string) => {
    setStatusFilter((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Alumni Management"
        description="Stay connected with program graduates"
        actions={
          <Button onClick={() => setIsAddAlumniOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Alumni
          </Button>
        }
      />

      <Tabs defaultValue="directory" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="directory">Alumni Directory</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
        </TabsList>
        <TabsContent value="directory" className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative w-full sm:w-96">
              <Input
                placeholder="Search alumni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Status
                  {statusFilter.length > 0 && ` (${statusFilter.length})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {statuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={() => handleStatusToggle(status)}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <AlumniList searchQuery={searchQuery} statusFilter={statusFilter} />
        </TabsContent>
        <TabsContent value="engagement" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alumni Engagement</CardTitle>
              <CardDescription>Track and manage alumni engagement activities</CardDescription>
            </CardHeader>
            <CardContent>
              <AlumniEngagement />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="outcomes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alumni Outcomes</CardTitle>
              <CardDescription>Track long-term recovery outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <AlumniOutcomes />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddAlumniDialog open={isAddAlumniOpen} onOpenChange={setIsAddAlumniOpen} />
    </div>
  )
}
