'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { SheetTable } from '@/components/dashboard/sheet-table'
import { Button } from '@/components/ui/button'
import { CreateTableDialog } from '@/components/dashboard/create-table-dialog'

export default function DashboardPage() {
  // const { user, logout } = useAuth()

  // if (!user) return null

  return (
    <div className="min-h-screen p-8">
      {/* <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
        <Button onClick={logout}>Logout</Button>
      </div> */}
      
      <div className="space-y-4">
        <CreateTableDialog />
        <SheetTable />
      </div>
    </div>
  )
}