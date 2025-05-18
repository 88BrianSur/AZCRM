"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  FileText,
  FileImage,
  File,
  Download,
  Search,
  Filter,
  SortAsc,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"
import { EmptyState } from "@/components/empty-state"

interface ClientDocumentsProps {
  clientId: string
}

export function ClientDocuments({ clientId }: ClientDocumentsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Mock data - in a real app, this would come from an API or database
  const documents = [
    {
      id: "1",
      title: "Intake Assessment",
      category: "Assessment",
      type: "PDF",
      size: "1.2 MB",
      uploadedBy: "Dr. Sarah Williams",
      uploadedAt: "2023-01-15T14:30:00Z",
      status: "Completed",
      tags: ["intake", "assessment", "initial"],
    },
    {
      id: "2",
      title: "Treatment Plan",
      category: "Treatment",
      type: "DOCX",
      size: "845 KB",
      uploadedBy: "Dr. Sarah Williams",
      uploadedAt: "2023-01-20T10:15:00Z",
      status: "Completed",
      tags: ["treatment", "plan", "goals"],
    },
    {
      id: "3",
      title: "Insurance Card (Front)",
      category: "Insurance",
      type: "JPG",
      size: "350 KB",
      uploadedBy: "Admin Staff",
      uploadedAt: "2023-01-05T09:45:00Z",
      status: "Completed",
      tags: ["insurance", "documentation"],
    },
    {
      id: "4",
      title: "Insurance Card (Back)",
      category: "Insurance",
      type: "JPG",
      size: "320 KB",
      uploadedBy: "Admin Staff",
      uploadedAt: "2023-01-05T09:46:00Z",
      status: "Completed",
      tags: ["insurance", "documentation"],
    },
    {
      id: "5",
      title: "Medical History Form",
      category: "Medical",
      type: "PDF",
      size: "980 KB",
      uploadedBy: "John Smith",
      uploadedAt: "2023-01-10T11:20:00Z",
      status: "Completed",
      tags: ["medical", "history", "health"],
    },
    {
      id: "6",
      title: "Release of Information",
      category: "Legal",
      type: "PDF",
      size: "540 KB",
      uploadedBy: "Admin Staff",
      uploadedAt: "2023-01-12T13:10:00Z",
      status: "Pending Signature",
      tags: ["legal", "release", "consent"],
    },
    {
      id: "7",
      title: "Progress Note - Session 1",
      category: "Notes",
      type: "PDF",
      size: "420 KB",
      uploadedBy: "Dr. Sarah Williams",
      uploadedAt: "2023-01-22T15:30:00Z",
      status: "Completed",
      tags: ["progress", "notes", "session"],
    },
  ]

  // Filter documents based on search query and active tab
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTab = activeTab === "all" || doc.category.toLowerCase() === activeTab.toLowerCase()

    return matchesSearch && matchesTab
  })

  const getDocumentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />
      case "jpg":
      case "png":
      case "gif":
        return <FileImage className="h-6 w-6 text-blue-500" />
      case "docx":
      case "doc":
        return <FileText className="h-6 w-6 text-blue-600" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "pending signature":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "needs review":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        title="No documents"
        description="No documents have been uploaded for this client yet."
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <SortAsc className="mr-2 h-4 w-4" />
            Sort
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="treatment">Treatment</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredDocuments.length > 0 ? (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-4 p-3 hover:bg-muted rounded-md">
                  <div className="flex-shrink-0">{getDocumentIcon(doc.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium truncate">{doc.title}</h4>
                      {getStatusIcon(doc.status) && (
                        <div className="ml-2 flex items-center">
                          {getStatusIcon(doc.status)}
                          <span className="ml-1 text-xs">{doc.status}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{doc.category}</span>
                      <span className="mx-1">•</span>
                      <span>{doc.type}</span>
                      <span className="mx-1">•</span>
                      <span>{doc.size}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(doc.uploadedAt)}</span>
                      <span className="mx-1">•</span>
                      <span>By: {doc.uploadedBy}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="flex-shrink-0">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No documents found"
              description={
                searchQuery
                  ? `No documents matching "${searchQuery}" found`
                  : `No ${activeTab !== "all" ? activeTab : ""} documents found`
              }
              action={
                <Button onClick={() => setSearchQuery("")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              }
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
