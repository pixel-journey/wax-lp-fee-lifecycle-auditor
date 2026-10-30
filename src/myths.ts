export const FEE_LIFE_MYTHS = [
  {
    myth: "This grades live Alcor fee efficiency",
    reality:
      "It only classifies caller-supplied collect → next-move pairs inside a time window.",
  },
  {
    myth: "Extract means malicious",
    reality:
      "Extract means the next move after collect was a swap (within the window). Product context still matters.",
  },
  {
    myth: "Idle means the LP did nothing forever",
    reality:
      "Idle means no qualifying next move inside the window, or the next event was another collect.",
  },
] as const;
