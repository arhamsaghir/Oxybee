import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  /** play/pause as it enters/leaves the viewport (default true) */
  autoPlayInView?: boolean;
};

/**
 * Muted, looping, inline video that starts playing when it scrolls into
 * view and pauses when it leaves — per the "autoplay on scroll entry"
 * annotations. Falls back to the poster frame until the clip can play.
 */
export default function AutoVideo({
  src,
  poster,
  className = "",
  autoPlayInView = true,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !autoPlayInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [autoPlayInView]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
