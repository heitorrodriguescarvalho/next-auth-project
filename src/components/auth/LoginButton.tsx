'use client'

import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import LoginForm from './LoginForm'

interface LoginButtonProps {
  children: React.ReactNode
  mode?: 'modal' | 'redirect'
  asChild?: boolean
}

export default function LoginButton({
  children,
  mode = 'redirect',
  asChild,
}: LoginButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push('/auth/login')
  }

  if (mode === 'modal') {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="w-auto border-none bg-transparent p-0">
          <LoginForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <span onClick={handleClick} className="cursor-pointer">
      {children}
    </span>
  )
}
