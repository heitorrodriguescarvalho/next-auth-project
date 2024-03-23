'use client'

import { useCallback, useEffect, useState } from 'react'
import CardWrapper from './CardWrapper'
import { useSearchParams } from 'next/navigation'
import { newVerification } from '@/actions/new-verification'
import FormSuccess from '../FormSuccess'
import FormError from '../FormError'

export default function NewVerificationForm() {
  const [success, setSuccess] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()

  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  const handleSubmit = useCallback(() => {
    if (success || error) return

    if (!token) {
      setError('Missing Token')
      return
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success)
        setError(data.error)
      })
      .catch(() => {
        setError('Something went wrong!')
      })
  }, [token, success, error])

  useEffect(() => {
    handleSubmit()
  }, [handleSubmit])

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full flex-col items-center justify-center">
        {!success && !error && 'Loading...'}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  )
}
