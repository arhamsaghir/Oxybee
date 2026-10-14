import { useMemo, useState } from "react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import DepthCarousel from "./DepthCarousel";
import { standoutCards } from "../data";

export default function StandsOut() {
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselItems = useMemo(
    () =>
      standoutCards.map((card) => ({
        image: card.img,
        alt: card.caption,
        caption: card.caption,
      })),
    [],
  );

  return (
    <section className="flex flex-col justify-center gap-10 bg-white py-16 md:min-h-screen md:gap-12 md:py-24">
      <SectionHeading>Why OXYBLASTER stands out</SectionHeading>

      <Reveal className="mx-auto flex w-full max-w-[1312px] flex-col items-center gap-8 px-4 sm:px-8">
        <div className="relative h-[480px] w-full sm:h-[520px] md:h-[560px]">
          <DepthCarousel
            items={carouselItems}
            cardWidth={340}
            cardHeight={430}
            radius={14}
            depth={210}
            spread={95}
            tilt={20}
            tiltDirection="right"
            perspective={1400}
            visibleCards={3}
            falloff={0.22}
            blur={5}
            autoplay={true}
            autoplayDelay={3500}
            loop={true}
            showControls={true}
            showIndicators={true}
            onChange={(idx) => setActiveIndex(idx)}
            className="w-full"
          />
        </div>

        {/* Active slide caption & editorial index */}
        <div className="flex max-w-xl flex-col items-center gap-2 px-4 text-center">
          <span className="font-body text-xs tracking-widest text-muted uppercase">
            Feature {String(activeIndex + 1).padStart(2, "0")} / {String(standoutCards.length).padStart(2, "0")}
          </span>
          <p className="min-h-[3rem] font-body text-base text-ink-strong sm:text-lg">
            {standoutCards[activeIndex]?.caption}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
