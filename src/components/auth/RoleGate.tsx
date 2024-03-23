'use client'

import { useCurrentUser } from '@/hooks/useCurrentUser'
import { UserRole } from '@prisma/client'
import FormError from '../FormError'

interface RoleGateProps {
  children: React.ReactNode
  allowedRole: UserRole
}

export default function RoleGate({ children, allowedRole }: RoleGateProps) {
  const user = useCurrentUser()

  if (user?.role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content" />
    )
  }

  return children
}
