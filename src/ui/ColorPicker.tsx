import { HexColorInput, HexColorPicker } from 'react-colorful'

export default function ColorPicker({
  color,
  onChange,
  reset
}: {
  color: string
  onChange: (color: string) => void
  reset: () => void
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <HexColorPicker color={color} onChange={onChange} className="w-full! rounded-xl" />
      <div className="flex flex-row gap-2">
        <HexColorInput
          color={color}
          onChange={onChange}
          prefixed
          className="
            text-center w-full py-1 rounded-lg border border-border bg-surface uppercase focus:outline-none focus:ring-2 focus:ring-border
          "
        />
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
