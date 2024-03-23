'use server'

import { signIn } from '@/auth'
import { LoginSchema } from '@/schemas'
import * as z from 'zod'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import { getUserByEmail } from '@/data/users'
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/data/mail'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { db } from '@/lib/db'
import { getTwoFactorConfirmationByUserId } from '@/data/twoFactorConfirmation'

export async function login(
  values: z.infer<typeof LoginSchema>,
  callbackUrl: string | null,
) {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password, code } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist!' }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    )

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    )

    return { success: 'Verification email sent!' }
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorCode = await getTwoFactorTokenByEmail(existingUser.email)

      if (!twoFactorCode || twoFactorCode.token !== code) {
        return { error: 'Invalid code!' }
      }

      const hasExpires = new Date(twoFactorCode.expires) < new Date()

      if (hasExpires) {
        return { error: 'Code expired!' }
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorCode.id },
      })

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id,
      )

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)

      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)

      return { twoFactor: true }
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password!' }
        default:
          return { error: 'Something went wrong! ' }
      }
    }

    throw error
  }
}
