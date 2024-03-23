import UserInfo from '@/components/UserInfo'
import { currentUser } from '@/lib/auth'

export default async function Server() {
  const user = await currentUser()
  return <UserInfo user={user} label="Server Compoenent" />
}
