import { Fragment } from "react";
import { solutionHeading } from "../data";
import { useInView } from "../hooks/useInView";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollProgress } from "../hooks/useScrollProgress";

/* Scroll scrub tuning (desktop pin) — mirrors Solution.tsx conventions.
 * Exit proportions port from the Lottie spec t84–132: 1→0.9 anticipation,
 * then explosion to SCALE_MAX while opacity fades (Lottie ends at 8000%;
 * text is invisible past ~42, so we cap there). */
const TRACK = "240vh"; // tall track = pinned reading time + zoom exit
const HOLD = 0.5; // pin progress spent reading before the exit begins
const SCALE_MAX = 42;

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeInCubic = (t: number) => t ** 3;

/* Module-level so useInView's effect dep ([options]) stays referentially
 * stable across the per-scroll-frame re-renders of PinnedStage. */
const REVEAL_IO: IntersectionObserverInit = { threshold: 0.3 };

/* The heading, split into per-letter spans. Words are inline-block so lines
 * wrap naturally; letters carry the stagger via transition-delay. The h2's
 * accessible name comes from aria-label — the visual spans are aria-hidden
 * so screen readers announce the sentence, not single letters. Inter-word
 * spaces are siblings of the word spans: a space at the end of an
 * inline-block hangs (zero width), so it must live in the h2's own flow. */
function RevealHeading() {
  const words = solutionHeading.split(" ");
  let letter = 0;
  return (
    <h2
      aria-label={solutionHeading}
      className="font-display text-balance text-center leading-[1.1] text-ink"
      style={{ fontSize: "clamp(2.5rem, 6vw, 5.25rem)" }}
    >
      <span aria-hidden="true">
        {words.map((word, w) => (
          <Fragment key={w}>
            <span className="intro-word">
              {word.split("").map((ch) => {
                const i = letter++;
                return (
                  <span
                    key={i}
                    className="ltr"
                    style={{ transitionDelay: `${i * 36}ms` }}
                  >
                    {ch}
                  </span>
                );
              })}
            </span>
            {w < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </h2>
  );
}

/* Desktop: pinned stage — the reveal plays once on entry, then the exit zoom
 * is scrubbed to scroll (inline transforms only, never CSS transitions). */
function PinnedStage() {
  const { ref: trackRef, progress } = useScrollProgress<HTMLDivElement>();
  const { ref: viewRef, inView } = useInView<HTMLDivElement>(REVEAL_IO);

  const exit = clamp01((progress - HOLD) / (1 - HOLD));
  const scale =
    exit <= 0.5
      ? 1 - 0.1 * easeOutCubic(exit * 2)
      : 0.9 * (SCALE_MAX / 0.9) ** easeInCubic((exit - 0.5) * 2);
  const opacity = 1 - easeInCubic(clamp01((exit - 0.55) / 0.35));

  return (
    <div
      ref={trackRef}
      className="relative hidden lg:block"
      style={{ height: TRACK }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-white">
        <div
          className="w-full"
          style={{
            transform: `scale(${scale})`,
            opacity,
            willChange: "transform, opacity",
          }}
        >
          <div
            ref={viewRef}
            className={`intro-block mx-auto w-full max-w-[1312px] px-6 text-center ${inView ? "is-visible" : ""}`}
          >
            <RevealHeading />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Mobile: same letter reveal, no pin — scrolls on normally. */
function MobileHeading() {
  const { ref, inView } = useInView<HTMLDivElement>(REVEAL_IO);
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-24 lg:hidden">
      <div
        ref={ref}
        className={`intro-block w-full text-center ${inView ? "is-visible" : ""}`}
      >
        <RevealHeading />
      </div>
    </div>
  );
}

export default function SolutionIntro() {
  const reduced = usePrefersReducedMotion();
  return (
    <section aria-label="Solution introduction" className="relative bg-white">
      {reduced ? (
        <div className="mx-auto flex min-h-screen max-w-[1312px] items-center justify-center px-6 py-24">
          <h2
            className="font-display text-balance text-center leading-[1.1] text-ink"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.25rem)" }}
          >
            {solutionHeading}
          </h2>
        </div>
      ) : (
        <>
          <PinnedStage />
          <MobileHeading />
        </>
      )}
    </section>
  );
}
