import { comparisonRows } from "../data";
import Reveal from "./Reveal";

export default function Comparison() {
  return (
    <section className="flex items-center bg-white py-16 md:min-h-screen md:py-24">
      <Reveal variant="fade" className="mx-auto w-full max-w-[1312px] px-6 sm:px-8">
        {/* Mobile: stacked cards */}
        <div className="flex flex-col gap-6 md:hidden">
          {comparisonRows.map((row) => (
            <div
              key={row.matter}
              className="border-t border-line pt-4"
            >
              <h3 className="font-display mb-3 text-xl tracking-[0.04em] text-ink">
                {row.matter}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-body mb-1 text-xs uppercase tracking-wide text-muted">
                    Traditional
                  </p>
                  <p className="font-body text-sm text-ink">{row.traditional}</p>
                </div>
                <div>
                  <p className="font-body mb-1 text-xs uppercase tracking-wide text-muted">
                    Oxyblaster
                  </p>
                  <p className="font-body text-sm text-ink">{row.oxyblaster}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <table className="hidden w-full border-collapse text-left md:table">
          <thead>
            <tr className="align-top">
              <th className="font-display w-[24%] pb-10 pr-6 text-xl font-normal tracking-[0.06em] text-ink sm:text-2xl">
                What matters
              </th>
              <th className="font-display w-[38%] border-l border-line px-6 pb-10 text-xl font-normal tracking-[0.06em] text-ink sm:text-2xl">
                Traditional diffusers
              </th>
              <th className="font-display w-[38%] border-l border-line px-6 pb-10 text-xl font-normal tracking-[0.06em] text-ink sm:text-2xl">
                Oxyblaster
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.matter} className="align-top">
                <td className="font-body py-5 pr-6 text-base text-ink sm:text-xl">
                  {row.matter}
                </td>
                <td className="font-body border-l border-line px-6 py-5 text-base text-ink sm:text-xl">
                  {row.traditional}
                </td>
                <td className="font-body border-l border-line px-6 py-5 text-base text-ink sm:text-xl">
                  {row.oxyblaster}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="font-body mt-8 text-sm text-muted">
          * Up to 30% less power &nbsp;·&nbsp; ** H₂S cut by 99.8% &nbsp;·&nbsp;
          *** Maintenance-free diffuser
        </p>
      </Reveal>
    </section>
  );
}
