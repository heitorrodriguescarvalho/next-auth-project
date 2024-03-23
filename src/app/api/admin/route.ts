import { currentUser } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await currentUser()

  if (user?.role === 'ADMIN') {
    return new NextResponse(null, { status: 200 })
  }

  return new NextResponse(null, { status: 403 })
}
