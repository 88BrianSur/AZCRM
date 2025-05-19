import LoginForm from "@/components/auth/login-form"

export default function DebugLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Debug Login Page</h1>
          <p className="mt-2 text-gray-600">This page bypasses middleware checks for testing purposes</p>
        </div>

        <LoginForm callbackUrl="/dashboard" />

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This is a temporary debug page.</p>
          <p>Use it to test login functionality without middleware interference.</p>
        </div>
      </div>
    </div>
  )
}
