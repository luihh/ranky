import clsx from 'clsx'

type Props = {
  value?: number
  onChange: (value: number) => void
}

export default function StarRating({ value = 0, onChange }: Props) {
  const stars = Math.round(value / 20)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const active = i <= stars

        return (
          <button
            key={i}
            onClick={() => onChange(i * 20)}
            aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
            className={clsx(
              'p-0! m-0! bg-transparent! border-none! text-2xl! leading-none! hover:scale-110! active:scale-95! hover:text-yellow-300! hover:opacity-100!',
              active || 'opacity-50!'
            )}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}
