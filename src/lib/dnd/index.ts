import type { Container, Item, Slot } from './types'
import { arrayMove } from '@/utils/arrayMove'

export const createPlaceholder = (): Slot => {
  return {
    id: 'placeholder',
    title: ''
  }
}

export function findNearestPlaceholder(items: Slot[], start: number): number | null {
  for (let i = start + 1; i < items.length; i++) {
    if (items[i].id === 'placeholder') return i
  }

  for (let i = start - 1; i >= 0; i--) {
    if (items[i].id === 'placeholder') return i
  }

  return null
}

export function moveItem(containers: Container[], source: Item, target: Item) {
  const next = structuredClone(containers)

  const from = next.find((c) => c.id === source.containerId)!
  const to = next.find((c) => c.id === target.containerId)!

  if (source.containerId === target.containerId && source.index === target.index) {
    return containers
  }

  const sourceItem = from.items[source.index]
  const targetItem = to.items[target.index]

  if (source.containerId === target.containerId) {
    if (targetItem.id === 'placeholder') {
      from.items[source.index] = createPlaceholder()
      to.items[target.index] = sourceItem

      return next
    }

    from.items = arrayMove(from.items, source.index, target.index)
    return next
  }

  from.items[source.index] = createPlaceholder()

  if (targetItem.id === 'placeholder') {
    to.items[target.index] = sourceItem
    return next
  }

  const placeholderIndex = findNearestPlaceholder(to.items, target.index)

  if (placeholderIndex === null) {
    return containers
  }

  if (placeholderIndex > target.index) {
    for (let i = placeholderIndex; i > target.index; i--) {
      to.items[i] = to.items[i - 1]
    }
    to.items[target.index] = sourceItem
    return next
  }

  for (let i = placeholderIndex; i < target.index; i++) {
    to.items[i] = to.items[i + 1]
  }
  to.items[target.index] = sourceItem

  return next
}

export type { Container, Item, Slot }
