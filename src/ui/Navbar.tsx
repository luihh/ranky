import { Link } from '@tanstack/react-router'
import { LogOut, Settings, User } from 'lucide-react'
import { SiDiscord } from '@icons-pack/react-simple-icons'
import { authClient } from '@/lib/auth/client'
import { useEffect, useRef, useState } from 'react'

function UserMenu() {
  const { data: session } = authClient.useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!session) {
    return (
      <button
        onClick={() =>
          authClient.signIn.social({
            provider: 'discord',
            callbackURL: import.meta.env.VITE_FRONTEND_URL
          })
        }
      >
        Sign in
      </button>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <a onClick={() => setOpen((prev) => !prev)} className="cursor-pointer" aria-label="User menu">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name}
            className="size-12 rounded-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex rounded-full bg-bg size-12 border border-border items-center justify-center hover:bg-border transition-colors">
            <User />
          </div>
        )}
      </a>

      {open && (
        <div className="absolute right-0 top-11 bg-bg border border-border rounded-xl shadow-xl w-52 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold truncate tracking-wider">@{session.user.name}</p>
          </div>

          <div>
            <Link
              to="/user/$userId"
              params={{ userId: session.user.discordId }}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface no-underline transition-colors"
            >
              <User size={20} className="opacity-75" />
              Profile
            </Link>

            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface no-underline transition-colors"
            >
              <Settings size={20} className="opacity-75" />
              Settings
            </Link>
          </div>

          <div className="border-t">
            <a
              onClick={() => authClient.signOut()}
              className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer hover:bg-red-500/80 no-underline transition-colors"
            >
              <LogOut size={20} className="opacity-75" />
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function DiscordServer() {
  return (
    <a
      href="https://discord.gg/g5gZymxEyR"
      className="flex rounded-full bg-blue-600 size-12 border border-border items-center justify-center hover:bg-blue-400 transition-colors"
      aria-label="Discord server"
    >
      <SiDiscord />
    </a>
  )
}

export default function Navbar() {
  return (
    <nav className="flex flex-col gap-3 py-4 px-8 bg-surface md:flex-row md:items-center md:justify-between">
      <div className="flex items-center justify-between w-full md:w-auto">
        <Link to="/" className="text-2xl font-bold no-underline whitespace-nowrap">
          Ranky :)
        </Link>

        <div className="flex flex-row gap-4 md:hidden">
          <DiscordServer />
          <UserMenu />
        </div>
      </div>

      <form action="/search" className="flex w-full max-w-md mx-auto">
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

      <div className="hidden md:flex md:gap-4">
        <DiscordServer />
        <UserMenu />
      </div>
    </nav>
  )
}
