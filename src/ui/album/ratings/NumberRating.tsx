type Props = {
  value?: number
  max: 10 | 100
  onChange: (value: number) => void
}

export default function NumberRating({ value = 0, max, onChange }: Props) {
  const displayValue = max === 10 ? Math.max(1, Math.round(value / 10)) : Math.max(1, value)

  function handleChange(r: number) {
    const v = Number(r)
    if (!Number.isInteger(v)) return

    const clamped = Math.min(Math.max(v, 1), max)
    onChange(max === 10 ? clamped * 10 : clamped)
  }

  return (
    <div className="inline-flex items-baseline text-2xl font-semibold tracking-tight">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        min={1}
        max={max}
        value={displayValue}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="text-right outline-none"
        style={{ width: `calc(${String(displayValue).length}ch)` }}
      />
      <span className="opacity-60">/{max}</span>
    </div>
  )
}
