import { useRouter } from '@tanstack/react-router'
import { Trash, Save, ArchiveRestore } from 'lucide-react'

import Section from '@/ui/Section'

export default function DataSection() {
  const router = useRouter()

  function resetData() {
    const confirmation = confirm(
      'Do you really want to reset you data? This will delete all your album rankings, global theme and settings.'
    )
    if (!confirmation) return

    localStorage.clear()
    router.history.go(0)
  }

  function exportData() {
    const data = { ...localStorage }
    if (!data) return

    const json = JSON.stringify(data)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'Ranky Backup.json'
    a.click()

    URL.revokeObjectURL(url)
    a.remove()
  }

  function importData() {
    const input = document.createElement('input')
    input.style.display = 'none'
    input.type = 'file'
    input.accept = '.json'

    input.addEventListener('change', async () => {
      const file = input.files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        localStorage.clear()

        for (const key in data) {
          localStorage.setItem(key, data[key])
        }

        router.history.go(0)
      } catch (error: any) {
        alert('Failed to import file: ' + error.message)
      }

      input.remove()
    })

    input.click()
  }

  return (
    <Section title="Data & Backup">
      <button onClick={resetData} className="gap-2!">
        <Trash size={20} /> Reset all data
      </button>

      <button onClick={exportData} className="gap-2!">
        <Save size={20} /> Export Backup
      </button>

      <button onClick={importData} className="gap-2!">
        <ArchiveRestore size={20} /> Import Backup
      </button>
    </Section>
  )
}
