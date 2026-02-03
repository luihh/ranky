// Taken from @dnd-kit/sortable --> https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/utilities/arrayMove.ts
// Move an array item to a different position. Returns a new array with the item moved to the new position.

export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice()
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0])

  return newArray
}
