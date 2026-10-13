type Props = {
  children: React.ReactNode;
  className?: string;
};

/** The small ruled sub-heading used above several sections. */
export default function SectionHeading({ children, className = "" }: Props) {
  return (
    <div className={`mx-auto w-full max-w-[1312px] px-6 sm:px-8 ${className}`}>
      <div className="h-px w-full bg-line" />
      <h2 className="font-display mt-3 text-xl tracking-[0.06em] text-ink">
        {children}
      </h2>
    </div>
  );
}
