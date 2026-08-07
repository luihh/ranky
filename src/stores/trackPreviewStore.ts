import { create } from 'zustand'

type PreviewState = {
  playingId: number | null
  openId: number | null
  setPlayingId: (id: number | null) => void
  setOpenId: (id: number | null) => void
}

export const useTrackPreviewStore = create<PreviewState>((set) => ({
  playingId: null,
  openId: null,
  setPlayingId: (id) => set({ playingId: id }),
  setOpenId: (id) => set({ openId: id })
}))
