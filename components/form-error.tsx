import { AlertCircle } from "lucide-react"

interface FormErrorProps {
  message?: string
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null

  return (
    <div className="flex items-center gap-x-2 text-sm text-destructive mt-1 animate-fadeIn">
      <AlertCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}
