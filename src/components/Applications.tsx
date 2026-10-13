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
            <img
              src="/figma/app1.png"
              alt="Oxyblaster industry application"
              className="h-[288px] w-full rounded-sm object-cover"
              loading="lazy"
            />
          </Reveal>
          <Reveal variant="right">
            <img
              src="/figma/app2.png"
              alt="Oxyblaster industry application"
              className="h-[288px] w-full rounded-sm object-cover"
              loading="lazy"
            />
          </Reveal>
        </div>
        <Reveal variant="up">
          <AutoVideo
            src="/media/applications.mp4"
            poster="/figma/app-video.png"
            className="h-[420px] w-full rounded-sm object-cover lg:h-[691px]"
          />
        </Reveal>
      </div>
    </section>
  );
}
