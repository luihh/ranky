import { useRankingStore } from '@/stores/rankingStore'
import { authClient } from '@/lib/auth/client'

type Props = {
  rankingId: number | null
  albumData: {
    albumId: string
    title: string
    artist: string
    cover: string
  }
}

export default function UnsavedBar({ rankingId, albumData }: Props) {
  const { isDirty, getCurrentData, markSaved, reset } = useRankingStore()
  const { data: session } = authClient.useSession()

  if (!isDirty) return null

  async function handleSave() {
    if (!session) return
    const data = getCurrentData()

    const body = {
      ...albumData,
      tracks: data.tracks,
      rating: data.rating,
      notes: data.notes,
      color: data.color
    }

    const url = `${import.meta.env.VITE_BACKEND_URL}/ranking`
    const res = rankingId
      ? await fetch(`${url}/${rankingId}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
      : await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })

    if (res.ok) markSaved()
  }

  function handleReset() {
    reset()
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg/90 backdrop-blur-md px-6 py-3 flex items-center justify-between gap-4">
      <p className="text-md">You have unsaved changes</p>
      <div className="flex gap-2">
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleSave} className="bg-text! text-bg!">
          Save
        </button>
      </div>
    </div>
  )
}
