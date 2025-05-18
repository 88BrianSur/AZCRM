"use client"

import { useEffect, useRef, type ReactNode, type FormEvent } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface FormWrapperProps {
  children: ReactNode
  onSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>
  successMessage?: string
  errorMessage?: string
  redirectPath?: string
  className?: string
}

export function FormWrapper({
  children,
  onSubmit,
  successMessage = "Operation completed successfully",
  errorMessage = "An error occurred. Please try again.",
  redirectPath,
  className,
}: FormWrapperProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Auto-focus the first input field
  useEffect(() => {
    if (formRef.current) {
      const firstInput = formRef.current.querySelector(
        'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled])',
      ) as HTMLElement

      if (firstInput) {
        firstInput.focus()
      }
    }
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await onSubmit(e)

      toast({
        title: "Success",
        description: successMessage,
        variant: "success",
      })

      if (redirectPath) {
        router.push(redirectPath)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      console.error(error)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  )
}
