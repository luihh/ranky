import type { Album } from '@/lib/deezer'
import { type AlbumCollection, AlbumCollectionSchema } from '@/schemas/album'
import { useRouter } from '@tanstack/react-router'
import { SafeStorage } from '@/lib/safeStorage'
import { Trash, Save, ArchiveRestore } from 'lucide-react'

import Section from '@/ui/Section'

export default function DataSection({ album }: { album: Album }) {
  const router = useRouter()
  const albumStore = new SafeStorage<AlbumCollection>('albumRankings', AlbumCollectionSchema)

  function deleteRanking() {
    const confirmation = confirm(
      'Do you really want to delete this ranking? This will delete all the ranking, rating, notes and settings.'
    )
    if (!confirmation) return

    albumStore.update((prev) => {
      if (!prev) return {}

      const { [album.id]: _, ...rest } = prev
      return rest
    })

    router.history.go(0)
  }

  function backupRanking() {
    const data = albumStore.get()?.[album.id]
    if (!data) return

    const json = JSON.stringify(data)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${album.title} - ${album.artist.name} ranking backup.json`
    a.click()

    URL.revokeObjectURL(url)
    a.remove()
  }

  function restoreBackup() {
    const input = document.createElement('input')
    input.style.display = 'none'
    input.type = 'file'
    input.accept = '.json'

    input.addEventListener('change', async () => {
      const file = input.files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        albumStore.update((prev) => {
          const collection = prev ?? {}

          return {
            ...collection,
            [album.id]: data
          }
        })

        router.history.go(0)
      } catch (error: any) {
        alert('Failed to import file: ' + error.message)
      }

      input.remove()
    })

    input.click()
  }

  return (
    <Section title="Data & Backup">
      <button onClick={deleteRanking} className="gap-2!">
        <Trash size={20} /> Delete Ranking
      </button>

      <button onClick={backupRanking} className="gap-2!">
        <Save size={20} /> Backup Ranking
      </button>

      <button onClick={restoreBackup} className="gap-2!">
        <ArchiveRestore size={20} /> Restore Ranking
      </button>
    </Section>
  )
}
