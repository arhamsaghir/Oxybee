import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { standoutCards } from "../data";

export default function StandsOut() {
  return (
    <section className="flex flex-col justify-center gap-12 bg-white py-16 md:min-h-screen md:gap-16 md:py-24">
      <SectionHeading>Why OXYBLASTER stands out</SectionHeading>

      <div className="mx-auto grid w-full max-w-[1312px] gap-6 px-6 sm:px-8 md:grid-cols-3">
        {standoutCards.map((card, i) => (
          <Reveal key={card.caption} delay={i * 120} className="flex flex-col gap-3.5">
            <div className="flex h-[470px] items-center justify-center overflow-hidden rounded-sm bg-surface">
              <img
                src={card.img}
                alt=""
                className={
                  card.fit === "cover"
                    ? "h-full w-full object-cover"
                    : "max-h-full w-auto object-contain p-6"
                }
                loading="lazy"
              />
            </div>
            <p className="font-body text-base leading-snug text-muted">
              {card.caption}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
