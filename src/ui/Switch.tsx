type Props = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export default function Switch({ label, checked, onChange, disabled, className = '' }: Props) {
  return (
    <label className={`flex items-center justify-between gap-2 text-left select-none ${className}`}>
      <span className="text-sm font-medium opacity-80">{label}</span>

      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
          disabled={disabled}
        />

        {/* Track */}
        <div className="h-6 w-11 rounded-full bg-border transition peer-checked:bg-text cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-25" />

        {/* Knob */}
        <div
          className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-bg shadow transition
      peer-checked:translate-x-5 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        />
      </div>
    </label>
  )
}
