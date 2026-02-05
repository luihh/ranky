import { useState } from 'react'

type Props = {
  value?: number
  max: 10 | 100
  onChange: (value: number) => void
}

export default function NumberRating({ value = 0, max, onChange }: Props) {
  const displayValue = max === 10 ? Math.round(value / 10) : value
  const [inputValue, setInputValue] = useState<string>(String(displayValue))

  function handleChange(raw: string) {
    if (raw === '') {
      setInputValue('')
      return
    }

    const digits = raw.replace(/\D+/g, '')
    if (digits === '') return

    const num = Number(digits)
    if (!Number.isInteger(num)) return

    if (num > max) {
      setInputValue(String(max))
      return
    }

    setInputValue(digits)
  }

  function commitValue(raw: string) {
    let v: number = raw === '' ? 0 : Number(raw)
    if (!Number.isInteger(v)) return

    const clamped = Math.min(Math.max(v, 0), max)
    onChange(max === 10 ? clamped * 10 : clamped)
  }

  return (
    <div className="inline-flex items-baseline text-2xl font-semibold tracking-tight">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        max={max}
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => commitValue(inputValue)}
        className="text-right outline-none"
        style={{ width: `calc(${Math.max(1, inputValue.length)}ch)` }}
      />
      <span className="opacity-60">/{max}</span>
    </div>
  )
}
