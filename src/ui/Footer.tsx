import { SiGithub, SiDiscord } from '@icons-pack/react-simple-icons'

export default function Footer() {
  return (
    <footer className="group mt-auto flex flex-col sm:flex-row items-center justify-center gap-3 py-6 px-4 text-sm opacity-50">
      <span>
        Made with <a href="https://ranky.luihh.dev/album/864103462">❤️</a> by{' '}
        <a
          href="https://luihh.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Luihh
        </a>
      </span>

      <div className="flex items-center gap-2">
        <a
          href="http://discord.com/invite/g5gZymxEyR"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discord"
          className="border-none bg-transparent p-1"
        >
          <SiDiscord size={18} />
        </a>
        <a
          href="https://github.com/luihh/ranky"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="border-none bg-transparent p-1"
        >
          <SiGithub size={18} />
        </a>
      </div>
    </footer>
  )
}
