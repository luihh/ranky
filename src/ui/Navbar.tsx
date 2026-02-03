import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { SiDiscord } from '@icons-pack/react-simple-icons'

export default function Navbar() {
  return (
    <nav className="flex flex-col gap-3 py-4 px-8 bg-surface md:flex-row md:items-center md:justify-between">
      <div className="flex items-center justify-between w-full md:w-auto">
        <Link to="/" className="text-2xl font-bold no-underline whitespace-nowrap">
          Ranky :)
        </Link>

        <div className="flex flex-row gap-3">
          <a href="https://discord.gg/g5gZymxEyR" className="md:hidden" draggable={false}>
            <button aria-label="Discord server">
              <SiDiscord size={18} />
            </button>
          </a>

          <Link to="/settings" className="md:hidden" draggable={false}>
            <button aria-label="Settings">
              <Settings size={18} />
            </button>
          </Link>
        </div>
      </div>

      <form action="/search" className="flex w-full max-w-lg mx-auto">
        <input
          type="text"
          name="q"
          placeholder="Search an album or artist..."
          className="w-[75%] flex-1 p-2 border rounded-l-lg bg-surface focus:outline-none"
        />
        <button
          type="submit"
          className="bg-text! hover:bg-text/80! text-bg! rounded-none! rounded-r-lg!"
        >
          Search
        </button>
      </form>

      <a href="https://discord.gg/g5gZymxEyR" className="hidden md:block">
        <button aria-label="Discord server">
          <SiDiscord size={18} />
        </button>
      </a>

      <Link to="/settings" className="hidden md:block">
        <button aria-label="Settings">
          <Settings size={18} />
        </button>
      </Link>
    </nav>
  )
}
