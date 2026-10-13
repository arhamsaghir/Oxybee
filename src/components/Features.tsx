import { features } from "../data";
import Reveal from "./Reveal";

export default function Features() {
  return (
    <section className="flex flex-col items-center justify-center bg-white py-16 md:min-h-screen md:py-24">
      <Reveal className="mx-auto flex w-full max-w-[1312px] flex-col items-center gap-12 px-6 text-center sm:px-8">
        <h2 className="font-display text-4xl text-ink sm:text-5xl">Features</h2>

        <ul className="flex max-w-[849px] flex-wrap justify-center gap-x-6 gap-y-3">
          {features.map((f) => (
            <li
              key={f}
              className="font-body text-base text-muted before:mr-2 before:content-['•']"
            >
              {f}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
