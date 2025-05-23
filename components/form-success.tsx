import { CheckCircle2 } from "lucide-react"

interface FormSuccessProps {
  message?: string
}

export function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null

  return (
    <div className="flex items-center gap-x-2 text-sm text-emerald-500 mt-1 animate-fadeIn">
      <CheckCircle2 className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}
