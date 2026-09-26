import type { Album } from '@/lib/deezer'
import { Download } from 'lucide-react'

import AlbumData from './sidebar/AlbumData'
import Notes from './sidebar/Notes'
import Rating from './sidebar/Rating'

export default function AlbumSidebar({
  album,
  downloadScreenshot,
  setCoverDialogVisible,
  onUpdate
}: {
  album: Album
  downloadScreenshot: () => void
  setCoverDialogVisible: (isVisible: boolean) => void
  onUpdate?: (patch: { title?: string; artist?: string }) => void
}) {
  return (
    <aside className="lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center items-center text-center p-6 lg:gap-0 gap-2">
      <div className="mt-auto w-full flex flex-col items-center gap-2">
        <AlbumData
          album={album}
          openCoverDialog={() => setCoverDialogVisible(true)}
          onUpdate={onUpdate}
        />
        <Rating albumId={album.id} />
        <Notes albumId={album.id} />
      </div>
      <div className="mt-auto">
        <button className="gap-2!" onClick={downloadScreenshot}>
          <Download size={20} />
          Download Ranking Image
        </button>
      </div>
    </aside>
  )
}
