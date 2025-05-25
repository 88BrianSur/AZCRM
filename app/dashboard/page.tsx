import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  // Check if user is logged in
  const session = await getServerSession()

  // If not logged in, redirect to login
  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Welcome to your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">You are successfully logged in!</p>
          <p className="mb-4">User ID: {session.user.id}</p>
          <p className="mb-4">Email: {session.user.email}</p>

          <div className="mt-6">
            <Button asChild>
              <a href="/clients">View Clients</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
