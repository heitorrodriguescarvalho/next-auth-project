import LoginButton from '@/components/auth/LoginButton'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[480px]">
        <CardHeader>
          <CardTitle>Auth</CardTitle>
          <CardDescription>Sign In or Register</CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-[200px] items-end">
          <LoginButton mode="modal" asChild>
            <Button className="max-w-1/4">Sign In</Button>
          </LoginButton>
        </CardContent>
      </Card>
    </div>
  )
}
