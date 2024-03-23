import Navbar from './_components/Navbar'

interface ProtecetedLayoutProps {
  children: React.ReactNode
}

export default function ProtectedLayout({ children }: ProtecetedLayoutProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-10">
      <Navbar />
      {children}
    </div>
  )
}
