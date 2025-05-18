import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">AZ House CRM</h1>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">Reset your password</h2>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
