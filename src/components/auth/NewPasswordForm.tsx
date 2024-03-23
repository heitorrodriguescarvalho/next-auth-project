'use client'

import * as z from 'zod'
import { NewPasswordSchema } from '@/schemas'
import CardWrapper from './CardWrapper'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import FormError from '../FormError'
import { newPassword } from '@/actions/new-password'
import { useState, useTransition } from 'react'
import FormSuccess from '../FormSuccess'

export default function NewPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  })

  const handleSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError('')

    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error)
        setSuccess(data?.success)
      })
    })
  }

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Your new password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Confirm your new Password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" disabled={isPending} className="w-full">
            Reset Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
