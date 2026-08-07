import { useMemo, useRef, useState } from 'react'
import { useAlbumRankingStore } from '@/stores/albumRankingStore'

import type { Album } from '@/lib/deezer'

import Dialog from '@/ui/Dialog'

type Track = Album['tracks'][number]
type CompareResult = -1 | 0 | 1

type Props = {
  album: Album
  isVisible: boolean
  setIsVisible: (v: boolean) => void
}

function* mergeSort<T>(items: T[]): Generator<[T, T], T[], CompareResult> {
  if (items.length <= 1) return items

  const mid = Math.floor(items.length / 2)
  const left = yield* mergeSort(items.slice(0, mid))
  const right = yield* mergeSort(items.slice(mid))

  const merged: T[] = []
  let i = 0
  let j = 0

  while (i < left.length && j < right.length) {
    const result = yield [left[i], right[j]]
    if (result <= 0) merged.push(left[i++])
    else merged.push(right[j++])
  }

  return [...merged, ...left.slice(i), ...right.slice(j)]
}

export default function SmartRankDialog({ album, isVisible, setIsVisible }: Props) {
  const generatorRef = useRef<Generator<[Track, Track], Track[], CompareResult> | null>(null)
  const [pair, setPair] = useState<[Track, Track] | null>(null)
  const [ranking, setRanking] = useState<Track[] | null>(null)
  const [comparisonCount, setComparisonCount] = useState(0)
  const applyRanking = useAlbumRankingStore((s) => s.applyRanking)

  const estimatedComparisons = useMemo(() => {
    const n = album.tracks.length
    if (n <= 1) return 1
    const levels = Math.ceil(Math.log2(n))
    return n * levels - Math.pow(2, levels) + 1
  }, [album.tracks.length])

  function advance(step: IteratorResult<[Track, Track], Track[]>) {
    if (step.done) {
      setRanking(step.value)
      setPair(null)
    } else {
      setPair(step.value)
    }
  }

  function start() {
    setRanking(null)
    setComparisonCount(0)
    const gen = mergeSort(album.tracks)
    generatorRef.current = gen
    advance(gen.next())
  }

  function choose(result: CompareResult) {
    const gen = generatorRef.current
    if (!gen) return
    setComparisonCount((c) => c + 1)
    advance(gen.next(result))
  }

  function reset() {
    generatorRef.current = null
    setPair(null)
    setRanking(null)
    setComparisonCount(0)
  }

  function close() {
    reset()
    setIsVisible(false)
  }

  return (
    <Dialog isVisible={isVisible} onClose={close}>
      <div className="flex flex-col justify-center items-center gap-4 m-4">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-3xl font-bold">Smart Ranking</h1>

          {!pair && !ranking && (
            <>
              <p className="text-center text-sm opacity-70">
                Pick your favorite between two tracks at a time and Ranky will build the full
                ranking for you.
              </p>
              <button className="self-center! my-2! py-2!" onClick={start}>
                Start Comparing
              </button>
            </>
          )}

          {pair && (
            <p className="text-center text-sm opacity-70">
              Comparison {comparisonCount + 1} of ~{estimatedComparisons}
            </p>
          )}
        </div>

        {pair && (
          <div className="w-full flex flex-col gap-4">
            <div className="relative flex flex-col sm:flex-row gap-3 w-full items-stretch">
              <button
                className="flex-1! text-center! py-8! text-2xl! whitespace-normal! leading-snug!"
                onClick={() => choose(-1)}
              >
                {pair[0].title}
              </button>

              <div className="flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-bg border text-xs font-bold pointer-events-none select-none">
                VS
              </div>

              <button
                className="flex-1! text-center! py-8! text-2xl! whitespace-normal! leading-snug!"
                onClick={() => choose(1)}
              >
                {pair[1].title}
              </button>
            </div>
            <button className="text-sm! opacity-70! self-center!" onClick={() => choose(0)}>
              No preference
            </button>
          </div>
        )}

        {ranking && (
          <div className="w-full flex flex-col gap-4 max-w-xl">
            <ol className="w-full flex flex-col gap-2">
              {ranking.map((track, i) => (
                <li key={track.id} className="flex flex-row">
                  <span className="size-12 bg-surface min-w-12 flex justify-center items-center text-xl font-bold border rounded-l-xl">
                    {i + 1}
                  </span>
                  <div className="h-12 bg-surface border rounded-r-xl w-[calc(100%-var(--spacing)*12)]!">
                    <div className="size-full bg-surface rounded-r-xl flex justify-center items-center text-center md:pr-12">
                      <span className="px-4 truncate select-none">{track.title}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="flex gap-2 justify-center">
              <button onClick={start}>Redo</button>
              <button
                className="bg-text! text-bg! hover:bg-text/75!"
                onClick={() => {
                  applyRanking(ranking)
                  close()
                }}
              >
                Apply Ranking
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  )
}
