"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
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
  Trash2,
  Eye,
} from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from "uuid"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface ClientDocumentsProps {
  clientId: string
}

interface Document {
  id: string
  title: string
  category: string
  type: string
  size: string
  uploadedBy: string
  uploadedAt: string
  status: string
  tags: string[]
  url?: string
  path?: string
}

export function ClientDocuments({ clientId }: ClientDocumentsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [documents, setDocuments] = useState<Document[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentTitle, setDocumentTitle] = useState("")
  const [documentCategory, setDocumentCategory] = useState("Assessment")
  const [viewDocument, setViewDocument] = useState<Document | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)

  const supabase = createClientComponentClient()
  const { toast } = useToast()

  // Mock data - in a real app, this would come from an API or database
  const mockDocuments = [
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
      url: "https://example.com/mock-document.pdf",
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
      url: "https://example.com/mock-document.docx",
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
      url: "https://example.com/mock-document.jpg",
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
      url: "https://example.com/mock-document.jpg",
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
      url: "https://example.com/mock-document.pdf",
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
      url: "https://example.com/mock-document.pdf",
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
      url: "https://example.com/mock-document.pdf",
    },
  ]

  const fetchDocuments = useCallback(async () => {
    try {
      // Check if client_documents table exists
      const { error: tableCheckError } = await supabase.from("client_documents").select("id").limit(1)

      if (tableCheckError) {
        console.log("Using mock data for documents:", tableCheckError.message)
        setDocuments(mockDocuments)
        setUsingMockData(true)
        return
      }

      // If table exists, fetch real documents
      const { data, error } = await supabase
        .from("client_documents")
        .select("*")
        .eq("client_id", clientId)
        .order("uploaded_at", { ascending: false })

      if (error) {
        console.error("Error fetching documents:", error)
        setDocuments(mockDocuments)
        setUsingMockData(true)
        return
      }

      if (data && data.length > 0) {
        // Transform data to match our Document interface
        const formattedDocs = data.map((doc) => ({
          id: doc.id,
          title: doc.title,
          category: doc.category,
          type: doc.file_type,
          size: doc.file_size,
          uploadedBy: doc.uploaded_by || "Staff Member",
          uploadedAt: doc.uploaded_at,
          status: doc.status || "Completed",
          tags: doc.tags || [],
          url: doc.file_url,
          path: doc.file_path,
        }))
        setDocuments(formattedDocs)
      } else {
        // No documents found, use mock data
        setDocuments(mockDocuments)
        setUsingMockData(true)
      }
    } catch (error) {
      console.error("Error in fetchDocuments:", error)
      setDocuments(mockDocuments)
      setUsingMockData(true)
    }
  }, [clientId, supabase])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])

      // Auto-fill title with filename if empty
      if (!documentTitle) {
        const fileName = e.target.files[0].name
        // Remove extension from filename
        const titleWithoutExt = fileName.substring(0, fileName.lastIndexOf(".")) || fileName
        setDocumentTitle(titleWithoutExt)
      }
    }
  }

  const uploadDocument = async () => {
    if (!selectedFile || !documentTitle) {
      toast({
        title: "Missing information",
        description: "Please provide a file and title",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // If using mock data, simulate upload
      if (usingMockData) {
        // Simulate upload progress
        let progress = 0
        const interval = setInterval(() => {
          progress += 10
          setUploadProgress(progress)
          if (progress >= 100) {
            clearInterval(interval)

            // Add to mock documents
            const newDoc: Document = {
              id: uuidv4(),
              title: documentTitle,
              category: documentCategory,
              type: selectedFile.name.split(".").pop()?.toUpperCase() || "FILE",
              size: `${Math.round(selectedFile.size / 1024)} KB`,
              uploadedBy: "Current User",
              uploadedAt: new Date().toISOString(),
              status: "Completed",
              tags: [documentCategory.toLowerCase()],
              url: URL.createObjectURL(selectedFile),
            }

            setDocuments((prev) => [newDoc, ...prev])

            toast({
              title: "Document uploaded",
              description: "Document has been uploaded successfully",
            })

            // Reset form
            setSelectedFile(null)
            setDocumentTitle("")
            setDocumentCategory("Assessment")
            setIsUploading(false)
          }
        }, 200)

        return
      }

      // Real upload to Supabase Storage
      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `${clientId}/${fileName}`

      // Check if storage bucket exists
      const { data: buckets } = await supabase.storage.listBuckets()
      const clientDocsBucket = buckets?.find((b) => b.name === "client_documents")

      if (!clientDocsBucket) {
        // Create bucket if it doesn't exist
        await supabase.storage.createBucket("client_documents", {
          public: false,
          fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
        })
      }

      // Upload file with progress tracking
      const { error: uploadError } = await supabase.storage.from("client_documents").upload(filePath, selectedFile, {
        cacheControl: "3600",
        upsert: false,
        onUploadProgress: (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100)
          setUploadProgress(percent)
        },
      })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: urlData } = await supabase.storage
        .from("client_documents")
        .createSignedUrl(filePath, 60 * 60 * 24 * 7) // 7 day expiry

      // Save document metadata to database
      const { error: dbError } = await supabase.from("client_documents").insert({
        id: uuidv4(),
        client_id: clientId,
        title: documentTitle,
        category: documentCategory,
        file_type: fileExt?.toUpperCase() || "FILE",
        file_size: `${Math.round(selectedFile.size / 1024)} KB`,
        file_path: filePath,
        file_url: urlData?.signedUrl || "",
        uploaded_by: "Current User", // Should be replaced with actual user ID
        uploaded_at: new Date().toISOString(),
        status: "Completed",
        tags: [documentCategory.toLowerCase()],
      })

      if (dbError) {
        throw dbError
      }

      // Refresh document list
      fetchDocuments()

      toast({
        title: "Document uploaded",
        description: "Document has been uploaded successfully",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      })

      // If using real data but upload failed, fall back to mock data
      if (!usingMockData) {
        const newDoc: Document = {
          id: uuidv4(),
          title: documentTitle,
          category: documentCategory,
          type: selectedFile.name.split(".").pop()?.toUpperCase() || "FILE",
          size: `${Math.round(selectedFile.size / 1024)} KB`,
          uploadedBy: "Current User",
          uploadedAt: new Date().toISOString(),
          status: "Completed",
          tags: [documentCategory.toLowerCase()],
          url: URL.createObjectURL(selectedFile),
        }

        setDocuments((prev) => [newDoc, ...prev])
      }
    } finally {
      setIsUploading(false)
      setSelectedFile(null)
      setDocumentTitle("")
      setDocumentCategory("Assessment")
    }
  }

  const deleteDocument = async (docId: string) => {
    try {
      // If using mock data, just remove from state
      if (usingMockData) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== docId))
        toast({
          title: "Document deleted",
          description: "Document has been deleted successfully",
        })
        return
      }

      // Find document to get file path
      const docToDelete = documents.find((doc) => doc.id === docId)

      if (!docToDelete || !docToDelete.path) {
        throw new Error("Document not found or path missing")
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage.from("client_documents").remove([docToDelete.path])

      if (storageError) {
        throw storageError
      }

      // Delete from database
      const { error: dbError } = await supabase.from("client_documents").delete().eq("id", docId)

      if (dbError) {
        throw dbError
      }

      // Update state
      setDocuments((prev) => prev.filter((doc) => doc.id !== docId))

      toast({
        title: "Document deleted",
        description: "Document has been deleted successfully",
      })
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting the document",
        variant: "destructive",
      })

      // If using real data but delete failed, remove from state anyway
      if (!usingMockData) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== docId))
      }
    }
  }

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
      case "jpeg":
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
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
                <DialogDescription>
                  Upload a document for this client. The document will be securely stored.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Document Title
                  </label>
                  <Input
                    id="title"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    placeholder="Enter document title"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category
                  </label>
                  <select
                    id="category"
                    value={documentCategory}
                    onChange={(e) => setDocumentCategory(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Assessment">Assessment</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Medical">Medical</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Legal">Legal</option>
                    <option value="Notes">Notes</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="file" className="text-sm font-medium">
                    File
                  </label>
                  <Input id="file" type="file" onChange={handleFileChange} className="cursor-pointer" />
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                    </p>
                  )}
                </div>
                {isUploading && (
                  <div className="space-y-2">
                    <p className="text-sm">Uploading: {uploadProgress}%</p>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={uploadDocument} disabled={isUploading || !selectedFile}>
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      {usingMockData && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm">
          <AlertCircle className="h-4 w-4 inline-block mr-2" />
          Using mock document data. Database tables not configured.
        </div>
      )}

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
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
                <DialogDescription>
                  Upload a document for this client. The document will be securely stored.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Document Title
                  </label>
                  <Input
                    id="title"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    placeholder="Enter document title"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category
                  </label>
                  <select
                    id="category"
                    value={documentCategory}
                    onChange={(e) => setDocumentCategory(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Assessment">Assessment</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Medical">Medical</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Legal">Legal</option>
                    <option value="Notes">Notes</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="file" className="text-sm font-medium">
                    File
                  </label>
                  <Input id="file" type="file" onChange={handleFileChange} className="cursor-pointer" />
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                    </p>
                  )}
                </div>
                {isUploading && (
                  <div className="space-y-2">
                    <p className="text-sm">Uploading: {uploadProgress}%</p>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={uploadDocument} disabled={isUploading || !selectedFile}>
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                  <div className="flex-shrink-0 flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => setViewDocument(doc)} title="View document">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button variant="ghost" size="sm" title="Download document">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteDocument(doc.id)} title="Delete document">
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload New Document</DialogTitle>
                      <DialogDescription>
                        Upload a document for this client. The document will be securely stored.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                          Document Title
                        </label>
                        <Input
                          id="title"
                          value={documentTitle}
                          onChange={(e) => setDocumentTitle(e.target.value)}
                          placeholder="Enter document title"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-medium">
                          Category
                        </label>
                        <select
                          id="category"
                          value={documentCategory}
                          onChange={(e) => setDocumentCategory(e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="Assessment">Assessment</option>
                          <option value="Treatment">Treatment</option>
                          <option value="Medical">Medical</option>
                          <option value="Insurance">Insurance</option>
                          <option value="Legal">Legal</option>
                          <option value="Notes">Notes</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="file" className="text-sm font-medium">
                          File
                        </label>
                        <Input id="file" type="file" onChange={handleFileChange} className="cursor-pointer" />
                        {selectedFile && (
                          <p className="text-xs text-muted-foreground">
                            Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                          </p>
                        )}
                      </div>
                      {isUploading && (
                        <div className="space-y-2">
                          <p className="text-sm">Uploading: {uploadProgress}%</p>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={uploadDocument} disabled={isUploading || !selectedFile}>
                        {isUploading ? "Uploading..." : "Upload"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              }
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Document Viewer Dialog */}
      {viewDocument && (
        <Dialog open={!!viewDocument} onOpenChange={(open) => !open && setViewDocument(null)}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{viewDocument.title}</DialogTitle>
              <DialogDescription>
                {viewDocument.category} • {viewDocument.type} • Uploaded on {formatDate(viewDocument.uploadedAt)}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              {viewDocument.type.toLowerCase() === "pdf" ? (
                <iframe src={viewDocument.url} className="w-full h-full border-0" title={viewDocument.title} />
              ) : viewDocument.type.toLowerCase().match(/^(jpg|jpeg|png|gif)$/) ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <img
                    src={viewDocument.url || "/placeholder.svg"}
                    alt={viewDocument.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-8 text-center">
                  <File className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">Preview not available</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    This file type ({viewDocument.type}) cannot be previewed directly.
                  </p>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download File
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDocument(null)}>
                Close
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
