type Props = {
  children: React.ReactNode;
  direction?: "left" | "right";
  /** seconds for one full loop */
  duration?: number;
  className?: string;
};

/**
 * Infinite horizontal ticker. The children are rendered twice back-to-back
 * and the track is translated by -50%, so the loop is seamless. Pauses on
 * hover; disabled under prefers-reduced-motion (see index.css).
 */
export default function Marquee({
  children,
  direction = "left",
  duration = 40,
  className = "",
}: Props) {
  return (
    <div className={`marquee w-full overflow-hidden ${className}`}>
      <div
        className={`marquee-track marquee-${direction}`}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
