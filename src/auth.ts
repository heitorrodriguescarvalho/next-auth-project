import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'

import { db } from '@/lib/db'
import authConfig from './auth.config'
import { getUserById } from './data/users'
import { UserRole } from '@prisma/client'
import { getTwoFactorConfirmationByUserId } from './data/twoFactorConfirmation'
import { getAccountByUserId } from './data/account'

declare module 'next-auth' {
  interface User {
    role: UserRole
    isTwoFactorEnabled: boolean
    isOAuth: boolean
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: UserRole
    isTwoFactorEnabled?: boolean
    isOAuth?: boolean
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true

      const existingUser = user.id ? await getUserById(user.id) : null

      if (!existingUser?.emailVerified) return false

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        )

        if (!twoFactorConfirmation) return false

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        })
      }

      return true
    },
    async session({ token, session }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }

      if (session.user && token.role) {
        session.user.role = token.role as UserRole
      }

      if (session.user && typeof token.isTwoFactorEnabled === 'boolean') {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled
      }

      if (session.user && token.name) {
        session.user.name = token.name
      }

      if (session.user && token.email) {
        session.user.email = token.email
      }

      if (session.user && typeof token.isOAuth === 'boolean') {
        session.user.isOAuth = token.isOAuth
      }

      return session
    },

    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOAuth = !!existingAccount
      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

      return token
    },
  },
  // @ts-expect-error The PrismaAdapter type don't match, but it's ok
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
})
