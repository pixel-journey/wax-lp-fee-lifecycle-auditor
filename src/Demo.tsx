"use client";

import { classify } from "./fee";

const moves = [
  { at: 100, kind: "collect" as const },
  { at: 110, kind: "add" as const },
];

export function Demo() {
  const row = classify(moves, 30);
  return (
    <main className="wrap">
      <p className="kicker">Educational reference</p>
      <h1>A collect followed by an add</h1>
      <p className="lede">100 then 110, inside 30 seconds, is one compound. A swap at 140 would be idle. No pool is read.</p>
      {row.ok ? <p>compound {row.compound}, extract {row.extract}, idle {row.idle}.</p> : <p>{row.reason}</p>}
    </main>
  );
}
