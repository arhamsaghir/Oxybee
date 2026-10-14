import { solutionBenefits } from "../data";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollProgress } from "../hooks/useScrollProgress";

/* Scroll scrub tuning (desktop pin). */
const ROW = 96; // px height of one benefit row (room for the odd 2-line wrap)
const TRACK = "280vh"; // taller track = slower, calmer scrub

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);

/* Static list — mobile + reduced-motion fallback (every benefit plainly shown). */
function StaticList() {
  return (
    <div className="mx-auto flex max-w-[1312px] flex-col items-center gap-10 px-6 pt-28 pb-20 text-center sm:px-8">
      <img
        src="/figma/about1-object.png"
        alt="Oxyblaster unit in operation"
        className="h-auto w-full max-w-[320px] object-contain"
        loading="lazy"
      />
      <ul className="flex max-w-[724px] flex-wrap justify-center gap-x-6 gap-y-3">
        {solutionBenefits.map((b, i) => (
          <li
            key={`${i}-${b}`}
            className="font-body text-base text-muted before:mr-2 before:content-['•']"
          >
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Solution() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();

  const n = solutionBenefits.length;
  const focusFloat = progress * (n - 1); // 0 → n-1 as the pin is scrubbed

  return (
    <section id="about" className="relative bg-white">
      {reduced ? (
        <StaticList />
      ) : (
        <>
          {/* Desktop: pinned, scroll-scrubbed readout */}
          <div
            ref={ref}
            className="relative hidden lg:block"
            style={{ height: TRACK }}
          >
            <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-24 pb-8 lg:pt-28 lg:pb-10">
              <div className="mx-auto grid w-full max-w-[1312px] flex-1 grid-cols-[0.9fr_1.1fr] items-center gap-12 px-6 pb-6 sm:px-8">
                {/* Left: product — the fixed pointer / needle */}
                <div className="flex items-center justify-center lg:justify-start">
                  <img
                    src="/figma/about1-object.png"
                    alt="Oxyblaster unit in operation"
                    className="h-auto w-auto object-contain"
                    style={{
                      maxHeight: "min(460px, 50vh)",
                      maxWidth: "340px",
                    }}
                    loading="lazy"
                  />
                </div>

                {/* Right: the readout. Rows scrub past a fixed cyan focus line. */}
                <div
                  className="relative overflow-hidden"
                  style={{ height: "60vh", maxHeight: 540, minHeight: 400 }}
                >
                  {/* fixed focus marker + line at vertical center */}
                  <span
                    aria-hidden="true"
                    className="focus-marker pointer-events-none absolute left-0 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2 text-accent"
                  >
                    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                      <path d="M1 1L11 7L1 13V1Z" fill="currentColor" />
                    </svg>
                    <span className="h-px w-7 bg-accent" />
                  </span>

                  {/* scrubbed list */}
                  <ul
                    className="absolute left-0 top-1/2 w-full"
                    style={{
                      transform: `translateY(${-(focusFloat + 0.5) * ROW}px)`,
                      willChange: "transform",
                    }}
                  >
                    {solutionBenefits.map((b, i) => {
                      const d = Math.abs(i - focusFloat);
                      const opacity = Math.max(0.38, 1 - 0.3 * d);
                      const scale = Math.max(0.74, 1 - 0.12 * d);
                      const t = clamp01(1 - d); // 1 at focus → 0 by one row away
                      const gray = Math.round(113 - 93 * t); // muted → ink-strong
                      const focused = Math.round(focusFloat) === i; // exactly one
                      return (
                        <li
                          key={`${i}-${b}`}
                          className="focus-row flex items-center pl-12"
                          style={{ height: ROW }}
                        >
                          <span
                            className="block w-full origin-left leading-[1.15]"
                            style={{
                              opacity,
                              transform: `scale(${scale})`,
                              color: `rgb(${gray},${gray},${gray})`,
                              fontFamily: focused
                                ? "var(--font-display)"
                                : "var(--font-body)",
                              fontSize: focused ? "2rem" : "1.4rem",
                              fontWeight: focused ? 500 : 400,
                            }}
                          >
                            {b}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: static stacked list */}
          <div className="lg:hidden">
            <StaticList />
          </div>
        </>
      )}
    </section>
  );
}
