# Oxyblaster Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Oxyblaster single-page marketing site as a pixel-faithful, fully-animated React app reproducing the Figma design (frame node `328:31`) from an empty folder to a ship-ready build.

**Architecture:** A static single-page Vite/React app. One `App.tsx` stacks thirteen full-bleed sections; each section is one focused component in `src/components/`. All copy lives in `src/data.ts`. Motion is hand-rolled — a small set of CSS keyframes plus three hooks over `IntersectionObserver` and scroll position — with **no animation library**. Every animation is gated by `prefers-reduced-motion`. Static imagery is extracted from Figma into `public/figma/`; real video/photo media is self-hosted in `public/media/`.

**Tech Stack:** React 19, Vite 8, TypeScript ~6, Tailwind CSS v4 (CSS-first, via `@tailwindcss/vite` — no `tailwind.config.js`, no PostCSS), oxlint. Fonts: Playfair Display (Google Fonts) as the serif stand-in for the licensed OHHO display face, Satoshi (Fontshare) for body.

**Spec:** This plan is self-contained. The motion intent derives from the user's pasted annotation spec (reproduced in Task 2) because the Framelink Figma MCP cannot read interactions/motion/video — see Global Constraints. Figma source of truth: frame `328:31`; sub-frames `328:32` (hero), `328:44` (scrolltrigger), `328:88` (about4 / "how it works").

## Global Constraints

- **Tailwind v4 CSS-first only.** Tokens live in an `@theme` block in `src/index.css`. Do NOT create `tailwind.config.js` or a PostCSS config; the `@tailwindcss/vite` plugin is the whole pipeline.
- **No animation library.** Motion is CSS + the three hooks only. The single allowed exception: a lazy-loaded, isolated Lottie runtime *solely* for a designer-authored illustrated animation if one is ever supplied — never for scroll/layout/section motion.
- **Every animation must honor `prefers-reduced-motion: reduce`** — reveals show final state, keyframe animations are disabled, scroll scrubbing falls back to the final frame.
- **Display font must resolve to a SERIF.** `--font-display` is `"OHHO", "Playfair Display", Georgia, "Times New Roman", serif`. OHHO is a high-contrast Didone serif; a sans fallback (e.g. Clash Display) is wrong and makes every heading read incorrectly.
- **Self-hosted media only.** Videos are native `<video muted loop playsinline>`; never embed Figma video or third-party players. Source clips are large (~15 MB total) — compress before the final build.
- **Copy is verbatim from `src/data.ts`.** Preserve exact strings including `H₂S`, `30%`, `99.8%`, `10 years`, `50-60%`.
- **Fidelity target:** pixel-faithful to Figma `328:31` reviewed at a 1440px-wide viewport.

## Testing Approach (read before Task 0)

This is a visual-fidelity site, not a unit-testable library, so each task's "test" is a **verification gate**, not a pytest. Every task ends by confirming, in this order:
1. `npm run build` — `tsc -b` typecheck + `vite build` both succeed (zero errors).
2. `npm run lint` — oxlint clean.
3. **Visual check** — run the dev server, screenshot the section at 1440px with the Playwright MCP (or the `browse` CLI), and compare against the Figma reference crop for that section.
4. **Fidelity diff** — where a Figma frame exists for the section, run the `kiyas` MCP `compare` (design frame vs rendered URL). If kiyas errors on its AI provider, pass `model: openai` (codex) — the default `claude` provider fails under MCP because it resolves through a shell alias the subprocess can't see.
5. **Reduced-motion check** — emulate `prefers-reduced-motion: reduce` and confirm the section renders fully (no hidden/clipped content).

"Commit" steps assume the repo is initialized in Task 0. Use Conventional Commits.

## Review Focus

Five conditions the design implies but no single section's happy-path check exercises — most likely to bite first:

1. **`prefers-reduced-motion: reduce`** — a user with this set must still see every section's content (reveals at opacity 1, no residual transforms, videos showing poster/first frame). Pinned in Task 2 (CSS + hooks) and re-checked in Task 15.
2. **OHHO unavailable → Playfair Display serif actually renders** — if the display face ever falls back to a sans, the whole page reads wrong. Pinned in Task 1 (assert computed `font-family` on an `.font-display` node is the serif stack).
3. **Video load failure / autoplay rejection** — `AutoVideo` must swallow `.play()` rejection and show the poster (or section background) without throwing. Pinned in Task 2 (AutoVideo) and exercised in Tasks 7/11.
4. **Narrow viewport** — the about4 diagram is desktop-only (`hidden lg:block`) with a separate stacked mobile flow; wordmarks and grids must reflow without overflow. Pinned in Task 9 and re-checked in Task 15.
5. **Autoplay policy** — inline videos must be `muted` AND `playsInline` or mobile browsers block autoplay. Pinned in Task 2 as an AutoVideo invariant.

---

## File Structure

```
index.html                      # font <link>s, meta, #root mount
vite.config.ts                  # react() + tailwindcss() plugins — nothing else
tsconfig*.json                  # Vite React-TS defaults
.oxlintrc.json                  # lint config
src/
  main.tsx                      # React root (StrictMode)
  index.css                     # @import tailwindcss; @theme tokens; motion CSS
  data.ts                       # all section copy (arrays, verbatim from Figma)
  hooks/
    useInView.ts                # IO reveal-once, reduced-motion aware
    useScrollProgress.ts        # 0→1 across a tall sticky container
    useParallax.ts              # translateY by distance from viewport centre
  components/
    Reveal.tsx                  # scroll-reveal wrapper (up/left/right/fade + delay)
    AutoVideo.tsx               # muted/loop/inline video, play-in-view
    Marquee.tsx                 # seamless infinite ticker (duplicated track)
    SectionHeading.tsx          # ruled sub-heading
    Navbar.tsx                  # fixed pill nav
    Hero.tsx                    # 328:32 — wordmark + exploded product
    VideoScrollTrigger.tsx      # 328:44 — sticky scrub, text slides aside
    Solution.tsx                # about1 — object + benefits
    StandsOut.tsx               # about2 — 3 staggered cards
    Features.tsx                # about3 — centred bullet list
    HowItWorks.tsx              # 328:88/about4 — scroll-drawn SVG path + clips
    Customers.tsx               # about5 — logo marquee rows
    Applications.tsx            # about6 — 2 photos + video
    Comparison.tsx              # about7 — comparison table
    Newsletter.tsx              # CTA — copy + form + oversized wordmark
    Footer.tsx                  # links + backdrop wordmark
public/
  favicon.svg
  figma/                        # static art exported from Figma (MCP)
    hero-product.png  about1-object.png  card1..3.png
    app1.png app2.png app-video.png
    about4-img1.png about4-img2.png about4-line.svg
    logos/r1-1.png … r4-5.png   # 29 customer logos in 4 rows
  media/                        # self-hosted motion/photo media
    hero-exploded.jpg           # exploded product still (hero)
    scrolltrigger.mp4  video.mp4
    about4-chart.mp4  about4-bubble.mp4  applications.mp4
```

Build order is bottom-up: scaffold → design system → motion primitives → content model → assets → shell/nav → sections top-to-bottom → whole-page fidelity/a11y/perf pass. Sections depend only on the primitives from Task 2 and the data from Task 3, so after Task 5 they can be built in any order; the numbering follows visual top-to-bottom for review convenience.

---

### Task 0: Scaffold the project & tooling

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `.oxlintrc.json`, `index.html`, `src/main.tsx`, `.gitignore`
- Create: `src/App.tsx` (temporary placeholder, replaced in Task 5)

**Interfaces:**
- Produces: a running Vite dev server and a passing `npm run build`; the npm scripts `dev`, `build`, `lint`, `preview` that every later task's verification gate calls.

- [ ] **Step 1: Scaffold with Vite React-TS and add Tailwind v4 + oxlint**

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install tailwindcss @tailwindcss/vite
npm install -D oxlint @types/node
```

- [ ] **Step 2: Wire the Vite plugins**

`vite.config.ts` — the Tailwind v4 plugin replaces any PostCSS/`tailwind.config.js` setup:

```ts
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 3: Set the npm scripts**

In `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "oxlint",
  "preview": "vite preview"
}
```

- [ ] **Step 4: Minimal placeholder app so the toolchain is verifiable**

Replace `src/App.tsx` with `export default function App() { return <div className="min-h-svh bg-white" /> }` and set `src/main.tsx` to the StrictMode root:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Create `src/index.css` with just `@import "tailwindcss";` for now (expanded in Task 1).

- [ ] **Step 5: Verify the toolchain**

Run: `npm run build` → expect zero errors. Run: `npm run dev` → expect a blank white page at the printed localhost URL with no console errors.

- [ ] **Step 6: Initialize git and commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Vite + React 19 + TS + Tailwind v4 + oxlint"
```

---

### Task 1: Design system — tokens, fonts, base styles

**Files:**
- Modify: `index.html` (font `<link>`s, meta, title)
- Modify: `src/index.css` (`@theme` tokens, base, static utilities)

**Interfaces:**
- Produces: Tailwind color utilities `bg-ink`, `text-ink`, `text-ink-strong`, `text-muted`, `bg-surface`, `bg-footer`, `border-line`, `text-accent`/`bg-accent`; font utilities `font-display` (serif) and `font-body` (Satoshi); the `.wordmark-outline` and `.no-scrollbar` classes.

- [ ] **Step 1: Load the fonts in `index.html`**

Replace `<head>` contents (preconnects + two stylesheet links + meta/title):

```html
<meta charset="UTF-8" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="Oxyblaster — next-generation air diffusion system. Dissolve more oxygen with microbubbles, cut aeration power by up to 30%, backed by a 10-year warranty." />
<link rel="preconnect" href="https://api.fontshare.com" crossorigin />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />
<title>Oxyblaster — Next-generation air diffusion system</title>
```

- [ ] **Step 2: Define tokens and base in `src/index.css`**

```css
@import "tailwindcss";

@theme {
  --color-ink: #333333;
  --color-ink-strong: #141414;
  --color-muted: #717171;
  --color-line: #bfbfbf;
  --color-surface: #f5f5f5;
  --color-footer: #0e0e0e;
  --color-accent: #47d8fe;

  --font-display: "OHHO", "Playfair Display", Georgia, "Times New Roman", serif;
  --font-body: "Satoshi", ui-sans-serif, system-ui, -apple-system, sans-serif;
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  color: var(--color-ink);
  background: #ffffff;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Big outlined wordmark used in the hero / CTA sections */
.wordmark-outline {
  color: transparent;
  -webkit-text-stroke: 1.5px currentColor;
}

/* Hide scrollbars on the horizontal logo marquee */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
```

- [ ] **Step 3: Add a favicon**

Create `public/favicon.svg` (a simple accent-colored droplet/circle mark is fine; it only needs to exist so the `<link>` resolves).

- [ ] **Step 4 (Review Focus #2): Verify the display font resolves to a serif**

Run `npm run dev`, then in the browser console on any `.font-display` element:
`getComputedStyle($0).fontFamily` — expect the string to start with the OHHO/Playfair serif stack, and the rendered glyphs to be a high-contrast serif (visibly NOT a sans). This is the single most important fidelity guard.

- [ ] **Step 5: Verify & commit**

Run: `npm run build` and `npm run lint` → expect clean.

```bash
git add -A && git commit -m "feat: design tokens, fonts, and base styles"
```

---

### Task 2: Motion system — CSS keyframes, hooks, and reusable primitives

This is the shared foundation every section consumes. It encodes the user's annotation spec, which the Figma MCP could not provide:

> 1. **Hero** — blueprint/grid background revealed by an animated mask wipe on load; product does a 360° spin + slide-up on appear.
> 2. **Video ScrollTrigger** — a sticky section where the text block slides aside on scroll to make room for the video, which autoplays muted/looping when it enters view.
> 3. **Interactive scroll path (about4)** — inline the dashed SVG and scrub its `stroke-dashoffset` by scroll position so the line draws as you scroll.
> 4. **Content sections** — images slide in from the side, cards slide in from the bottom, text fades in, embedded videos autoplay on scroll entry.
> 5. **Customers** — continuous infinite marquee, rows scrolling in opposite directions.

**Files:**
- Modify: `src/index.css` (append the motion stylesheet)
- Create: `src/hooks/useInView.ts`, `src/hooks/useScrollProgress.ts`, `src/hooks/useParallax.ts`
- Create: `src/components/Reveal.tsx`, `src/components/AutoVideo.tsx`, `src/components/Marquee.tsx`, `src/components/SectionHeading.tsx`

**Interfaces (later tasks rely on these exact signatures):**
- `useInView<T extends HTMLElement>(options?: IntersectionObserverInit) => { ref: RefObject<T>, inView: boolean }` — flips to visible once, then disconnects; reports visible immediately under reduced-motion.
- `useScrollProgress<T extends HTMLElement>() => { ref: RefObject<T>, progress: number }` — `progress` 0→1 as the (tall) element scrolls past a sticky child.
- `useParallax<T extends HTMLElement>(speed = 0.12) => RefObject<T>` — sets `transform: translate3d` each frame; no-op under reduced-motion.
- `<Reveal variant?="up"|"left"|"right"|"fade" delay?=0 className?>` — wraps children; animates in on first view.
- `<AutoVideo src poster? className? autoPlayInView?=true>` — muted/loop/inline `<video>`, plays in view.
- `<Marquee direction?="left"|"right" duration?=40 className?>` — seamless ticker.
- `<SectionHeading className?>{text}</SectionHeading>` — ruled sub-heading.

- [ ] **Step 1: Append the reveal + scroll-reveal CSS to `src/index.css`**

```css
/* ---- Scroll-reveal primitives (driven by hooks — no library) ---- */
.reveal {
  opacity: 0;
  transition:
    opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}
.reveal--up { transform: translateY(36px); }
.reveal--left { transform: translateX(-56px); }
.reveal--right { transform: translateX(56px); }
.reveal--fade { transform: none; }
.reveal.is-visible { opacity: 1; transform: none; }
```

- [ ] **Step 2: Append the hero + marquee keyframes to `src/index.css`**

```css
/* hero product: 360° spin + rise on load */
@keyframes product-spin-in {
  from { opacity: 0; transform: translateY(120px) rotate(-360deg); }
  to { opacity: 1; transform: translateY(0) rotate(0deg); }
}
.product-spin-in { animation: product-spin-in 1.7s cubic-bezier(0.22, 1, 0.36, 1) both; }

/* hero wordmark intro */
@keyframes word-rise {
  from { opacity: 0; transform: translateY(40px); letter-spacing: 0.12em; }
  to { opacity: 1; transform: none; letter-spacing: normal; }
}
.word-rise { animation: word-rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) both; }

/* hero blueprint grid, revealed by a mask wipe on load */
.blueprint-grid {
  background-image:
    linear-gradient(to right, rgba(71, 216, 254, 0.16) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(71, 216, 254, 0.16) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(circle at 50% 48%, #000 0%, transparent 70%);
  mask-image: radial-gradient(circle at 50% 48%, #000 0%, transparent 70%);
}
@keyframes mask-reveal {
  from { clip-path: inset(0 50% 0 50%); opacity: 0; }
  to { clip-path: inset(0 0 0 0); opacity: 1; }
}
.mask-reveal { animation: mask-reveal 1.6s cubic-bezier(0.22, 1, 0.36, 1) both; }

/* infinite logo ticker */
@keyframes marquee-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
.marquee-track { display: flex; width: max-content; flex-wrap: nowrap; }
.marquee-left { animation: marquee-left var(--marquee-duration, 40s) linear infinite; }
.marquee-right { animation: marquee-right var(--marquee-duration, 40s) linear infinite; }
.marquee:hover .marquee-track { animation-play-state: paused; }
```

- [ ] **Step 3 (Review Focus #1): Append the reduced-motion override to `src/index.css`**

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { opacity: 1; transform: none; transition: none; }
  .word-rise, .product-spin-in, .mask-reveal, .marquee-left, .marquee-right { animation: none; }
}
```

- [ ] **Step 4: Create `src/hooks/useInView.ts`**

```ts
import { useEffect, useRef, useState } from "react";

/** Reveal-on-scroll: returns a ref + whether the element entered the viewport.
 *  Fires once, then disconnects. Honours prefers-reduced-motion by reporting
 *  visible immediately. */
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      options ?? { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}
```

- [ ] **Step 5: Create `src/hooks/useScrollProgress.ts`**

```ts
import { useEffect, useRef, useState } from "react";

/** Scroll progress (0→1) across a tall container with a sticky child. 0 when the
 *  container top hits the viewport top, 1 once scrolled through its extra height.
 *  Scrubs the scroll-trigger layout shift and the SVG path draw. */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      if (distance <= 0) { setProgress(0); return; }
      setProgress(Math.min(Math.max(-rect.top / distance, 0), 1));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { ref, progress };
}
```

- [ ] **Step 6: Create `src/hooks/useParallax.ts`**

```ts
import { useEffect, useRef } from "react";

/** Lightweight parallax: translates the element on Y relative to its distance
 *  from viewport centre. rAF-throttled; disabled under reduced-motion. */
export function useParallax<T extends HTMLElement>(speed = 0.12) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const centre = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-centre * speed).toFixed(1)}px, 0)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);
  return ref;
}
```

- [ ] **Step 7: Create `src/components/Reveal.tsx`**

```tsx
import { useInView } from "../hooks/useInView";

type Variant = "up" | "left" | "right" | "fade";
type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  /** stagger delay in ms */
  delay?: number;
};

/** Wraps content so it animates in the first time it scrolls into view. */
export default function Reveal({ children, className = "", variant = "up", delay = 0 }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal reveal--${variant} ${inView ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 8 (Review Focus #3, #5): Create `src/components/AutoVideo.tsx`**

Invariants: `muted` + `playsInline` (else mobile blocks autoplay); `.play()` rejection is swallowed so a blocked/failed load never throws and the `poster` shows.

```tsx
import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  /** play/pause as it enters/leaves the viewport (default true) */
  autoPlayInView?: boolean;
};

export default function AutoVideo({ src, poster, className = "", autoPlayInView = true }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video || !autoPlayInView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [autoPlayInView]);

  return (
    <video ref={ref} className={className} poster={poster} muted loop playsInline preload="metadata">
      <source src={src} type="video/mp4" />
    </video>
  );
}
```

- [ ] **Step 9: Create `src/components/Marquee.tsx`**

Children are rendered twice back-to-back and the track translates by -50%, so the loop is seamless.

```tsx
type Props = {
  children: React.ReactNode;
  direction?: "left" | "right";
  /** seconds for one full loop */
  duration?: number;
  className?: string;
};

export default function Marquee({ children, direction = "left", duration = 40, className = "" }: Props) {
  return (
    <div className={`marquee w-full overflow-hidden ${className}`}>
      <div
        className={`marquee-track marquee-${direction}`}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 10: Create `src/components/SectionHeading.tsx`**

```tsx
type Props = { children: React.ReactNode; className?: string };

/** The small ruled sub-heading used above several sections. */
export default function SectionHeading({ children, className = "" }: Props) {
  return (
    <div className={`mx-auto w-full max-w-[1312px] px-6 sm:px-8 ${className}`}>
      <div className="h-px w-full bg-line" />
      <h2 className="font-display mt-3 text-xl tracking-[0.06em] text-ink">{children}</h2>
    </div>
  );
}
```

- [ ] **Step 11: Verify & commit**

Run: `npm run build` and `npm run lint` → clean (primitives are unused so far; that's expected — no unused-import errors because each file exports its symbol).

```bash
git add -A && git commit -m "feat: hand-rolled motion system (CSS, hooks, primitives)"
```

---

### Task 3: Content model — `src/data.ts`

**Files:**
- Create: `src/data.ts`

**Interfaces:**
- Produces: `solutionBenefits: string[]`, `standoutCards: { img: string; caption: string; fit: "contain" | "cover" }[]`, `features: string[]`, `diagramPoints: string[]`, `comparisonRows: { matter: string; traditional: string; oxyblaster: string }[]`, `logoRows: string[][]`.

- [ ] **Step 1: Create `src/data.ts` — lists & standout cards**

```ts
// Content extracted from the Oxyblaster Figma (node 328:31).

export const solutionBenefits = [
  "No replacement upto 10 years",
  "High rate oxygen transfer",
  "Save 30% energy",
  "Sweeps sludge from the bottom preventing accumulation",
  "No odour generation and 99% H₂S removal",
  "Maintenance free diffuser",
  "10 years warranty",
];

export const standoutCards = [
  { img: "/figma/card1.png", caption: "Inhaling sludge and water from bottom and giving strong impact", fit: "contain" as const },
  { img: "/figma/card2.png", caption: "Creation of microbubbles by specific blades", fit: "cover" as const },
  { img: "/figma/card3.png", caption: "Crushing sludge helps microorganism to metabolize efficiently", fit: "cover" as const },
];

export const features = [
  "Reduced Power Consumption By Upto 30%.",
  "Reduced Sludge Output By 20%.",
  "Zero Odor Generation.",
  "Removing H₂S By 99%.",
  "Reduced Footprint.",
  "Powerful Stirring Inside The Tank.",
  "Zero Maintenance Cost.",
  "Reduce Quantity Of Air Diffusers By 50-60%.",
];

export const diagramPoints = [
  "Outstanding oxygen dissolution power",
  "Reduced cost of electricity",
  "Guarantee of zero odor generation",
  "Reduced sludge output",
  "Guarantee of zero odor generation",
];
```

- [ ] **Step 2: Append the comparison rows & logo rows**

```ts
export const comparisonRows = [
  { matter: "Clogging and replacement", traditional: "Can clog and need frequent replacement", oxyblaster: "Designed not to clog, with no replacement for up to 10 years" },
  { matter: "Oxygen transfer", traditional: "Less efficient", oxyblaster: "High-rate transfer through fine microbubbles" },
  { matter: "Power use", traditional: "Higher energy consumption", oxyblaster: "Up to 30% less power*" },
  { matter: "Sludge at the tank bottom", traditional: "Can build up", oxyblaster: "Swept up by strong stirring, so it can't settle" },
  { matter: "Sludge output", traditional: "Baseline", oxyblaster: "Up to 20% less" },
  { matter: "Odor", traditional: "Can cause foul odor and poorer treatment quality", oxyblaster: "Designed to prevent odor, with H₂S cut by 99.8%**" },
  { matter: "Maintenance cost", traditional: "High maintenance and replacement cost", oxyblaster: "Maintenance-free diffuser***" },
  { matter: "Number of diffusers needed", traditional: "Baseline", oxyblaster: "50-60% fewer" },
  { matter: "Footprint", traditional: "Baseline", oxyblaster: "Smaller footprint" },
];

// Customer logo rows (public/figma/logos)
export const logoRows: string[][] = [
  ["r1-1", "r1-2", "r1-3", "r1-4", "r1-5", "r1-6", "r1-7", "r1-8", "r1-9", "r1-10", "r1-11"],
  ["r2-1", "r2-2", "r2-3", "r2-4", "r2-5", "r2-6", "r2-7", "r2-8"],
  ["r3-1", "r3-2", "r3-3", "r3-4", "r3-5"],
  ["r4-1", "r4-2", "r4-3", "r4-4", "r4-5"],
].map((row) => row.map((n) => `/figma/logos/${n}.png`));
```

- [ ] **Step 3: Verify & commit**

Run: `npm run build` → typecheck passes (the `as const` on `fit` is required so the union type narrows to `"contain" | "cover"`).

```bash
git add -A && git commit -m "feat: section content model (data.ts)"
```

---

### Task 4: Asset pipeline — static art from Figma + self-hosted media

The Framelink Figma MCP returns **only layout, sizing, fills, strokes, and text** — it does NOT surface annotations, prototype/interactions, Smart-Animate motion specs, or video (video layers export as a static poster PNG). So this task has two channels: (A) pull static art via the MCP; (B) bring real motion media in by hand.

**Files:**
- Create: `public/figma/*` (static art + `logos/`), `public/media/*` (video + photos)

**Interfaces:**
- Produces every asset path referenced by the section components:
  `public/figma/`: `hero-product.png`, `about1-object.png`, `card1.png`, `card2.png`, `card3.png`, `app1.png`, `app2.png`, `app-video.png`, `about4-img1.png`, `about4-img2.png`, `about4-line.svg`, `logos/r1-1.png`…`logos/r4-5.png` (29 logos).
  `public/media/`: `hero-exploded.jpg`, `scrolltrigger.mp4`, `video.mp4`, `about4-chart.mp4`, `about4-bubble.mp4`, `applications.mp4`.

- [ ] **Step 1: Confirm the Figma source link**

Obtain the frame link (Figma → select frame `328:31` → right-click → *Copy link to selection*). The link carries the `fileKey` and `node-id`. Keep it handy for the MCP calls and for kiyas in later tasks.

- [ ] **Step 2: Export static art via the Figma MCP**

Use the `download_figma_images` tool to export, into `public/figma/`:
- the product renders (`hero-product.png`, `about1-object.png`), the three standout cards (`card1..3.png`), the two application photos (`app1.png`, `app2.png`), the applications video poster (`app-video.png`), the about4 stills (`about4-img1.png`, `about4-img2.png`), and all 29 customer logos into `public/figma/logos/` named `r{row}-{index}.png`.
- Note: animated **GIF fills** are retrievable here via the tool's `gifRef` param (returns the animated file); true `videoRef` video fills are NOT — those come from Channel B.

- [ ] **Step 3: Inline the about4 guide line as SVG**

Export/trace the dashed diagram path as `public/figma/about4-line.svg` (also inlined directly in `HowItWorks.tsx` in Task 9 so its stroke can be scrubbed — the file is kept for reference/fallback).

- [ ] **Step 4 (Channel B): Import and map the real media**

The MCP cannot give motion/video. Bring the user-supplied clips in from `~/Downloads` and map by aspect ratio / duration to each slot (use `mdls -name kMDItemPixelWidth -name kMDItemPixelHeight <file>` for dimensions — `ffprobe` is not installed on this machine). Copy into `public/media/` with these canonical names:

| Slot | File | Shape |
|---|---|---|
| Full-screen operation clip (`App.tsx`) | `video.mp4` | 16:9 landscape |
| Sticky scroll-trigger (`VideoScrollTrigger`) | `scrolltrigger.mp4` | ~square / product |
| about4 chart loop (`HowItWorks`) | `about4-chart.mp4` | small wide |
| about4 bubble loop (`HowItWorks`) | `about4-bubble.mp4` | small wide |
| Applications video (`Applications`) | `applications.mp4` | ~1.9:1 |
| Hero exploded still (`Hero`) | `hero-exploded.jpg` | product on white |

- [ ] **Step 5: Verify every referenced path exists**

Run:
```bash
ls public/media && ls public/figma && ls public/figma/logos | wc -l
```
Expect the six media files, the figma art, and 29 logos. Any missing path will surface as a broken image once sections are built.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "assets: static Figma art + self-hosted media"
```

> **Note (deferred to Task 15):** the raw clips total ~15 MB; compression/`webm` generation happens in the final performance pass, not here, so sections can be verified against real media first.

---

### Task 5: App shell + Navbar

**Files:**
- Create: `src/components/Navbar.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `<Navbar/>` (fixed pill nav); the `App` composition root that later section tasks append to in visual order.

Final target composition (each later task adds its import + element here, in this order):

```tsx
<Navbar />
<main>
  <Hero />                 {/* Task 6 */}
  <VideoScrollTrigger />   {/* Task 7 */}
  <section …><AutoVideo src="/media/video.mp4" …/></section>  {/* Task 5 */}
  <Solution /> <StandsOut /> <Features />                     {/* Task 8 */}
  <HowItWorks />           {/* Task 9 */}
  <Customers />            {/* Task 10 */}
  <Applications />         {/* Task 11 */}
  <Comparison />           {/* Task 12 */}
  <Newsletter />           {/* Task 13 */}
</main>
<Footer />                 {/* Task 14 */}
```

- [ ] **Step 1: Create `src/components/Navbar.tsx`**

```tsx
export default function Navbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-6 sm:px-8">
      <nav className="pointer-events-auto flex w-full max-w-[1312px] items-center justify-between rounded-full bg-ink/95 py-2 pl-6 pr-2 backdrop-blur-md sm:pl-8">
        <a href="#top" className="font-display text-base font-semibold tracking-[0.22em] text-white">
          OXYBLASTER
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
          <a href="#contact" className="rounded-full px-4 py-2 text-sm text-white/90 transition-colors hover:text-white sm:px-5">
            Contact
          </a>
          <a href="#contact" className="rounded-full border border-[#848484] px-4 py-2 text-sm text-white transition-colors hover:border-white hover:bg-white hover:text-ink sm:px-6">
            Download Brochure
          </a>
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Create the App shell with the full-screen operation video**

```tsx
import Navbar from "./components/Navbar";
import AutoVideo from "./components/AutoVideo";

function App() {
  return (
    <div className="min-h-svh bg-white">
      <Navbar />
      <main>
        <section aria-label="Oxyblaster in operation" className="relative h-screen w-full overflow-hidden bg-black">
          <AutoVideo src="/media/video.mp4" className="h-full w-full object-cover" />
        </section>
      </main>
    </div>
  );
}

export default App;
```

- [ ] **Step 3: Verify & commit**

Run: `npm run build`; `npm run dev` → the fixed pill nav floats top-centre over a full-screen looping video. Screenshot at 1440px; confirm the nav pill is dark (`bg-ink/95`), rounded-full, wordmark letter-spacing `0.22em`.

```bash
git add -A && git commit -m "feat: app shell + fixed navbar + operation video section"
```

---

### Task 6: Hero (Figma `328:32`)

**Files:**
- Create: `src/components/Hero.tsx`
- Modify: `src/App.tsx` (add `<Hero/>` as the first child of `<main>`, before the operation-video section)

**Interfaces:**
- Consumes: `/media/hero-exploded.jpg`; CSS classes `blueprint-grid`, `mask-reveal`, `word-rise`, `wordmark-outline`, `product-spin-in`.

Fidelity notes locked in earlier passes: the exploded render is a white-background JPEG, so it must use `mix-blend-multiply` to drop its white onto the page; the wordmark is layered (solid `#2c2c2c` behind + white `wordmark-outline` traced on top); the "Book now" CTA is a **dark filled** pill (`bg-ink`), not outlined; the "Developed by Oxybee Solutions" caption is **italic** serif.

- [ ] **Step 1: Create `src/components/Hero.tsx`**

```tsx
export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden bg-white">
      {/* blueprint grid, revealed by a mask wipe on load */}
      <div className="blueprint-grid mask-reveal pointer-events-none absolute inset-0" />

      {/* soft radial glow, centred on the product */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[657px] w-[657px] -translate-x-1/2 -translate-y-[54%] rounded-full"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(120,120,120,0.26) 0%, rgba(229,229,229,0) 66%)" }} />

      {/* layered wordmark + product, centred slightly above the middle */}
      <div className="relative flex flex-1 items-center justify-center pb-28">
        <div className="relative mx-auto flex w-full max-w-[1440px] items-center justify-center px-4">
          <h1 aria-label="Oxyblaster"
            className="word-rise font-display pointer-events-none select-none whitespace-nowrap text-center font-medium leading-none text-[#2c2c2c]"
            style={{ fontSize: "clamp(3.25rem, 15.8vw, 15rem)" }}>
            OXYBLASTER
          </h1>
          <h1 aria-hidden="true"
            className="wordmark-outline font-display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-medium leading-none text-white"
            style={{ fontSize: "clamp(3.25rem, 15.8vw, 15rem)" }}>
            OXYBLASTER
          </h1>
          {/* exploded product render; white integrates via multiply */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <img src="/media/hero-exploded.jpg" alt="Oxyblaster air diffusion unit, exploded view"
              className="product-spin-in h-[86vh] max-h-[780px] w-auto object-contain mix-blend-multiply" />
          </div>
        </div>

        {/* side labels, anchored to the wordmark's lower edges */}
        <div className="pointer-events-none absolute inset-x-0 top-[58%] mx-auto hidden w-full max-w-[1440px] items-start justify-between px-16 sm:flex">
          <p className="font-display max-w-[20ch] text-xl text-ink lg:text-2xl">Next-generation air diffusion system</p>
          <p className="font-display max-w-[14ch] text-right text-xl text-ink lg:text-2xl">The future of aeration</p>
        </div>
      </div>

      {/* caption + CTA, pinned to the lower area */}
      <div className="relative z-10 mb-14 flex flex-col items-center gap-5">
        <p className="font-display text-base italic text-ink">Developed by Oxybee Solutions</p>
        <a href="#contact" className="rounded-full bg-ink px-14 py-2.5 text-base text-white/80 transition-colors hover:bg-black hover:text-white">
          Book now
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount it** — add `import Hero from "./components/Hero";` and place `<Hero />` as the first child inside `<main>` in `src/App.tsx`.

- [ ] **Step 3: Verify (build + visual + fidelity + motion)**

Run: `npm run build`. Then at 1440px screenshot the hero and compare to frame `328:32`. Checklist: wordmark fills the width with the white outline traced exactly over the dark fill; the exploded unit sits centred with no white box around it (multiply working); CTA is a dark filled pill; caption is italic serif; on load the grid wipes in, the wordmark rises, the product spins up 360°. Run kiyas `compare` (figma `328:32` vs the dev URL; `model: openai` if the provider errors). Then emulate reduced-motion → the hero shows its final state immediately.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: hero section (328:32)"
```

---

### Task 7: VideoScrollTrigger (Figma `328:44`)

**Files:**
- Create: `src/components/VideoScrollTrigger.tsx`
- Modify: `src/App.tsx` (add `<VideoScrollTrigger/>` between `<Hero/>` and the operation-video section)

**Interfaces:**
- Consumes: `useScrollProgress`, `AutoVideo`, `/media/scrolltrigger.mp4`.

The section is `230vh` tall with a sticky `h-screen` inner stage. As you scroll: the headline translates left and fades out while the product clip scales from `0.55`→`1.0` and fades in. Under reduced-motion `useScrollProgress` still works (it is pointer/scroll driven, not animation-driven) but there is no auto-scrubbing beyond user scroll — acceptable because content remains fully reachable.

- [ ] **Step 1: Create `src/components/VideoScrollTrigger.tsx`**

```tsx
import AutoVideo from "./AutoVideo";
import { useScrollProgress } from "../hooks/useScrollProgress";

const clamp = (n: number, min = 0, max = 1) => Math.min(Math.max(n, min), max);

/** Sticky "scrolltrigger": the headline starts centred and slides off left as
 *  you scroll, making room for the product clip, which scales up and autoplays. */
export default function VideoScrollTrigger() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const textX = -progress * 65; // vw
  const textOpacity = 1 - clamp(progress / 0.45);
  const videoScale = 0.55 + 0.45 * clamp(progress / 0.8);
  const videoOpacity = clamp(progress / 0.35);

  return (
    <section ref={ref} className="relative h-[230vh] bg-white">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <h2 className="font-display pointer-events-none absolute max-w-[22ch] px-6 text-center text-4xl leading-tight text-ink sm:text-6xl"
          style={{ transform: `translateX(${textX}vw)`, opacity: textOpacity }}>
          Next-generation air diffusion system
        </h2>
        <div className="absolute aspect-square h-[82vh] max-h-[82vw] overflow-hidden rounded-2xl bg-black shadow-2xl"
          style={{ transform: `scale(${videoScale})`, opacity: videoOpacity }}>
          <AutoVideo src="/media/scrolltrigger.mp4" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount it** — add the import and place `<VideoScrollTrigger />` directly after `<Hero />` in `src/App.tsx`.

- [ ] **Step 3 (Review Focus #3): Verify**

Run: `npm run build`. Scroll through: headline centred → slides left + fades as the clip grows to fill and autoplays once ≥25% in view. Confirm pausing on scroll-out. Simulate a missing `scrolltrigger.mp4` (rename temporarily) → the black rounded panel shows, no console throw (`.play()` rejection swallowed), then restore the file. Reduced-motion: content still reachable by scrolling.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: sticky video scroll-trigger (328:44)"
```

---

### Task 8: Content reveal sections — Solution, StandsOut, Features (about1–3)

Grouped because all three are reveal-only sections sharing the `Reveal` primitive and the `data.ts` arrays; a reviewer evaluates them as one batch. Each ends with its own screenshot check.

**Files:**
- Create: `src/components/Solution.tsx`, `src/components/StandsOut.tsx`, `src/components/Features.tsx`
- Modify: `src/App.tsx` (add the three, in order, after the operation-video section)

**Interfaces:**
- Consumes: `Reveal`, `SectionHeading`, `solutionBenefits`, `standoutCards`, `features`, `/figma/about1-object.png`, `/figma/card1..3.png`.

- [ ] **Step 1: Create `src/components/Solution.tsx`**

```tsx
import { solutionBenefits } from "../data";
import Reveal from "./Reveal";

export default function Solution() {
  return (
    <section className="relative overflow-hidden bg-white py-24 lg:flex lg:min-h-screen lg:items-center lg:py-0">
      <div className="mx-auto grid w-full max-w-[1312px] items-center gap-12 px-6 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal variant="left" className="flex justify-center lg:justify-start">
          <img src="/figma/about1-object.png" alt="Oxyblaster unit in operation"
            className="h-auto w-full max-w-[460px] object-contain" loading="lazy" />
        </Reveal>
        <Reveal variant="fade" className="flex flex-col items-center gap-12 text-center">
          <h2 className="font-display leading-tight text-ink sm:whitespace-nowrap" style={{ fontSize: "clamp(1.9rem, 3.3vw, 2.9rem)" }}>
            Solution with Air Diffusion System
          </h2>
          <ul className="flex max-w-[724px] flex-wrap justify-center gap-x-6 gap-y-3">
            {solutionBenefits.map((b) => (
              <li key={b} className="font-body text-base text-muted before:mr-2 before:content-['•']">{b}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/StandsOut.tsx`** (3 cards, stagger `i*120`ms; card 1 is `contain` with padding, cards 2–3 are `cover`)

```tsx
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { standoutCards } from "../data";

export default function StandsOut() {
  return (
    <section className="flex min-h-screen flex-col justify-center gap-16 bg-white py-24">
      <SectionHeading>Why OXYBLASTER stands out</SectionHeading>
      <div className="mx-auto grid w-full max-w-[1312px] gap-6 px-6 sm:px-8 md:grid-cols-3">
        {standoutCards.map((card, i) => (
          <Reveal key={card.caption} delay={i * 120} className="flex flex-col gap-3.5">
            <div className="flex h-[470px] items-center justify-center overflow-hidden rounded-sm bg-surface">
              <img src={card.img} alt=""
                className={card.fit === "cover" ? "h-full w-full object-cover" : "max-h-full w-auto object-contain p-6"}
                loading="lazy" />
            </div>
            <p className="font-body text-base leading-snug text-muted">{card.caption}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `src/components/Features.tsx`**

```tsx
import { features } from "../data";
import Reveal from "./Reveal";

export default function Features() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-white py-24">
      <Reveal className="mx-auto flex w-full max-w-[1312px] flex-col items-center gap-12 px-6 text-center sm:px-8">
        <h2 className="font-display text-4xl text-ink sm:text-5xl">Features</h2>
        <ul className="flex max-w-[849px] flex-wrap justify-center gap-x-6 gap-y-3">
          {features.map((f) => (
            <li key={f} className="font-body text-base text-muted before:mr-2 before:content-['•']">{f}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 4: Mount all three** — import and place `<Solution /> <StandsOut /> <Features />` after the operation-video section in `src/App.tsx`.

- [ ] **Step 5: Verify & commit**

Run: `npm run build`. Screenshot each at 1440px vs its Figma frame: Solution object slides from the left and the bullet list wraps centred; StandsOut cards rise with a visible stagger (card 1 letterboxed on `surface`, 2–3 fill); Features bullets wrap centred. kiyas pass on each. Reduced-motion: all three at final state.

```bash
git add -A && git commit -m "feat: solution, stands-out, features sections (about1-3)"
```

---

### Task 9: HowItWorks — annotated scroll-drawn path (Figma `328:88` / about4)

The signature interaction: an inline dashed SVG whose bright cyan stroke **draws itself** as you scroll (via `stroke-dashoffset` scrubbed by `useScrollProgress`), with five callouts fading in as the line reaches them and two looping clips. Desktop-only diagram (`hidden lg:block`); a stacked flow renders on mobile.

**Files:**
- Create: `src/components/HowItWorks.tsx`
- Modify: `src/App.tsx` (add `<HowItWorks/>` after `<Features/>`)

**Interfaces:**
- Consumes: `useScrollProgress`, `AutoVideo`, `diagramPoints`, `/figma/hero-product.png`, `/media/about4-chart.mp4`, `/media/about4-bubble.mp4`.

- [ ] **Step 1: Create the file with the path data + callout anchors**

`LINE_D` is the exact path geometry — copy the full `d` string from `public/figma/about4-line.svg` (created in Task 4 Step 3). The callout anchors below are tuned to the design; `at` is the scroll-progress value at which each fades in.

```tsx
import { useEffect, useRef, useState } from "react";
import AutoVideo from "./AutoVideo";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { diagramPoints } from "../data";

// Full path geometry — copy verbatim from public/figma/about4-line.svg
const LINE_D = "M533.556 1.0003C528.701 1.0003 518.95 6.52439 508.833 10.4059C498.435 14.3954 486.894 19.1209 473.272 29.2065C459.983 39.0461 438.056 38.6226 424.801 44.5756C412.483 50.1071 399.011 48.4152 385.4 52.6001C365.005 58.8705 341.887 55.404 321.957 57.1408C287.466 60.1464 273.464 63.0624 261.579 67.2473C250.216 71.2486 235.8 73.5246 222.524 82.2187C211.928 89.1575 201.61 95.8301 188.354 105.581C174.613 115.689 160.472 120.939 148.932 126.872C137.316 132.843 121.427 141.153 108.83 150.924C98.217 159.158 84.4324 165.551 72.5682 174.987C58.6184 186.083 46.7683 194.845 35.5946 205.328C26.1998 214.142 20.2361 226.232 12.9125 235.668C5.13263 245.693 0.692594 258.999 1.01692 274.013C1.27495 285.957 16.6789 291.809 23.6677 301.581C30.6565 311.352 40.4073 318.299 47.7308 327.736C55.6717 337.969 60.6203 351.778 70.0468 359.479C78.6346 366.494 85.0182 380.361 98.2739 390.51C111.101 400.33 121.971 408.986 142.194 420.84C154.643 428.136 164.531 436.899 175.705 444.223C187.847 452.181 202.907 458.493 213.369 465.503C223.52 472.304 233.582 478.748 240.247 488.844C247.492 499.821 243.396 510.826 243.061 516.402C242.308 528.936 227.388 542.191 217.983 555.102C209.525 566.712 196.044 572.908 180.34 583.705C167.076 592.825 152.102 598.018 138.48 604.64C124.255 611.556 114.438 621.035 102.553 626.967C89.2212 633.621 74.6816 643.34 64.5332 651.375C55.1679 658.79 45.3873 669.831 34.1927 679.613C23.6089 688.861 25.0905 715.739 31.3365 734.707C35.2038 746.451 49.4467 752.148 58.8835 760.873C70.5248 771.637 86.3992 776.587 96.5476 782.509C106.014 788.033 119.879 787.05 130.372 793.662C143.343 801.835 161.728 800.985 173.958 804.145C186.509 807.387 221.488 806.593 246.492 810.067C258.772 811.772 272.627 817.725 286.594 821.575C301.598 825.711 313.807 833.753 333.643 836.923C352.013 839.859 366.746 858.151 380.42 867.243C390.55 873.978 398.216 883.261 402.066 897.908C405.916 912.555 407.297 929.294 408.354 943.941C409.213 955.843 408.009 968.339 404.19 980.225C397.77 1000.2 403.112 1031.82 407.988 1044.73C413.387 1059.03 421.944 1073.67 427.856 1085.19C435.553 1100.19 444.25 1110.63 452.609 1120.77C462.6 1132.9 474.925 1137.16 485.042 1142.07C495.238 1147.01 505.6 1155.28 517.465 1163.32C533.354 1174.1 546.738 1181.81 559.669 1193.3C564.95 1197.99 567.704 1202.76 572.235 1205.18C574.419 1206.35 574.693 1209.68 573.668 1211.8C568.823 1221.78 558.707 1229.23 548.245 1235.52C536.745 1242.45 523.847 1247.39 512.328 1256.08C499.562 1265.72 485.513 1275.26 472.571 1281.9C459.354 1288.69 448.518 1294.8 434.572 1299.34C416.889 1305.1 406.669 1310.16 397.233 1316.77C387.124 1323.86 375.283 1331.04 364.109 1340.48C352.935 1349.92 343.875 1354.79 336.918 1357.93C333.413 1359 329.96 1359 326.403 1359";

const points = [
  { text: diagramPoints[0], left: "20%", top: "23%", at: 0.12 },
  { text: diagramPoints[1], left: "37.5%", top: "36%", at: 0.3 },
  { text: diagramPoints[2], left: "21.5%", top: "48.5%", at: 0.46 },
  { text: diagramPoints[3], left: "46.6%", top: "59%", at: 0.62 },
  { text: diagramPoints[4], left: "58.7%", top: "76.5%", at: 0.78 },
];

const clamp = (n: number) => Math.min(Math.max(n, 0), 1);
```

- [ ] **Step 2: Add the component — desktop diagram**

The second `<path>` carries the live draw: once mounted, read `getTotalLength()` into state, set `strokeDasharray` to the full length and `strokeDashoffset` to `len * (1 - progress)` so the stroke reveals from 0→full as `progress` 0→1.

```tsx
export default function HowItWorks() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, []);

  return (
    <section className="bg-white py-24">
      {/* Desktop: annotated diagram with a scroll-drawn path */}
      <div ref={ref} className="mx-auto hidden w-full max-w-[1440px] lg:block">
        <div className="relative mx-auto aspect-[1440/1760] w-full">
          <img src="/figma/hero-product.png" alt="Oxyblaster unit"
            className="absolute object-contain" style={{ left: "66%", top: "29%", width: "34%" }} />

          <svg viewBox="0 0 576 1360" fill="none" className="absolute"
            style={{ left: "20.7%", top: "9%", width: "39.8%" }} aria-hidden="true">
            <path d={LINE_D} stroke="#47D8FE" strokeOpacity={0.2} strokeWidth={2} strokeDasharray="4 4" strokeLinecap="round" />
            <path ref={pathRef} d={LINE_D} stroke="#47D8FE" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: len || undefined, strokeDashoffset: len ? len * (1 - progress) : undefined }} />
          </svg>

          <div className="absolute aspect-video overflow-hidden rounded-md shadow-lg" style={{ left: "58.5%", top: "3%", width: "34%" }}>
            <AutoVideo src="/media/about4-chart.mp4" className="h-full w-full object-cover" />
          </div>
          <div className="absolute aspect-video overflow-hidden rounded-md shadow-lg" style={{ left: "0.6%", top: "75%", width: "41.7%" }}>
            <AutoVideo src="/media/about4-bubble.mp4" className="h-full w-full object-cover" />
          </div>

          {points.map((p, i) => (
            <p key={i}
              className="font-display absolute max-w-[26ch] text-2xl leading-snug text-ink transition-opacity duration-500 before:mr-2 before:content-['·']"
              style={{ left: p.left, top: p.top, opacity: clamp((progress - p.at + 0.14) / 0.14) }}>
              {p.text}
            </p>
          ))}
        </div>
      </div>
```

- [ ] **Step 3 (Review Focus #4): Add the mobile stacked fallback and close the component**

```tsx
      {/* Mobile: stacked flow */}
      <div className="mx-auto flex max-w-[560px] flex-col gap-8 px-6 lg:hidden">
        <AutoVideo src="/media/about4-chart.mp4" className="aspect-video w-full rounded-md object-cover" />
        <ul className="flex flex-col gap-5 border-l-2 border-dashed border-accent pl-6">
          {points.map((p, i) => (
            <li key={i} className="font-display text-xl leading-snug text-ink">· {p.text}</li>
          ))}
        </ul>
        <AutoVideo src="/media/about4-bubble.mp4" className="aspect-video w-full rounded-md object-cover" />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Mount it** — import and place `<HowItWorks />` after `<Features />` in `src/App.tsx`.

- [ ] **Step 5: Verify (build + scroll draw + mobile + motion)**

Run: `npm run build`. On desktop at 1440px, scroll through: the cyan line draws progressively over the faint dashed guide, each callout fades in as the line passes it, both clips loop. Compare to frame `328:88` with kiyas. At a 390px viewport (Review Focus #4): the desktop diagram is hidden and the stacked flow (chart → dashed bullet list → bubble) renders with no horizontal overflow. Reduced-motion: `progress` reflects scroll but with reduced-motion the draw simply tracks scroll position; confirm the final frame shows the full line and all callouts when scrolled to the end.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: how-it-works scroll-drawn diagram (328:88)"
```

---

### Task 10: Customers — logo marquee rows (about5)

**Files:**
- Create: `src/components/Customers.tsx`
- Modify: `src/App.tsx` (add `<Customers/>` after `<HowItWorks/>`)

**Interfaces:**
- Consumes: `Marquee`, `logoRows`, `/figma/logos/*.png`.

- [ ] **Step 1: Create `src/components/Customers.tsx`** (rows alternate direction; each row a little slower than the last)

```tsx
import Marquee from "./Marquee";
import { logoRows } from "../data";

export default function Customers() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-16 bg-white py-24">
      <h2 className="font-display text-4xl text-ink sm:text-5xl">Key customers</h2>
      <div className="flex w-full flex-col gap-10">
        {logoRows.map((row, i) => (
          <Marquee key={i} direction={i % 2 === 0 ? "left" : "right"} duration={38 + i * 6}>
            {row.map((src, j) => (
              <img key={`${i}-${j}`} src={src} alt="Customer logo"
                className="mx-10 h-14 w-auto object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
                loading="lazy" />
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount, verify, commit** — add `<Customers />` after `<HowItWorks />`. Run `npm run build`; confirm four rows scroll in alternating directions, seamless loop (no visible seam), pause on hover, logos grayscale→color on hover. Reduced-motion: rows static, all logos visible.

```bash
git add -A && git commit -m "feat: customers logo marquee (about5)"
```

---

### Task 11: Applications — photos + video (about6)

**Files:**
- Create: `src/components/Applications.tsx`
- Modify: `src/App.tsx` (add `<Applications/>` after `<Customers/>`)

**Interfaces:**
- Consumes: `SectionHeading`, `Reveal`, `AutoVideo`, `/figma/app1.png`, `/figma/app2.png`, `/media/applications.mp4`, poster `/figma/app-video.png`.

- [ ] **Step 1: Create `src/components/Applications.tsx`**

```tsx
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import AutoVideo from "./AutoVideo";

export default function Applications() {
  return (
    <section className="flex flex-col justify-center gap-16 bg-white py-24">
      <SectionHeading>Industry applications</SectionHeading>
      <div className="mx-auto flex w-full max-w-[1312px] flex-col gap-[18px] px-6 sm:px-8">
        <div className="grid gap-[18px] sm:grid-cols-2">
          <Reveal variant="left">
            <img src="/figma/app1.png" alt="Oxyblaster industry application"
              className="h-[288px] w-full rounded-sm object-cover" loading="lazy" />
          </Reveal>
          <Reveal variant="right">
            <img src="/figma/app2.png" alt="Oxyblaster industry application"
              className="h-[288px] w-full rounded-sm object-cover" loading="lazy" />
          </Reveal>
        </div>
        <Reveal variant="up">
          <AutoVideo src="/media/applications.mp4" poster="/figma/app-video.png"
            className="h-[420px] w-full rounded-sm object-cover lg:h-[691px]" />
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount, verify, commit** — add `<Applications />` after `<Customers />`. Run `npm run build`; the two photos slide in from opposite sides, the wide video sits below and autoplays in view (poster shows before it plays). kiyas vs about6. Reduced-motion: final state, poster visible.

```bash
git add -A && git commit -m "feat: industry applications (about6)"
```

---

### Task 12: Comparison table (about7)

**Files:**
- Create: `src/components/Comparison.tsx`
- Modify: `src/App.tsx` (add `<Comparison/>` after `<Applications/>`)

**Interfaces:**
- Consumes: `Reveal`, `comparisonRows`.

- [ ] **Step 1: Create `src/components/Comparison.tsx`**

```tsx
import { comparisonRows } from "../data";
import Reveal from "./Reveal";

export default function Comparison() {
  return (
    <section className="flex min-h-screen items-center bg-white py-24">
      <Reveal variant="fade" className="mx-auto w-full max-w-[1312px] px-6 sm:px-8">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="align-top">
              <th className="font-display w-[24%] pb-10 pr-6 text-xl font-normal tracking-[0.06em] text-ink sm:text-2xl">What matters</th>
              <th className="font-display w-[38%] border-l border-line px-6 pb-10 text-xl font-normal tracking-[0.06em] text-ink sm:text-2xl">Traditional diffusers</th>
              <th className="font-display w-[38%] border-l border-line px-6 pb-10 text-xl font-normal tracking-[0.06em] text-ink sm:text-2xl">Oxyblaster</th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.matter} className="align-top">
                <td className="font-body py-5 pr-6 text-base text-ink sm:text-xl">{row.matter}</td>
                <td className="font-body border-l border-line px-6 py-5 text-base text-ink sm:text-xl">{row.traditional}</td>
                <td className="font-body border-l border-line px-6 py-5 text-base text-ink sm:text-xl">{row.oxyblaster}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="font-body mt-8 text-sm text-muted">
          * Up to 30% less power &nbsp;·&nbsp; ** H₂S cut by 99.8% &nbsp;·&nbsp; *** Maintenance-free diffuser
        </p>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Mount, verify, commit** — add `<Comparison />` after `<Applications />`. Run `npm run build`; confirm the three-column ruled table with vertical `border-line` dividers, serif headers tracked `0.06em`, body in Satoshi, and the three footnotes (verbatim, with `H₂S` and `99.8%`). kiyas vs about7.

```bash
git add -A && git commit -m "feat: comparison table (about7)"
```

---

### Task 13: Newsletter / CTA (`#contact`)

**Files:**
- Create: `src/components/Newsletter.tsx`
- Modify: `src/App.tsx` (add `<Newsletter/>` after `<Comparison/>` — the last child of `<main>`)

**Interfaces:**
- Consumes: `Reveal`, `/figma/hero-product.png`.

Note: the form is intentionally **inert** (`onSubmit={(e) => e.preventDefault()}`) — there is no backend, so no network endpoint and nothing to secure here. If real signup capture is wanted later, that is a separate task (a server route or a third-party form endpoint) and would introduce input-validation and anti-abuse concerns worth flagging then.

- [ ] **Step 1: Create the file — copy + inert form**

```tsx
import Reveal from "./Reveal";

export default function Newsletter() {
  return (
    <section id="contact" className="relative flex min-h-screen flex-col justify-center overflow-hidden"
      style={{ background: "radial-gradient(circle at 84% 69%, rgba(168,168,168,0.9) 0%, rgba(255,255,255,1) 62%)" }}>
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 px-6 pb-40 pt-28 sm:px-16 lg:grid-cols-2">
        <Reveal variant="fade" className="flex flex-col gap-20">
          <div className="flex max-w-[671px] flex-col gap-4">
            <h2 className="font-display text-4xl leading-tight text-ink sm:text-5xl">Next-generation air diffusion system</h2>
            <p className="font-body text-base text-muted">
              Oxyblaster dissolves more oxygen with microbubbles, cutting aeration power by up to 30%. Backed by a 10-year warranty.
            </p>
          </div>
          <form className="flex w-full max-w-[436px] flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <p className="font-body text-xl text-ink">Get the latest updates.</p>
            <p className="font-body text-sm text-muted">Subscribe to get updates on Oxyblaster, product launches, and more.</p>
            <div className="mt-2 flex items-center justify-between border-b border-black/65 pb-2">
              <input type="email" required placeholder="Email address" aria-label="Email address"
                className="font-body w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/60" />
              <button type="submit"
                className="font-body shrink-0 rounded-full border border-black/65 px-4 py-1 text-sm text-ink transition-colors hover:bg-ink hover:text-white">
                Book now
              </button>
            </div>
          </form>
        </Reveal>
```

- [ ] **Step 2: Add the product image + oversized wordmark and close**

```tsx
        <Reveal variant="right" className="flex justify-center lg:justify-end">
          <img src="/figma/hero-product.png" alt="Oxyblaster air diffusion unit"
            className="h-auto w-full max-w-[540px] object-contain"
            style={{ filter: "grayscale(1) brightness(1.05) contrast(1.03)" }} loading="lazy" />
        </Reveal>
      </div>

      {/* oversized solid wordmark */}
      <h2 aria-hidden="true"
        className="font-display pointer-events-none absolute inset-x-0 bottom-6 select-none whitespace-nowrap text-center font-medium leading-none text-[#141414]"
        style={{ fontSize: "clamp(3rem, 15.5vw, 14rem)" }}>
        OXYBLASTER
      </h2>
    </section>
  );
}
```

- [ ] **Step 3: Mount, verify, commit** — add `<Newsletter />` as the final child of `<main>`. Run `npm run build`; confirm the radial-gray glow lower-right, the inert form (typing + submit does nothing, no navigation), the grayscale product on the right, and the oversized `#141414` wordmark pinned to the bottom. The anchor `#contact` is the target of every "Book now"/"Contact" link. kiyas vs the CTA frame.

```bash
git add -A && git commit -m "feat: newsletter / contact CTA section"
```

---

### Task 14: Footer

**Files:**
- Create: `src/components/Footer.tsx`
- Modify: `src/App.tsx` (add `<Footer/>` after `</main>`)

**Interfaces:**
- Consumes: nothing beyond its own link list.

- [ ] **Step 1: Create `src/components/Footer.tsx`**

```tsx
const links = [
  { label: "HOME", href: "#top" },
  { label: "GO TO MAIN WEBSITE", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative flex min-h-[591px] flex-col justify-start overflow-hidden bg-footer">
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center gap-6 px-6 pt-16 sm:px-16 md:flex-row md:justify-between">
        <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
          {links.map((l) => (
            <a key={l.label} href={l.href}
              className="font-body rounded-full px-2.5 py-1.5 text-sm font-medium text-[#767676] transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
        <p className="font-body text-sm text-[#767676]">OXYBLASTER ©2026</p>
      </div>
      <h2 aria-hidden="true"
        className="font-display pointer-events-none absolute inset-x-0 bottom-0 select-none whitespace-nowrap text-center font-medium leading-none text-[#2a2a2a]"
        style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}>
        OXYBLASTER
      </h2>
    </footer>
  );
}
```

- [ ] **Step 2: Mount, verify, commit** — add `<Footer />` after `</main>`. Run `npm run build`; confirm the near-black footer, muted links turning white on hover, copyright, and the oversized `#2a2a2a` backdrop wordmark bleeding off the bottom edge. This completes the full-page composition.

```bash
git add -A && git commit -m "feat: footer"
```

---

### Task 15: Whole-page fidelity, accessibility, reduced-motion, performance & security pass

With all sections mounted, this task hardens the page to ship-ready. It is the one place the five Review Focus conditions are checked end-to-end.

**Files:**
- Modify: `public/media/*` (compressed derivatives), section components only if a diff/audit requires it.

- [ ] **Step 1: Full-page build & lint gate**

Run: `npm run build` and `npm run lint` → both clean. Fix any `tsc`/oxlint findings before proceeding.

- [ ] **Step 2: Full-page visual fidelity (kiyas across every frame)**

For each section run the `kiyas` MCP `compare` (figma frame vs the running dev URL, scrolled to the section). Frames: hero `328:32`, scrolltrigger `328:44`, about1–3, about4 `328:88`, about5–7, CTA, footer. Record discrepancies; fix spacing/color/type mismatches at their source component. Re-run until no high/medium issues remain. If kiyas errors on its provider, pass `model: openai` (codex) — the `claude` provider fails under MCP (shell-alias not inherited).

- [ ] **Step 3 (Review Focus #1): Reduced-motion full-page render**

Emulate `prefers-reduced-motion: reduce` and scroll the whole page. Confirm: every `Reveal` is at opacity 1 with no transform; hero grid/wordmark/product show final state (no keyframes); marquees are static with all logos visible; the about4 line and callouts resolve to their final state at the section end; videos show poster/first frame. Nothing is permanently hidden or clipped.

- [ ] **Step 4 (Review Focus #4): Responsive pass**

Screenshot at 390px, 768px, 1024px, 1440px. Confirm: wordmarks clamp without horizontal overflow; grids collapse (Solution, Applications, Newsletter → single column); the about4 desktop diagram is replaced by the stacked mobile flow at <1024px; the nav pill stays within the viewport. Fix overflow with the existing responsive classes only.

- [ ] **Step 5: Media compression (the ~15 MB caveat)**

The raw clips total ~15 MB. Produce compressed web deliverables (requires ffmpeg; install if absent). For each `.mp4`, generate an H.264 MP4 (reasonable CRF) and a VP9 `.webm`, and add a `<source>` ordering in `AutoVideo` (webm first, mp4 fallback) if you add webm. Example:

```bash
ffmpeg -i public/media/applications.mp4 -vcodec libx264 -crf 26 -preset slow -an public/media/applications.opt.mp4
ffmpeg -i public/media/applications.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -an public/media/applications.webm
```

Replace originals with optimized versions (keep the canonical filenames so component `src`s don't change), confirm each still autoplays in view, and re-check total `public/media` size dropped meaningfully.

- [ ] **Step 6: Accessibility pass**

Verify: every informative `<img>` has a meaningful `alt` and decorative ones use `alt=""`; the single `<h1>` is the hero wordmark; headings are ordered; the email `<input>` has an accessible label; focus states are visible on nav/CTA/links; color contrast of `text-muted` (#717171) on white meets AA for its size. Fix issues in place.

- [ ] **Step 7: Performance sanity**

Run a production `npm run build` and `npm run preview`; spot-check with Lighthouse (or the `browse` CLI). Confirm images use `loading="lazy"` below the fold (already set), videos `preload="metadata"`, and no layout shift from the wordmarks. Note bundle size; it should be small (no animation library — that's the point).

- [ ] **Step 8: Optional gstack gates (workspace ethos)**

If using the installed gstack workflow, run `/review` on the branch, `/qa <preview-url>` against the production preview, and `/cso` for a security scan (expected: clean — static site, inert form, no secrets, no backend). Address anything surfaced.

- [ ] **Step 9: Final commit**

```bash
git add -A && git commit -m "chore: whole-page fidelity, a11y, reduced-motion, perf & security pass"
```

---

## Self-Review

Checked against the spec with fresh eyes:

- **Spec coverage:** All thirteen sections of frame `328:31` map to tasks — Navbar/operation-video (T5), Hero `328:32` (T6), scrolltrigger `328:44` (T7), about1–3 (T8), about4 `328:88` (T9), about5 (T10), about6 (T11), about7 (T12), CTA (T13), Footer (T14). Design system (T1), motion system (T2), content (T3), assets (T4), and the hardening pass (T15) cover the cross-cutting requirements. No section unaccounted for.
- **Placeholder scan:** No `TBD`/"handle edge cases"/"similar to Task N". The one external reference — `LINE_D` copied from `public/figma/about4-line.svg` — points to a concrete artifact created in Task 4, not a placeholder.
- **Type consistency:** Hook/primitive signatures in the Task 2 Interfaces block match their usage in every section (`useScrollProgress` → `{ ref, progress }` used in T7/T9; `Reveal` `variant`/`delay` props used in T6/T8/T11/T12/T13; `AutoVideo` `src`/`poster` used in T5/T7/T9/T11; `standoutCards.fit` is `"contain" | "cover"` via `as const` in T3, consumed in T8).
- **Review Focus:** Each of the five conditions is pinned to an owning task's verification — reduced-motion (T2 CSS/hooks + T3-check in T15 S3), serif fallback (T1 S4), video-load/autoplay-rejection (T2 S8 + T7 S3), narrow viewport (T9 S5 + T15 S4), autoplay muted+playsInline (T2 S8). None left unowned.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-10-11-oxyblaster-landing-page.md`. Please review the plan. Which execution approach would you prefer?

- **Subagent-driven** — a fresh subagent implements each task and a fresh reviewer checks it before the next starts, then a whole-branch review at the end. Most thorough; costs a fresh context per task and per review.
- **Native** — I implement every task myself in this session, then one fresh reviewer on the most capable model checks the whole branch. Cheapest and fastest; no independent review until the end.

**For this plan I recommend Native, because the tasks are mostly independent single-file sections whose hard decisions (tokens, motion primitives, exact markup) are already pinned in the plan, a shipped mistake is cosmetic rather than destructive, and the whole thing is one person-sized feature — so per-task fresh contexts would cost more than they'd catch.** Does the plan capture what you want, and which approach should we use?

