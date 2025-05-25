import LoginForm from "@/components/auth/login-form"

interface LoginPageProps {
  searchParams: {
    callbackUrl?: string
    error?: string
  }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">AZ House Platform</h1>
          <p className="mt-2 text-gray-600">Recovery Management System</p>
        </div>

        {searchParams.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">{searchParams.error}</p>
          </div>
        )}

        <LoginForm callbackUrl={searchParams.callbackUrl || "/dashboard"} />
      </div>
    </div>
  )
}
