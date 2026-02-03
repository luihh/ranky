import clsx from 'clsx'

export type HomeTab = 'albums' | 'global'

const TABS: { key: HomeTab; label: string }[] = [
  { key: 'albums', label: 'Albums' },
  { key: 'global', label: 'Global Ranking' }
]

export function Tabs({
  activeTab,
  setActiveTab
}: {
  activeTab: HomeTab
  setActiveTab: (tab: HomeTab) => void
}) {
  return (
    <div className="w-full flex justify-center mt-4">
      <div className="flex items-center gap-2">
        {TABS.map((tab, index) => (
          <div key={tab.key} className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(tab.key)}
              className={clsx('px-5', activeTab !== tab.key && 'opacity-60!')}
            >
              {tab.label}
            </button>

            {index < TABS.length - 1 && <span className="opacity-30 select-none">/</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
