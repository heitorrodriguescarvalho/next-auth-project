'use server'

import { currentUser } from '@/lib/auth'

export async function admin() {
  const user = await currentUser()

  if (user?.role === 'ADMIN') {
    return { success: 'Allowed!' }
  }

  return { error: 'Forbidden' }
}
