import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import LoginForm from "@/components/auth/login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string }
}) {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is already logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">AZ House CRM</h1>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access the client management dashboard</p>
        </div>
        <LoginForm callbackUrl={searchParams.callbackUrl || "/dashboard"} />
      </div>
    </div>
  )
}
