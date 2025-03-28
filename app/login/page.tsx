'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  const { login } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 border rounded-lg">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <LoginForm onSuccess={login} />
      </div>
    </div>
  )
}