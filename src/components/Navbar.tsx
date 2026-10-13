export default function Navbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-6 sm:px-8">
      <nav className="pointer-events-auto flex w-full max-w-[1312px] items-center justify-between rounded-full bg-ink/95 py-2 pl-6 pr-2 backdrop-blur-md sm:pl-8">
        <a href="#top" aria-label="Oxyblaster — home" className="flex items-center">
          <img
            src="/figma/logo-cs-white.png"
            alt="Oxyblaster"
            className="h-9 w-auto"
          />
        </a>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="#contact"
            className="hidden rounded-full px-4 py-2 text-sm text-white/90 transition-colors hover:text-white sm:inline-flex sm:px-5"
          >
            Contact
          </a>
          <a
            href="#contact"
            className="rounded-full border border-[#848484] px-4 py-2 text-xs text-white transition-colors hover:border-white hover:bg-white hover:text-ink sm:px-6 sm:text-sm"
          >
            Download Brochure
          </a>
        </div>
      </nav>
    </header>
  );
}
