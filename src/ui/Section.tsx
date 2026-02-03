export default function Section({
  title,
  children
}: { title: string | null } & React.PropsWithChildren) {
  return (
    <div className="w-full h-fit max-w-xs m-4 p-4 bg-surface rounded-xl flex flex-col items-center text-center">
      <div className="w-full flex flex-col gap-2">
        {title && <h1 className="text-2xl font-semibold">{title}</h1>}
        {children}
      </div>
    </div>
  )
}
