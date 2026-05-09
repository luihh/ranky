import { useRankingStore } from '@/stores/rankingStore'

export default function Notes({ readOnly }: { albumId: number; readOnly: boolean }) {
  const notes = useRankingStore((s) => s.notes)
  const setNotes = useRankingStore((s) => s.setNotes)

  return readOnly ? (
    (notes ?? <p className="mt-2 max-w-60 leading-snug opacity-80">{notes}</p>)
  ) : (
    <textarea
      value={notes ?? ''}
      onChange={(e) => setNotes(e.target.value)}
      disabled={readOnly}
      className="w-full max-w-md rounded-lg border p-3 m-2 resize-none bg-surface disabled:opacity-50"
      rows={4}
      placeholder="Add your opinion or notes about the album..."
    />
  )
}
