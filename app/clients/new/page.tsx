import type { Metadata } from "next"
import { ClientIntakeForm } from "@/components/clients/client-intake-form"
import { PageHeader } from "@/components/page-header"
import { requireAuth } from "@/lib/auth"

export const metadata: Metadata = {
  title: "New Client | AZ House Recovery",
  description: "Add a new client to the system",
}

export default async function NewClientPage() {
  // Ensure user is authenticated
  await requireAuth()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader title="Add New Client" description="Enter client information to create a new record" />

      <div className="bg-white p-6 rounded-lg shadow">
        <ClientIntakeForm />
      </div>
    </div>
  )
}
