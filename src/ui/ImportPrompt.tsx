import { SafeStorage } from '@/lib/safeStorage'
import { AlbumCollectionSchema } from '@/schemas/album'
import { importRankingsToAccount } from '@/utils/importRankings'
import { useState } from 'react'

const albumStore = new SafeStorage('albumRankings', AlbumCollectionSchema)

interface Props {
  localRankings: NonNullable<ReturnType<typeof albumStore.get>>
  onDismiss: () => void
}

export function ImportPrompt({ localRankings, onDismiss }: Props) {
  const count = Object.keys(localRankings).length
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleImport() {
    setLoading(true)
    const { failed } = await importRankingsToAccount(localRankings)
    if (failed === 0) {
      albumStore.remove()
    }
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="fixed top-0 bg-black/75 h-screen w-screen z-50 content-center">
        <div className="flex flex-col gap-4 m-auto p-4 max-w-sm max-h-[90vh] bg-bg rounded-2xl overflow-y-auto">
          <h2 className="text-lg font-semibold">Import complete!</h2>
          <p className="text-sm">Your rankings have been saved to your account.</p>
          <button onClick={onDismiss}>Close</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-0 bg-black/75 h-screen w-screen z-50 content-center">
      <div className="flex flex-col gap-4 m-auto p-4 max-w-sm max-h-[90vh] bg-bg rounded-2xl overflow-y-auto">
        <h2 className="text-lg font-semibold">Import your rankings</h2>
        <p className="text-sm">
          You have <strong>{count}</strong> ranking{count !== 1 ? 's' : ''} saved locally. Do you
          want to upload them to your account?
        </p>
        <div className="flex gap-2">
          <button onClick={onDismiss} className="w-full! bg-red-600! hover:bg-red-400!">
            Not now
          </button>
          <button
            onClick={handleImport}
            disabled={loading}
            className="w-full! bg-blue-600! hover:bg-blue-400! disabled:opacity-50!"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  )
}
