import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import CardWrapper from './CardWrapper'

export default function ErrorCard() {
  return (
    <CardWrapper
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      headerLabel="Oops! Something went wrong!"
    >
      <div className="flex w-full items-center justify-center">
        <ExclamationTriangleIcon />
      </div>
    </CardWrapper>
  )
}
