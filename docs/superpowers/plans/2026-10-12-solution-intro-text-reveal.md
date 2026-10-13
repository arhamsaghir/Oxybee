# "Solution with Air Diffusion System" — Standalone Reveal Page

> **For agentic workers:** Use superpowers:executing-plans (native) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the heading out of the Solution section onto its own full-viewport page right before it, with the sliding-text-reveal animation from the Jitter/Lottie JSON applied to it — then the product page follows with its existing animation untouched.

**How the JSON was read (`~/Downloads/Scene (1).json`):** a Jitter export (60fps, 2.8s) animating the placeholder word **"MOTION"** on a `#D6E0F0` canvas, with a "jitter.video" watermark. The *motion* (ported to the real heading):
- Whole word slides in from the right (~27% of canvas) over 1.0s, `cubic-bezier(0.25, 0, 0.25, 1)`
- Letters rise into place one-by-one: start ~2.2 frames (≈36ms) apart, each taking ~14 frames (≈240ms), rising ≈0.5em with fade-in, `cubic-bezier(0, 0.1, 0.25, 1)`
- Hold, then exit: subtle 1→0.9 shrink (anticipation), then explosive zoom (0.9→8000%) while fading out — a "zoom-through-the-text" transition
- **Dropped (placeholder content, not design):** the "MOTION" glyphs, the jitter.video watermark, the `#D6E0F0` canvas (site is Figma-faithful white; the new page = white + text only)

**Architecture:** new `SolutionIntro` section (desktop: 240vh scroll track + sticky full-screen stage — reveal plays on entry via the house `useInView`/`is-visible` pattern, exit zoom scrubbed to scroll via the house `useScrollProgress` pattern; mobile: same letter reveal, no pin; reduced-motion: static heading). Heading removed from both copies in `Solution.tsx`. **Zero new dependencies** — hand-rolled, matching the site's established motion system.

**Tech Stack:** React 19 + Tailwind v4 (CSS-first tokens) + existing hooks (`useInView`, `useScrollProgress`) + one extracted shared hook. Playfair Display via `font-display`, `text-ink`, `bg-white`.

**Spec:** user request (2026-10-12) + `~/Downloads/Scene (1).json` motion spec.

## Global Constraints (house rules)
- Animate `transform` + `opacity` only; `will-change` only on animating elements
- Never put CSS transitions on scroll-scrubbed transforms (inline per-frame; see index.css Solution-readout comment)
- Reduced-motion → content-complete static render (StaticList pattern)
- Keep `id="about"` on Solution (Footer "About Us" links to it); heading copy verbatim: `Solution with Air Diffusion System`
- App wrapper already uses `overflow-x-clip` (sticky-safe); do NOT introduce `overflow(-x): hidden` on any ancestor of the new sticky stage

## Review Focus (failure modes guarded against)
1. Screen readers spelling "S o l u t i o n…" → `aria-label` on the h2, letter spans `aria-hidden`
2. Stray visible letters before the reveal triggers (JSON's first letter is pre-visible only because it starts off-canvas) → all letters start at opacity 0
3. Sticky/pin breakage → no `overflow` on ancestors; `overflow-hidden` only on the sticky stage itself
4. Reduced-motion / mobile hitting a pinned, zooming, or invisible heading → dedicated static + mobile branches
5. Scrub lag → scrub transform on a wrapper with no CSS transition; entrance transitions live on inner elements only

---

### Task 1: Save this plan
- [x] Write this plan to `docs/superpowers/plans/2026-10-12-solution-intro-text-reveal.md`. Commit: `docs: plan solution intro reveal page`.

### Task 2: Shared reduced-motion hook + heading data
**Files:** Create `src/hooks/usePrefersReducedMotion.ts`; Modify `src/components/Solution.tsx`, `src/data.ts`

Extract Solution.tsx's local hook (lines 11–25) verbatim to `src/hooks/usePrefersReducedMotion.ts`:
```ts
import { useEffect, useState } from "react";

/** Reactive prefers-reduced-motion flag (live-updates on OS setting change). */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);
  return reduced;
}
```
In Solution.tsx: delete lines 11–25, add the import, delete the now-unused `useEffect, useState` import (line 1) — `noUnusedLocals` fails the build otherwise. Append to `src/data.ts`:
```ts
export const solutionHeading = "Solution with Air Diffusion System";
```
Verify: `npm run build` passes. Commit: `refactor: extract usePrefersReducedMotion to a shared hook`.

### Task 3: Motion primitives in CSS
**File:** `src/index.css` — add after the `.reveal.is-visible` block, under the motion-primitives banner:
```css
/* Solution intro — "sliding text reveal" ported from the Jitter/Lottie spec
 * (60fps source): the whole line drifts in from the right (t0–60f), each
 * letter rises ~0.5em and fades in (≈2.2f stagger, ≈14f each, strong
 * ease-out). The exit zoom is scroll-scrubbed inline in SolutionIntro.tsx. */
.intro-block {
  transform: translateX(30vw);
  transition: transform 1s cubic-bezier(0.25, 0, 0.25, 1);
  will-change: transform;
}
.intro-block.is-visible {
  transform: translateX(0);
}
.intro-word {
  display: inline-block;
  white-space: nowrap;
}
.ltr {
  display: inline-block;
  opacity: 0;
  transform: translateY(0.5em);
  transition:
    opacity 240ms cubic-bezier(0, 0.1, 0.25, 1),
    transform 240ms cubic-bezier(0, 0.1, 0.25, 1);
  will-change: opacity, transform;
}
.is-visible .ltr {
  opacity: 1;
  transform: translateY(0);
}
```
In the existing `@media (prefers-reduced-motion: reduce)` block, add:
```css
  .intro-block,
  .ltr {
    opacity: 1;
    transform: none;
    transition: none;
  }
```
Commit: `feat: sliding-text-reveal motion primitives`.

### Task 4: Create `src/components/SolutionIntro.tsx`
```tsx
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

/* The heading, split into per-letter spans. Words are inline-block so lines
 * wrap naturally; letters carry the stagger via transition-delay. The h2's
 * accessible name comes from aria-label — letter spans are aria-hidden so
 * screen readers announce the sentence, not single letters. */
function RevealHeading() {
  const words = solutionHeading.split(" ");
  let letter = 0;
  return (
    <h2
      aria-label={solutionHeading}
      className="font-display text-balance text-center leading-[1.1] text-ink"
      style={{ fontSize: "clamp(2.5rem, 6vw, 5.25rem)" }}
    >
      {words.map((word, w) => (
        <span key={w} aria-hidden="true" className="intro-word">
          {word.split("").map((ch) => {
            const i = letter++;
            return (
              <span key={i} className="ltr" style={{ transitionDelay: `${i * 36}ms` }}>
                {ch}
              </span>
            );
          })}
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </h2>
  );
}

/* Desktop: pinned stage — the reveal plays once on entry, then the exit zoom
 * is scrubbed to scroll (inline transforms only, never CSS transitions). */
function PinnedStage() {
  const { ref: trackRef, progress } = useScrollProgress<HTMLDivElement>();
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  const exit = clamp01((progress - HOLD) / (1 - HOLD));
  const scale =
    exit <= 0.5
      ? 1 - 0.1 * easeOutCubic(exit * 2)
      : 0.9 * (SCALE_MAX / 0.9) ** easeInCubic((exit - 0.5) * 2);
  const opacity = 1 - easeInCubic(clamp01((exit - 0.55) / 0.35));

  return (
    <div ref={trackRef} className="relative hidden lg:block" style={{ height: TRACK }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-white">
        <div className="w-full" style={{ transform: `scale(${scale})`, opacity, willChange: "transform, opacity" }}>
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
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-24 lg:hidden">
      <div ref={ref} className={`intro-block w-full text-center ${inView ? "is-visible" : ""}`}>
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
```
Notes: reveal total ≈1.3s (30 letters × 36ms stagger + 240ms rise), block drift 1s — matching the JSON's cadence. Accepted trade-off: per-letter spans drop inter-letter kerning (standard for letter-stagger reveals, ~1px at this size). Commit: `feat: solution intro reveal page`.

### Task 5: Wire into `src/App.tsx`
Add `import SolutionIntro from "./components/SolutionIntro";` and render `<SolutionIntro />` between the black video section's closing `</section>` and `<Solution />`. Commit: `feat: add SolutionIntro section before Solution`.

### Task 6: Remove the heading from `Solution.tsx`
- Delete the pinned panel's heading wrapper div + h2 (lines 77–84) — the product/readout grid becomes the panel's first child; it's `flex-1 items-center`, so content centers vertically on its own (visually verify; add breathing room only if it looks cramped).
- Delete the h2 inside `StaticList` (lines 31–36).
Verify: `npm run build` + `npm run lint`. Commit: `refactor: move solution heading to its own page`.

### Task 7: Verify + tune (Playwright, desktop 1440×900 + mobile 390×844)
1. Mid-reveal capture (~0.4s after the section enters): letters visibly staggering up; block drifting in from the right
2. After reveal: heading alone, centered on a clean white full page — nothing else
3. Scroll through the pin's second half: heading scaling up + fading (zoom-through); reversible when scrolling back
4. Past the pin: product + readout panel with **no heading**; readout scrub intact
5. No horizontal overflow either viewport: `document.documentElement.scrollWidth <= window.innerWidth`
6. Reduced-motion emulation: heading plainly visible, no 240vh pin, Solution shows StaticList, no duplicated heading
Tune from captures if needed — all timings are one-line constants (stagger 36ms, `.intro-block` 30vw/1s, `SCALE_MAX`, `HOLD`). If the zoom exit proves too much in review, shipping reveal-only is a 5-minute trim (drop the scrub wrapper). Final commit: `polish: tune solution intro reveal`.

## Out of scope / notes
- Product image + readout scrub animation in Solution: untouched
- No new dependencies; `#about` id and Footer link unchanged
- The stale `.zcode/plans/plan-sess_f0f3434a…md` "heading zoom-in" mini-plan is superseded by this one — not implementing it

**Execution approach:** Native — all tasks in one session, then a single review pass at the end.
