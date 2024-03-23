import { UserRole } from '@prisma/client'
import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: 'Password is required' }),
  code: z.optional(z.string()),
})

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: 'Username must have least 4 characters' })
      .max(16, { message: 'Username must have a maximum of 16 characters' }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: 'Password must have least 8 characters' }),
    passwordConfirm: z.string(),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    message: 'The passwords are different',
    path: ['passwordConfirm'],
  })

export const ResetSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
})

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must have least 8 characters' }),
    passwordConfirm: z.string(),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    message: 'The passwords are different',
    path: ['passwordConfirm'],
  })

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false
      }

      return true
    },
    {
      message: 'New password is required!',
      path: ['newPassword'],
    },
  )
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false
      }

      return true
    },
    {
      message: 'Password is required!',
      path: ['password'],
    },
  )
