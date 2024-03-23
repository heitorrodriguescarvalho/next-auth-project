'use client'

import { signIn } from 'next-auth/react'
import Github from '../icons/Github'
import Google from '../icons/Google'
import { Button } from '../ui/button'
import { useSearchParams } from 'next/navigation'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export default function Social() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  const handleClick = (provider: 'google' | 'github') =>
    signIn(provider, { callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT })

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => handleClick('google')}
      >
        <Google width={20} height={20} />
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => handleClick('github')}
      >
        <Github width={20} height={20} />
      </Button>
    </div>
  )
}
