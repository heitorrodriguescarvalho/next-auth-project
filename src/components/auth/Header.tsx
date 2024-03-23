export default function Header({ label }: { label: string }) {
  return (
    <div className="gap-4-y justifyy-center flex w-full flex-col items-center">
      <h1 className="text-3xl font-semibold">Auth</h1>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
