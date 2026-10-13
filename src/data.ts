// Content extracted from the Oxyblaster Figma (node 328:31).

export const solutionHeading = "Solution with Air Diffusion System";

export const solutionBenefits = [
  "No replacement upto 10 years",
  "High rate oxygen transfer",
  "Save 30% energy",
  "Sweeps sludge from the bottom preventing accumulation",
  "No odour generation and 99% H₂S removal",
  "Maintenance free diffuser",
  "10 years warranty",
];

export const standoutCards = [
  {
    img: "/figma/card1.png",
    caption: "Inhaling sludge and water from bottom and giving strong impact",
    fit: "contain" as const,
  },
  {
    img: "/figma/card2.png",
    caption: "Creation of microbubbles by specific blades",
    fit: "cover" as const,
  },
  {
    img: "/figma/card3.png",
    caption: "Crushing sludge helps microorganism to metabolize efficiently",
    fit: "cover" as const,
  },
];

export const features = [
  "Reduced Power Consumption By Upto 30%.",
  "Reduced Sludge Output By 20%.",
  "Zero Odor Generation.",
  "Removing H₂S By 99%.",
  "Reduced Footprint.",
  "Powerful Stirring Inside The Tank.",
  "Zero Maintenance Cost.",
  "Reduce Quantity Of Air Diffusers By 50-60%.",
];

export const diagramPoints = [
  "Outstanding oxygen dissolution power",
  "Reduced cost of electricity",
  "Guarantee of zero odor generation",
  "Reduced sludge output",
  "Guarantee of zero odor generation",
];

export const comparisonRows = [
  {
    matter: "Clogging and replacement",
    traditional: "Can clog and need frequent replacement",
    oxyblaster: "Designed not to clog, with no replacement for up to 10 years",
  },
  {
    matter: "Oxygen transfer",
    traditional: "Less efficient",
    oxyblaster: "High-rate transfer through fine microbubbles",
  },
  {
    matter: "Power use",
    traditional: "Higher energy consumption",
    oxyblaster: "Up to 30% less power*",
  },
  {
    matter: "Sludge at the tank bottom",
    traditional: "Can build up",
    oxyblaster: "Swept up by strong stirring, so it can't settle",
  },
  {
    matter: "Sludge output",
    traditional: "Baseline",
    oxyblaster: "Up to 20% less",
  },
  {
    matter: "Odor",
    traditional: "Can cause foul odor and poorer treatment quality",
    oxyblaster: "Designed to prevent odor, with H₂S cut by 99.8%**",
  },
  {
    matter: "Maintenance cost",
    traditional: "High maintenance and replacement cost",
    oxyblaster: "Maintenance-free diffuser***",
  },
  {
    matter: "Number of diffusers needed",
    traditional: "Baseline",
    oxyblaster: "50-60% fewer",
  },
  {
    matter: "Footprint",
    traditional: "Baseline",
    oxyblaster: "Smaller footprint",
  },
];

// Customer logo rows (public/figma/logos)
export const logoRows: string[][] = [
  ["r1-1", "r1-2", "r1-3", "r1-4", "r1-5", "r1-6", "r1-7", "r1-8", "r1-9", "r1-10", "r1-11"],
  ["r2-1", "r2-2", "r2-3", "r2-4", "r2-5", "r2-6", "r2-7", "r2-8"],
  ["r3-1", "r3-2", "r3-3", "r3-4", "r3-5"],
  ["r4-1", "r4-2", "r4-3", "r4-4", "r4-5"],
].map((row) => row.map((n) => `/figma/logos/${n}.png`));
