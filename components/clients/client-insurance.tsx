"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, CheckCircle, XCircle } from "lucide-react"
import { EmptyState } from "@/components/empty-state"

interface ClientInsuranceProps {
  clientId: string
}

export function ClientInsurance({ clientId }: ClientInsuranceProps) {
  // Mock data - in a real app, this would come from an API or database
  const insuranceData = {
    primaryInsurance: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "BCBS12345678",
      groupNumber: "GRP789012",
      subscriberName: "John Smith",
      subscriberRelationship: "Self",
      effectiveDate: "2023-01-01",
      expirationDate: "2023-12-31",
      coverageType: "PPO",
      status: "Active",
    },
    secondaryInsurance: null,
    verificationHistory: [
      {
        id: "1",
        date: "2023-01-10",
        verifiedBy: "Jane Doe",
        coverageConfirmed: true,
        authorizationNumber: "AUTH123456",
        approvedSessions: 20,
        approvedDays: null,
        notes: "Coverage confirmed for outpatient services",
      },
      {
        id: "2",
        date: "2023-03-15",
        verifiedBy: "Jane Doe",
        coverageConfirmed: true,
        authorizationNumber: "AUTH789012",
        approvedSessions: 15,
        approvedDays: null,
        notes: "Additional sessions approved",
      },
    ],
    documents: [
      {
        id: "1",
        title: "Insurance Card (Front)",
        dateUploaded: "2023-01-05",
        uploadedBy: "Admin Staff",
        type: "Image",
      },
      {
        id: "2",
        title: "Insurance Card (Back)",
        dateUploaded: "2023-01-05",
        uploadedBy: "Admin Staff",
        type: "Image",
      },
      {
        id: "3",
        title: "Benefits Explanation",
        dateUploaded: "2023-01-12",
        uploadedBy: "Admin Staff",
        type: "PDF",
      },
    ],
  }

  const hasInsuranceData =
    insuranceData.primaryInsurance ||
    insuranceData.secondaryInsurance ||
    insuranceData.verificationHistory.length > 0 ||
    insuranceData.documents.length > 0

  if (!hasInsuranceData) {
    return (
      <EmptyState
        title="No insurance information"
        description="No insurance information has been recorded for this client yet."
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Insurance Information
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Insurance Information</h3>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Insurance
        </Button>
      </div>

      {/* Primary Insurance */}
      {insuranceData.primaryInsurance && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Primary Insurance</CardTitle>
              <Button variant="ghost" size="sm">
                <FileText className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </div>
            <CardDescription>
              Status:{" "}
              <span
                className={insuranceData.primaryInsurance.status === "Active" ? "text-green-600" : "text-amber-600"}
              >
                {insuranceData.primaryInsurance.status}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Provider</p>
                <p>{insuranceData.primaryInsurance.provider}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coverage Type</p>
                <p>{insuranceData.primaryInsurance.coverageType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Policy Number</p>
                <p>{insuranceData.primaryInsurance.policyNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Group Number</p>
                <p>{insuranceData.primaryInsurance.groupNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subscriber</p>
                <p>
                  {insuranceData.primaryInsurance.subscriberName} (
                  {insuranceData.primaryInsurance.subscriberRelationship})
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Effective Period</p>
                <p>
                  {insuranceData.primaryInsurance.effectiveDate} to {insuranceData.primaryInsurance.expirationDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Secondary Insurance */}
      {insuranceData.secondaryInsurance && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Secondary Insurance</CardTitle>
              <Button variant="ghost" size="sm">
                <FileText className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </div>
            <CardDescription>
              Status:{" "}
              <span
                className={insuranceData.secondaryInsurance.status === "Active" ? "text-green-600" : "text-amber-600"}
              >
                {insuranceData.secondaryInsurance.status}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Provider</p>
                <p>{insuranceData.secondaryInsurance.provider}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coverage Type</p>
                <p>{insuranceData.secondaryInsurance.coverageType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Policy Number</p>
                <p>{insuranceData.secondaryInsurance.policyNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Group Number</p>
                <p>{insuranceData.secondaryInsurance.groupNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subscriber</p>
                <p>
                  {insuranceData.secondaryInsurance.subscriberName} (
                  {insuranceData.secondaryInsurance.subscriberRelationship})
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Effective Period</p>
                <p>
                  {insuranceData.secondaryInsurance.effectiveDate} to {insuranceData.secondaryInsurance.expirationDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification History */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Verification History</CardTitle>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add verification</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {insuranceData.verificationHistory.length > 0 ? (
            <div className="space-y-4">
              {insuranceData.verificationHistory.map((verification) => (
                <div key={verification.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className="bg-muted p-2 rounded-md">
                        {verification.coverageConfirmed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">
                          Verification on {verification.date}
                          {verification.coverageConfirmed ? " - Coverage Confirmed" : " - Coverage Denied"}
                        </h4>
                        <p className="text-sm text-muted-foreground">Verified by: {verification.verifiedBy}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </div>
                  <div className="mt-2 text-sm">
                    {verification.authorizationNumber && (
                      <p>
                        <span className="font-medium">Auth #:</span> {verification.authorizationNumber}
                      </p>
                    )}
                    {verification.approvedSessions && (
                      <p>
                        <span className="font-medium">Approved Sessions:</span> {verification.approvedSessions}
                      </p>
                    )}
                    {verification.approvedDays && (
                      <p>
                        <span className="font-medium">Approved Days:</span> {verification.approvedDays}
                      </p>
                    )}
                    {verification.notes && <p className="mt-1">{verification.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No verification history recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Insurance Documents */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Insurance Documents</CardTitle>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Upload document</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {insuranceData.documents.length > 0 ? (
            <div className="space-y-2">
              {insuranceData.documents.map((doc) => (
                <div key={doc.id} className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded on {doc.dateUploaded} by {doc.uploadedBy}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No insurance documents uploaded</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
