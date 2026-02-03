export type Slot = Omit<Track, 'id'> & {
  id: Track['id'] | 'placeholder'
}

export type Container = {
  id: string
  title: string
  items: Slot[]
}

export type Item = {
  containerId: Container['id']
  index: number
}
