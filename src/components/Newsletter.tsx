import Reveal from "./Reveal";

export default function Newsletter() {
  return (
    <section
      id="contact"
      className="relative flex h-screen min-h-screen max-h-screen h-[100dvh] flex-col justify-between overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 84% 69%, rgba(168,168,168,0.9) 0%, rgba(255,255,255,1) 62%)",
      }}
    >
      {/* oversized solid wordmark aligned to the top, responsive to device height and width */}
      <h2
        aria-hidden="true"
        className="font-display pointer-events-none select-none whitespace-nowrap text-center font-medium leading-none text-[#141414] pt-3 sm:pt-5 lg:pt-6 shrink-0"
        style={{ fontSize: "clamp(2.5rem, min(14.5vw, 13vh), 10.5rem)" }}
      >
        OXYBLASTER
      </h2>

      {/* product, enlarged and bleeding off the right edge */}
      <img
        src="/figma/hero-product-centered.png"
        alt="Oxyblaster air diffusion unit"
        className="pointer-events-none absolute right-0 top-[52%] hidden h-[75%] max-h-[750px] w-auto -translate-y-1/2 translate-x-[10%] object-contain lg:block"
        style={{ filter: "grayscale(1) brightness(1.05) contrast(1.03)" }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-6 sm:px-16 py-4">
        {/* copy + form */}
        <Reveal variant="fade" className="flex max-w-[671px] flex-col gap-6 sm:gap-10 lg:gap-12">
          <div className="flex flex-col gap-2 sm:gap-4">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight text-ink">
              Next-generation air diffusion system
            </h2>
            <p className="font-body text-sm sm:text-base text-muted">
              Oxyblaster dissolves more oxygen with microbubbles, cutting
              aeration power by up to 30%. Backed by a 10-year warranty.
            </p>
          </div>

          <form
            className="flex w-full max-w-[436px] flex-col gap-2 sm:gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <p className="font-body text-lg sm:text-xl text-ink">Get the latest updates.</p>
            <p className="font-body text-xs sm:text-sm text-muted">
              Subscribe to get updates on Oxyblaster, product launches, and more.
            </p>
            <div className="mt-1 sm:mt-2 flex items-center justify-between border-b border-black/65 pb-2">
              <input
                type="email"
                required
                placeholder="Email address"
                aria-label="Email address"
                className="font-body w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/60"
              />
              <button
                type="submit"
                className="font-body shrink-0 rounded-full border border-black/65 px-4 py-1 text-sm text-ink transition-colors hover:bg-ink hover:text-white"
              >
                Book now
              </button>
            </div>
          </form>

          {/* mobile product */}
          <img
            src="/figma/hero-product-centered.png"
            alt="Oxyblaster air diffusion unit"
            className="mx-auto h-auto max-h-[22vh] w-auto max-w-[280px] object-contain lg:hidden"
            style={{ filter: "grayscale(1) brightness(1.05) contrast(1.03)" }}
            loading="lazy"
          />
        </Reveal>
      </div>
    </section>
  );
}
