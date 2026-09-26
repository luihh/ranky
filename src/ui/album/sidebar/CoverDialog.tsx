import type { Album } from '@/lib/deezer'

import { useEffect, useState } from 'react'
import { updateCustomAlbumInfo } from '@/utils/customAlbum'
import Dialog from '@/ui/Dialog'

type Props = {
  album: Album
  isVisible: boolean
  setIsVisible: (v: boolean) => void
  onUpdate?: (patch: { cover: string }) => void
}

type CheckState = 'idle' | 'checking' | 'error'

function testImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

export default function CoverDialog({ album, isVisible, setIsVisible, onUpdate }: Props) {
  const [draft, setDraft] = useState(album.cover)
  const [checkState, setCheckState] = useState<CheckState>('idle')

  useEffect(() => {
    if (isVisible) {
      setDraft(album.cover)
      setCheckState('idle')
    }
  }, [isVisible, album.cover])

  function handleDraftChange(value: string) {
    setDraft(value)
    if (checkState === 'error') setCheckState('idle')
  }

  async function save() {
    const trimmed = draft.trim()
    if (!trimmed) {
      updateCustomAlbumInfo(album.id, { cover: '' })
      onUpdate?.({ cover: '' })
      setIsVisible(false)
      return
    }

    setCheckState('checking')
    const ok = await testImage(trimmed)

    if (!ok) {
      setCheckState('error')
      return
    }

    updateCustomAlbumInfo(album.id, { cover: trimmed })
    onUpdate?.({ cover: trimmed })
    setIsVisible(false)
  }

  return (
    <Dialog isVisible={isVisible} onClose={() => setIsVisible(false)}>
      <div className="flex flex-col gap-4 p-2 justify-center items-center text-center">
        <h1 className="text-3xl font-bold">Cover image URL</h1>
        <input
          value={draft}
          onChange={(e) => handleDraftChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          placeholder="https://..."
          autoFocus
          className="w-full rounded-lg border px-4 py-2 bg-surface text-sm select-none"
        />

        {checkState === 'error' && (
          <p className="text-center text-sm opacity-70">
            That image provider can't be loaded here, please try a different URL.
            <br />
            We recommend using{' '}
            <a href="http://last.fm/" target="_blank" className="underline">
              Last.fm
            </a>
            !
          </p>
        )}

        {checkState !== 'error' && draft.trim() && (
          <img
            src={draft.trim()}
            alt="Cover preview"
            className="size-32 mx-auto rounded-xl object-cover"
          />
        )}

        <button onClick={save} disabled={checkState === 'checking'} className="self-center! px-6!">
          {checkState === 'checking' ? 'Checking...' : 'Save'}
        </button>
      </div>
    </Dialog>
  )
}
