import { Activity } from 'react'
import { X } from 'lucide-react'

type Props = {
  isVisible: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Dialog({ isVisible, onClose, children }: Props) {
  return (
    <Activity mode={isVisible ? 'visible' : 'hidden'}>
      <div
        className="fixed top-0 bg-black/75 h-screen w-screen z-50 content-center overscroll-contain"
        onClick={onClose}
      >
        <div
          className="m-auto p-4 w-[90%] max-h-[90vh] bg-bg rounded-2xl overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="border-none!" onClick={onClose}>
            <X size={16} />
          </button>

          {children}
        </div>
      </div>
    </Activity>
  )
}
