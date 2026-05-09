import clsx from 'clsx'

type Props = {
  value?: number
  readOnly: boolean
  onChange: (value: number) => void
}

export default function StarRating({ value = 0, readOnly, onChange }: Props) {
  const stars = Math.round(value / 20)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const active = i <= stars

        return (
          <a
            key={i}
            onClick={() => onChange(i === stars ? 0 : i * 20)}
            aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
            className={clsx(
              'p-0 m-0 bg-transparent border-none text-2xl leading-none select-none',
              active || 'opacity-50!',
              readOnly || 'cursor-pointer hover:text-yellow-300! hover:opacity-100!'
            )}
          >
            ★
          </a>
        )
      })}
    </div>
  )
}
