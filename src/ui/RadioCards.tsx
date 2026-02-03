export type RadioOption<T> = {
  value: T
  label: string
  description?: string
}

type Props<T> = {
  name: string
  value: T
  options: RadioOption<T>[]
  onChange: (value: T) => void
}

export default function RadioCards<T>({ name, value, options, onChange }: Props<T>) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => {
        const checked = value === opt.value

        return (
          <label
            key={String(opt.value)}
            className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition bg-surface hover:bg-border"
          >
            <input
              type="radio"
              name={name}
              checked={checked}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />

            <span className="mt-1 size-4 rounded-full border flex items-center justify-center">
              {checked && <span className="size-2 rounded-full bg-text" />}
            </span>

            <div className="flex flex-col text-left">
              <span className="font-semibold">{opt.label}</span>
              <span className="text-sm opacity-70">{opt.description}</span>
            </div>
          </label>
        )
      })}
    </div>
  )
}
