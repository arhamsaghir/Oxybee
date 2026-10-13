import { useEffect, useRef, useState } from "react";

/**
 * Scroll progress (0→1) across a tall container that has a sticky child.
 * 0 when the container's top hits the top of the viewport, 1 once it has
 * been scrolled through its full extra height. Used to scrub the video
 * scroll-trigger layout shift and the SVG path draw.
 */
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
      if (distance <= 0) {
        setProgress(0);
        return;
      }
      const p = Math.min(Math.max(-rect.top / distance, 0), 1);
      setProgress(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

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
