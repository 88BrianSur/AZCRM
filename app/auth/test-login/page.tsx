"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function TestLoginPage() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("password")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    console.log("Test login with:", email)

    // Simulate authentication delay
    setTimeout(() => {
      console.log("Test login successful")

      // Set a mock token in localStorage
      localStorage.setItem("sb-access-token", "test-token-" + Date.now())

      // Redirect to dashboard
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">AZ House CRM</h1>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">Test Login</h2>
          <p className="mt-2 text-sm text-gray-600">This page bypasses actual authentication</p>
        </div>

        <Card className="w-full mt-8 border-2 border-yellow-300">
          <CardHeader className="bg-yellow-50">
            <CardTitle className="text-2xl font-bold">Test Mode</CardTitle>
            <CardDescription>This form uses mock authentication for testing purposes</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                  </>
                ) : (
                  "Test Sign In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              This login bypasses actual authentication and sets a mock token
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
