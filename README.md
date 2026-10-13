# Oxybee Solutions — Oxyblaster

> Next-generation air diffusion system landing page.

A high-fidelity landing page for Oxyblaster built with React 19, TypeScript, Vite, and Tailwind CSS v4, featuring hand-crafted scroll-driven reveals and micro-interactions.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` tokens)
- **Typography:** Playfair Display (editorial serif) & Satoshi (clean sans-serif)
- **Motion:** Custom React hooks (`useInView`, `useScrollProgress`, `useParallax`) and CSS transitions without external animation runtime libraries

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

### Production Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Features

- **Hero & Product Showcase:** Mask wipe blueprint grid with layered product view
- **Solution Intro:** Full-viewport sliding-text-reveal heading animation with scroll-scrubbed zoom transition
- **Solution Readout:** Sticky scroll-pinned feature readout highlighting Oxyblaster capabilities
- **Interactive Demonstrations & Animations:** Auto-playing video and diagrammatic breakdowns
- **Comparison & Specifications:** Comprehensive side-by-side performance comparison
- **Responsive & Accessible:** Fully optimized across mobile, tablet, and desktop with graceful `prefers-reduced-motion` fallbacks
