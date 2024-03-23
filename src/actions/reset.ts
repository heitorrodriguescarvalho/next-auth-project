'use server'

import { sendPasswordResetEmail } from '@/data/mail'
import { getUserByEmail } from '@/data/users'
import { generatePasswordResetToken } from '@/lib/tokens'
import { ResetSchema } from '@/schemas'
import * as z from 'zod'

export async function reset(values: z.infer<typeof ResetSchema>) {
  const validatedFields = ResetSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid email!' }
  }

  const { email } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser) {
    return { error: 'Email not found!' }
  }

  const passwordResetToken = await generatePasswordResetToken(email)
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  )

  return { success: 'Reset email sent!' }
}
