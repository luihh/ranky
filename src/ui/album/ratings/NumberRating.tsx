import { useEffect, useState } from 'react'

type Props = {
  value?: number
  max: 10 | 100
  readOnly: boolean
  onChange: (value: number) => void
}

export default function NumberRating({ value = 0, max, readOnly, onChange }: Props) {
  const displayValue = max === 10 ? Math.round(value / 10) : value
  const [inputValue, setInputValue] = useState<string>(String(displayValue))

  useEffect(() => {
    setInputValue(String(displayValue))
  }, [displayValue])

  function handleChange(raw: string) {
    if (raw === '') {
      setInputValue('')
      return
    }

    const digits = raw.replace(/\D+/g, '')
    if (digits === '') return

    const num = Number(digits)
    if (!Number.isInteger(num)) return

    const clamped = Math.min(num, max)
    setInputValue(String(clamped))
  }

  function commitValue(raw: string) {
    const v = raw === '' ? 0 : Number(raw)
    onChange(max === 10 ? v * 10 : v)
  }

  return (
    <div className="inline-flex items-baseline text-2xl font-semibold tracking-tight">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        max={max}
        value={inputValue}
        disabled={readOnly}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => commitValue(inputValue)}
        className="text-right outline-none"
        style={{ width: `calc(${Math.max(1, inputValue.length)}ch)` }}
      />
      <span className="opacity-60">/{max}</span>
    </div>
  )
}
