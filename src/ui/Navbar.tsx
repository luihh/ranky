import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'

function Buttons() {
  return (
    <>
      <a href="https://ko-fi.com/O5B023OVI4" target="_blank">
        <img
          height={36}
          style={{ border: 0, height: 36 }}
          src="https://storage.ko-fi.com/cdn/kofi3.png?v=6"
          alt="Buy Me a Coffee at ko-fi.com"
        />
      </a>

      <Link to="/settings" draggable={false}>
        <button aria-label="Settings">
          <Settings size={18} />
        </button>
      </Link>
    </>
  )
}

export default function Navbar() {
  return (
    <nav className="flex flex-col gap-3 py-4 px-8 bg-surface lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center">
      <div className="flex items-center justify-between w-full lg:w-auto">
        <Link to="/" className="lg:w-3xs text-2xl font-bold no-underline whitespace-nowrap">
          Ranky :)
        </Link>

        <div className="flex flex-row gap-3 lg:hidden">
          <Buttons />
        </div>
      </div>

      <form action="/search" className="flex w-full max-w-lg mx-auto lg:justify-self-center">
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

      <div className="hidden lg:flex lg:items-center lg:gap-3 lg:justify-end lg:w-3xs">
        <Buttons />
      </div>
    </nav>
  )
}
