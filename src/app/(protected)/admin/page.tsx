'use client'

import { admin } from '@/actions/admin'
import FormSuccess from '@/components/FormSuccess'
import RoleGate from '@/components/auth/RoleGate'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserRole } from '@prisma/client'
import { toast } from 'sonner'

export default function Admin() {
  const date = new Date()
  const description = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

  const handleAPIRoute = () => {
    fetch('/api/admin').then((response) => {
      if (response.ok) {
        toast.success('Allowed API Route!', {
          description,
        })
      } else {
        toast.error('Forbidden API Route!', {
          description,
        })
      }
    })
  }

  const handleServerAction = () => {
    admin().then((response) => {
      if (response.success) {
        toast.success('Allowed Server Action!', {
          description,
        })
      }

      if (response.error) {
        toast.error('Forbidden Server Action!', {
          description,
        })
      }
    })
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Admin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content" />
        </RoleGate>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Route</p>
          <Button onClick={handleAPIRoute}>Click to Test</Button>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={handleServerAction}>Click to Test</Button>
        </div>
      </CardContent>
    </Card>
  )
}
