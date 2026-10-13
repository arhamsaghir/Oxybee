import Marquee from "./Marquee";
import { logoRows } from "../data";

export default function Customers() {
  return (
    <section className="flex flex-col items-center justify-center gap-12 bg-white py-16 md:min-h-screen md:gap-16 md:py-24">
      <h2 className="font-display text-4xl text-ink sm:text-5xl">Key customers</h2>

      <div className="flex w-full flex-col gap-10">
        {logoRows.map((row, i) => (
          <Marquee
            key={i}
            direction={i % 2 === 0 ? "left" : "right"}
            duration={38 + i * 6}
          >
            {row.map((src, j) => (
              <img
                key={`${i}-${j}`}
                src={src}
                alt="Customer logo"
                className="mx-10 h-14 w-auto object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
                loading="lazy"
              />
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
