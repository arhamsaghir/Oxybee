const links = [
  { label: "HOME", href: "#top" },
  { label: "GO TO MAIN WEBSITE", href: "#" },
  { label: "About Us", href: "#about" },
  { label: "Privacy Policy", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative flex min-h-[591px] flex-col overflow-hidden bg-footer">
      {/* CS monogram watermark (rendered on matching dark bg) */}
      <img
        src="/figma/footer-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[3%] top-[7%] h-[86%] w-auto select-none"
        style={{ mixBlendMode: "lighten" }}
      />

      {/* top bar: centred nav + copyright on the right */}
      <div className="relative z-10 flex items-center px-8 pt-16 sm:px-16">
        <nav className="mx-auto flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-body rounded-full px-2.5 py-1.5 text-sm font-medium text-[#767676] transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <p className="font-body absolute right-8 top-16 hidden text-sm text-[#767676] sm:block sm:right-16">
          OXYBLASTER ©2026
        </p>
      </div>

      {/* oversized backdrop wordmark */}
      <h2
        aria-hidden="true"
        className="font-display pointer-events-none absolute bottom-0 right-0 select-none whitespace-nowrap pr-2 text-right font-medium leading-[0.8] text-[#2a2a2a]"
        style={{ fontSize: "clamp(3.5rem, 11vw, 10rem)" }}
      >
        OXYBLASTER
      </h2>
    </footer>
  );
}
