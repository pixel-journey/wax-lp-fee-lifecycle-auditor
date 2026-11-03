export const FEE_MYTHS = [
  {
    myth: "This audits live Alcor fee claims",
    reality:
      "classify() only labels argument sequences. No pool or wallet is read.",
  },
  {
    myth: "compound means automatic reinvestment on-chain",
    reality:
      "Here it only means an add followed a collect inside the window.",
  },
  {
    myth: "extract proves funds left the ecosystem",
    reality:
      "swap inside the window is labeled extract for teaching — not a chain proof.",
  },
  {
    myth: "idle means the LP is offline forever",
    reality:
      "No next action, next collect, or action outside the window → idle for that collect.",
  },
] as const;

export const GLOSSARY = [
  {
    term: "collect",
    meaning: "Fee claim event in the argument stream.",
  },
  {
    term: "compound",
    meaning: "Next move is add inside windowSec.",
  },
  {
    term: "extract",
    meaning: "Next move is swap inside windowSec.",
  },
  {
    term: "idle",
    meaning: "No qualifying next move for that collect.",
  },
] as const;
