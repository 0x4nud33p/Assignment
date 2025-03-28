// src/app/page.tsx
'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Welcome to the Dashboard Intern Assignment
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A fullstack dashboard application with Google Sheets integration, 
          real-time updates, and secure authentication.
        </p>

        <div className="flex gap-4 justify-center">
          <Button asChild variant="default" size="lg">
            <Link href="/login">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signup">Create Account</Link>
          </Button>
        </div>

        <div className="mt-8 border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">🔒 Secure Authentication</h3>
              <p className="text-sm text-muted-foreground">
                JWT-based login/signup with protected routes
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">📊 Real-time Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Google Sheets integration with live updates
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">✨ Dynamic Columns</h3>
              <p className="text-sm text-muted-foreground">
                Add custom columns with different data types
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}