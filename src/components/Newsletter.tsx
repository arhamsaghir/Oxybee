import Reveal from "./Reveal";

export default function Newsletter() {
  return (
    <section
      id="contact"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 84% 69%, rgba(168,168,168,0.9) 0%, rgba(255,255,255,1) 62%)",
      }}
    >
      {/* product, enlarged and bleeding off the right edge */}
      <img
        src="/figma/hero-product-centered.png"
        alt="Oxyblaster air diffusion unit"
        className="pointer-events-none absolute right-0 top-[48%] hidden h-[94%] max-h-[900px] w-auto -translate-y-1/2 translate-x-[10%] object-contain lg:block"
        style={{ filter: "grayscale(1) brightness(1.05) contrast(1.03)" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-40 pt-28 sm:px-16">
        {/* copy + form */}
        <Reveal variant="fade" className="flex max-w-[671px] flex-col gap-20">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
              Next-generation air diffusion system
            </h2>
            <p className="font-body text-base text-muted">
              Oxyblaster dissolves more oxygen with microbubbles, cutting
              aeration power by up to 30%. Backed by a 10-year warranty.
            </p>
          </div>

          <form
            className="flex w-full max-w-[436px] flex-col gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <p className="font-body text-xl text-ink">Get the latest updates.</p>
            <p className="font-body text-sm text-muted">
              Subscribe to get updates on Oxyblaster, product launches, and more.
            </p>
            <div className="mt-2 flex items-center justify-between border-b border-black/65 pb-2">
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
            className="mx-auto h-auto w-full max-w-[360px] object-contain lg:hidden"
            style={{ filter: "grayscale(1) brightness(1.05) contrast(1.03)" }}
            loading="lazy"
          />
        </Reveal>
      </div>

      {/* oversized solid wordmark — 15.1vw keeps the full word inside the
          viewport at every width: "OXYBLASTER" measures 6.33em in Playfair
          Display 500, so the cap/floor of the clamp only bind at the extremes */}
      <h2
        aria-hidden="true"
        className="font-display pointer-events-none absolute inset-x-0 bottom-6 select-none whitespace-nowrap text-center font-medium leading-none text-[#141414]"
        style={{ fontSize: "clamp(3rem, 15.1vw, 16rem)" }}
      >
        OXYBLASTER
      </h2>
    </section>
  );
}
