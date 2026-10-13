export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col overflow-hidden bg-white"
    >
      {/* blueprint grid, revealed by a mask wipe on load */}
      <div className="blueprint-grid mask-reveal pointer-events-none absolute inset-0" />

      {/* soft radial glow, centred on the product */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[657px] w-[657px] -translate-x-1/2 -translate-y-[54%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(120,120,120,0.30) 0%, rgba(229,229,229,0) 66%)",
        }}
      />

      {/* layered wordmark + product, pushed down so the navbar clears it */}
      <div className="relative flex flex-1 items-center justify-center pt-24 pb-8 md:pt-32">
        <div className="relative mx-auto flex w-full max-w-[1440px] items-center justify-center px-4">
          {/* wordmark (behind) */}
          <h1
            aria-label="Oxyblaster"
            className="word-rise font-display pointer-events-none select-none whitespace-nowrap text-center font-medium leading-none text-[#2c2c2c]"
            style={{ fontSize: "clamp(3.25rem, 15.8vw, 15rem)" }}
          >
            OXYBLASTER
          </h1>

          {/* product (static, centred) */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <img
              src="/figma/hero-product-centered.png"
              alt="Oxyblaster air diffusion unit"
              className="h-[52vh] max-h-[600px] w-auto object-contain sm:h-[60vh]"
              style={{ filter: "grayscale(1) brightness(1.05) contrast(1.03)" }}
            />
          </div>

          {/* outlined wordmark (traced over) */}
          <h1
            aria-hidden="true"
            className="wordmark-outline font-display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-medium leading-none text-white"
            style={{ fontSize: "clamp(3.25rem, 15.8vw, 15rem)" }}
          >
            OXYBLASTER
          </h1>
        </div>

        {/* side labels, one line, flanking the product below the wordmark */}
        <div className="pointer-events-none absolute inset-x-0 top-[72%] mx-auto hidden w-full max-w-[1440px] items-start justify-between px-16 sm:flex">
          <p className="font-display whitespace-nowrap text-xl text-ink lg:text-2xl">
            Next-generation air diffusion system
          </p>
          <p className="font-display whitespace-nowrap text-right text-xl text-ink lg:text-2xl">
            The future of aeration
          </p>
        </div>
      </div>

      {/* caption + CTA, pinned to the lower area */}
      <div className="relative z-10 mb-14 flex flex-col items-center gap-5">
        {/* mobile labels (hidden on sm+, shown as the side labels there) */}
        <div className="flex flex-col items-center gap-1 px-6 text-center sm:hidden">
          <p className="font-display text-base text-ink">
            Next-generation air diffusion system
          </p>
          <p className="font-display text-base text-ink">
            The future of aeration
          </p>
        </div>
        <p className="font-display text-base italic text-ink">
          Developed by Oxybee Solutions
        </p>
        <a
          href="#contact"
          className="rounded-full bg-ink px-14 py-2.5 text-base text-white/80 transition-colors hover:bg-black hover:text-white"
        >
          Book now
        </a>
      </div>
    </section>
  );
}
