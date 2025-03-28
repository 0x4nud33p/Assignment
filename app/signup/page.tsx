'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { SignupForm } from '@/components/auth/signup-form'
import Link from 'next/link'

export default function SignupPage() {
  const { signup } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 border rounded-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-muted-foreground">
            Enter your email and password to sign up
          </p>
        </div>
        <SignupForm onSuccess={signup} />
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline hover:text-primary">
            Login here
          </Link>
        </div>
      </div>
    </div>
  )
}