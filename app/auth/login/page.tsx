"use client"

import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">AZ House CRM</h1>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access the client management dashboard</p>
        </div>

        <LoginForm callbackUrl="/dashboard" />

        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Open browser console (F12) to view detailed login information</p>
        </div>
      </div>
    </div>
  )
}
