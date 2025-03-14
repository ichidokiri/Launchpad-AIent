interface DividerProps {
  className?: string
}

export function Divider({ className }: DividerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-1/4 h-[1px] bg-black/20 dark:bg-white/20" />
      <span className="mx-4 text-xs text-black/70 dark:text-white/70">or</span>
      <div className="w-1/4 h-[1px] bg-black/20 dark:bg-white/20" />
    </div>
  )
}

