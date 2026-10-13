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
export default function Reveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
}: Props) {
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
