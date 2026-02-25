import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth/client'
import { SafeStorage } from '@/lib/safeStorage'
import { AlbumCollectionSchema, type AlbumCollection } from '@/schemas/album'
import { useRouter } from '@tanstack/react-router'

const albumStore = new SafeStorage('albumRankings', AlbumCollectionSchema)

export function useImportPrompt() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [showPrompt, setShowPrompt] = useState(false)
  const [localRankings, setLocalRankings] = useState<AlbumCollection | null>(null)

  useEffect(() => {
    if (!session) return

    const local = albumStore.get()
    if (local && Object.keys(local).length > 0) {
      setLocalRankings(local)
      setShowPrompt(true)
    }
  }, [session])

  function dismiss() {
    setShowPrompt(false)
    router.history.go(0)
  }

  return { showPrompt, localRankings, dismiss }
}
