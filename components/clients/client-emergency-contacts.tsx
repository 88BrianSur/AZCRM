"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Phone, Mail, Edit, Trash2 } from "lucide-react"
import { EmptyState } from "@/components/empty-state"

interface ClientEmergencyContactsProps {
  clientId: string
}

export function ClientEmergencyContacts({ clientId }: ClientEmergencyContactsProps) {
  // Mock data - in a real app, this would come from an API or database
  const emergencyContacts = [
    {
      id: "1",
      name: "Jane Smith",
      relationship: "Spouse",
      primaryPhone: "(555) 987-6543",
      alternatePhone: "(555) 123-4567",
      email: "jane.smith@example.com",
      address: "123 Recovery Lane, Phoenix, AZ 85001",
      isPrimary: true,
      canDiscussHealth: true,
      canDiscussFinancial: true,
      notes: "Preferred contact for all matters.",
    },
    {
      id: "2",
      name: "Robert Smith",
      relationship: "Father",
      primaryPhone: "(555) 456-7890",
      alternatePhone: "",
      email: "robert.smith@example.com",
      address: "456 Family Street, Phoenix, AZ 85002",
      isPrimary: false,
      canDiscussHealth: true,
      canDiscussFinancial: false,
      notes: "Contact only in emergencies if primary contact unavailable.",
    },
  ]

  if (emergencyContacts.length === 0) {
    return (
      <EmptyState
        title="No emergency contacts"
        description="No emergency contacts have been added for this client yet."
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Emergency Contact
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Emergency Contacts</h3>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {emergencyContacts.map((contact) => (
          <Card key={contact.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    {contact.name}
                    {contact.isPrimary && (
                      <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        Primary
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>{contact.relationship}</CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">Primary Phone</p>
                    </div>
                    <p className="ml-6">{contact.primaryPhone}</p>
                  </div>

                  {contact.alternatePhone && (
                    <div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">Alternate Phone</p>
                      </div>
                      <p className="ml-6">{contact.alternatePhone}</p>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">Email</p>
                    </div>
                    <p className="ml-6">{contact.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Address</p>
                  <p>{contact.address}</p>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm font-medium mb-2">Permissions</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${contact.canDiscussHealth ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <p className="text-sm">
                        {contact.canDiscussHealth ? "Can" : "Cannot"} discuss health information
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          contact.canDiscussFinancial ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <p className="text-sm">
                        {contact.canDiscussFinancial ? "Can" : "Cannot"} discuss financial information
                      </p>
                    </div>
                  </div>
                </div>

                {contact.notes && (
                  <div>
                    <p className="text-sm font-medium mb-1">Notes</p>
                    <p className="text-sm">{contact.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
