import useAlbumMeta from '@/hooks/useAlbumMeta'

export default function Notes({ albumId }: { albumId: number }) {
  const { meta, setNotes } = useAlbumMeta(albumId)

  return (
    <textarea
      value={meta.notes}
      onChange={(e) => {
        setNotes(e.target.value)
      }}
      className="w-full max-w-md rounded-lg border p-3 m-2 resize-none bg-surface"
      rows={4}
      placeholder="Add your opinion or notes about the album..."
    />
  )
}
