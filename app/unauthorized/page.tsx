import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center">
          <Shield className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Access Denied</h1>
        <p className="mt-2 text-lg text-gray-600">You do not have permission to access this page.</p>
        <p className="mt-1 text-sm text-gray-500">Please contact an administrator if you believe this is an error.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/login">Sign in with a different account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
