'use client'

import { logout } from '@/actions/logout'

interface LogoutButtonProps {
  children?: React.ReactNode
}

export default function LogoutButton({ children }: LogoutButtonProps) {
  const handleClick = () => {
    logout()
  }

  return (
    <span onClick={handleClick} className="cursor-pointer">
      {children}
    </span>
  )
}
