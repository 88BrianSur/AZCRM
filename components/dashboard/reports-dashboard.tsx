"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileText, Printer, Share2 } from "lucide-react"

// Mock report types
const reportTypes = [
  { id: "client-summary", name: "Client Summary Report" },
  { id: "treatment-outcomes", name: "Treatment Outcomes Report" },
  { id: "staff-performance", name: "Staff Performance Report" },
  { id: "financial-summary", name: "Financial Summary Report" },
  { id: "compliance-audit", name: "Compliance Audit Report" },
  { id: "alumni-outcomes", name: "Alumni Outcomes Report" },
]

// Mock saved reports
const savedReports = [
  {
    id: 1,
    name: "Q1 Client Outcomes",
    type: "Treatment Outcomes Report",
    dateRange: "Jan 1, 2023 - Mar 31, 2023",
    createdAt: "Apr 5, 2023",
    createdBy: "John Smith",
  },
  {
    id: 2,
    name: "Annual Compliance Report",
    type: "Compliance Audit Report",
    dateRange: "Jan 1, 2023 - Dec 31, 2023",
    createdAt: "Jan 15, 2024",
    createdBy: "Sarah Johnson",
  },
  {
    id: 3,
    name: "Staff Performance Q4",
    type: "Staff Performance Report",
    dateRange: "Oct 1, 2023 - Dec 31, 2023",
    createdAt: "Jan 10, 2024",
    createdBy: "Michael Brown",
  },
  {
    id: 4,
    name: "Alumni 1-Year Follow-up",
    type: "Alumni Outcomes Report",
    dateRange: "Jan 1, 2023 - Dec 31, 2023",
    createdAt: "Jan 20, 2024",
    createdBy: "John Smith",
  },
]

export function ReportsDashboard() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1), // Jan 1 of current year
    to: new Date(),
  })
  const [selectedReportType, setSelectedReportType] = useState("")
  const [includeOptions, setIncludeOptions] = useState({
    demographics: true,
    treatmentDetails: true,
    outcomes: true,
    financials: false,
  })

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
            <CardDescription>Create a custom report based on your requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <DateRangePicker date={{ from: dateRange.from, to: dateRange.to }} onDateChange={setDateRange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Include in Report</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="demographics"
                    checked={includeOptions.demographics}
                    onCheckedChange={(checked) => setIncludeOptions({ ...includeOptions, demographics: !!checked })}
                  />
                  <label htmlFor="demographics" className="text-sm">
                    Demographics
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="treatmentDetails"
                    checked={includeOptions.treatmentDetails}
                    onCheckedChange={(checked) => setIncludeOptions({ ...includeOptions, treatmentDetails: !!checked })}
                  />
                  <label htmlFor="treatmentDetails" className="text-sm">
                    Treatment Details
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="outcomes"
                    checked={includeOptions.outcomes}
                    onCheckedChange={(checked) => setIncludeOptions({ ...includeOptions, outcomes: !!checked })}
                  />
                  <label htmlFor="outcomes" className="text-sm">
                    Outcomes
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="financials"
                    checked={includeOptions.financials}
                    onCheckedChange={(checked) => setIncludeOptions({ ...includeOptions, financials: !!checked })}
                  />
                  <label htmlFor="financials" className="text-sm">
                    Financial Information
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Generate Report</Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Saved Reports</CardTitle>
            <CardDescription>Access your previously generated reports</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-auto">
            <div className="space-y-4">
              {savedReports.map((report) => (
                <div key={report.id} className="flex flex-col space-y-2 rounded-lg border p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>Date Range: {report.dateRange}</p>
                    <p>
                      Created: {report.createdAt} by {report.createdBy}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Printer className="mr-1 h-3 w-3" />
                      Print
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-1 h-3 w-3" />
                      Share
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Reports
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
          <CardDescription>Manage your automated report generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <p className="text-muted-foreground">You don't have any scheduled reports yet.</p>
            <Button variant="outline" className="mt-4">
              Create Scheduled Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
