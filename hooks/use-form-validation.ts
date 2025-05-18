"use client"

import type React from "react"

import { useState, useCallback } from "react"

interface ValidationRules {
  [key: string]: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    validate?: (value: any) => boolean | string
  }
}

interface FormErrors {
  [key: string]: string
}

export function useFormValidation(rules: ValidationRules) {
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = useCallback(
    (name: string, value: any) => {
      if (!rules[name]) return ""

      const fieldRules = rules[name]

      if (fieldRules.required && (!value || (typeof value === "string" && !value.trim()))) {
        return "This field is required"
      }

      if (fieldRules.minLength && typeof value === "string" && value.length < fieldRules.minLength) {
        return `Must be at least ${fieldRules.minLength} characters`
      }

      if (fieldRules.maxLength && typeof value === "string" && value.length > fieldRules.maxLength) {
        return `Cannot exceed ${fieldRules.maxLength} characters`
      }

      if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
        return "Invalid format"
      }

      if (fieldRules.validate) {
        const result = fieldRules.validate(value)
        if (typeof result === "string") return result
        if (result === false) return "Invalid value"
      }

      return ""
    },
    [rules],
  )

  const validateForm = useCallback(
    (values: Record<string, any>) => {
      const newErrors: FormErrors = {}
      let isValid = true

      Object.keys(rules).forEach((name) => {
        const error = validateField(name, values[name])
        if (error) {
          newErrors[name] = error
          isValid = false
        }
      })

      setErrors(newErrors)
      return isValid
    },
    [rules, validateField],
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setTouched((prev) => ({ ...prev, [name]: true }))

      const error = validateField(name, value)
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    },
    [validateField],
  )

  const getFieldProps = useCallback(
    (name: string) => ({
      onBlur: handleBlur,
      "aria-invalid": !!errors[name],
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
    }),
    [errors, handleBlur],
  )

  const getFieldError = useCallback(
    (name: string) => {
      return touched[name] ? errors[name] : undefined
    },
    [errors, touched],
  )

  const resetForm = useCallback(() => {
    setErrors({})
    setTouched({})
  }, [])

  return {
    errors,
    validateForm,
    validateField,
    handleBlur,
    getFieldProps,
    getFieldError,
    resetForm,
    setTouched,
  }
}
