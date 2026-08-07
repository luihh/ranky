export type Slot = {
  id: number | 'placeholder'
  title: string
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
