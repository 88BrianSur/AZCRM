import { redirect } from "next/navigation"
import LoginForm from "@/components/auth/login-form"
import { getServerSession } from "@/lib/supabase/server"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string }
}) {
  // Check if user is already logged in
  const session = await getServerSession()

  // If logged in, redirect to dashboard
  if (session) {
    redirect(searchParams.callbackUrl || "/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold">AZ House Platform</h1>
          <p className="text-muted-foreground">Recovery Management System</p>
        </div>
        <LoginForm callbackUrl={searchParams.callbackUrl || "/dashboard"} />
      </div>
    </div>
  )
}
