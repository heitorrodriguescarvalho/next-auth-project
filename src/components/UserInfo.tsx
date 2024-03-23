import { UserRole } from '@prisma/client'
import { DefaultSession } from 'next-auth'
import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'

interface UserInfoProps {
  user?: DefaultSession['user'] & {
    role: UserRole
  }
  label: string
}

export default function UserInfo({ user, label }: UserInfoProps) {
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-center text-2xl font-semibold">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Info label="ID" content={user?.id} />
        <Info label="Name" content={user?.name} />
        <Info label="Email" content={user?.email} />
        <Info label="Role" content={user?.role} />
        <div className="flex items-center justify-between rounded-lg p-3 shadow-sm">
          <p className="text-sm font-medium">Two Factor Authentication</p>
          <Badge variant={user?.isTwoFactorEnabled ? 'success' : 'destructive'}>
            {user?.isTwoFactorEnabled ? 'On' : 'Off'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

interface InfoProps {
  label: string
  content?: string | null
}

function Info({ label, content }: InfoProps) {
  return (
    <div className="flex items-center justify-between rounded-lg p-3 shadow-sm">
      <p className="text-sm font-medium">{label}</p>
      <p className="max-w-[180px] truncate rounded-md bg-slate-100 p-1 font-mono text-xs">
        {content}
      </p>
    </div>
  )
}
