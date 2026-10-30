"use client";

import { useMemo, useState } from "react";
import { downloadText, exportClassifyMarkdown } from "./exportReport";
import { classify, type Move } from "./fee";
import { FEE_LIFE_MYTHS } from "./myths";

const SCENARIOS: { id: string; label: string; moves: Move[] }[] = [
  {
    id: "compound",
    label: "Collect → add",
    moves: [
      { at: 100, kind: "collect" },
      { at: 110, kind: "add" },
    ],
  },
  {
    id: "extract",
    label: "Collect → swap",
    moves: [
      { at: 100, kind: "collect" },
      { at: 115, kind: "swap" },
    ],
  },
  {
    id: "idle",
    label: "Collect → late swap",
    moves: [
      { at: 100, kind: "collect" },
      { at: 140, kind: "swap" },
    ],
  },
  {
    id: "double",
    label: "Two collects, then add",
    moves: [
      { at: 100, kind: "collect" },
      { at: 105, kind: "collect" },
      { at: 110, kind: "add" },
    ],
  },
];

export function Demo() {
  const [id, setId] = useState("compound");
  const [windowSec, setWindowSec] = useState(30);
  const scenario = SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
  const row = useMemo(
    () => classify(scenario.moves, windowSec),
    [scenario, windowSec]
  );

  return (
    <main className="wrap">
      <p className="kicker">Educational reference · Pixel Journey</p>
      <h1>A collect followed by an add</h1>
      <p className="lede">
        What follows a collect, inside a time window. Moves are arguments. No pool is
        read.
      </p>

      <section
        style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          border: "1px solid #a855f744",
          borderRadius: "12px",
        }}
      >
        <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Myths vs reality</h2>
        {FEE_LIFE_MYTHS.map((m) => (
          <div key={m.myth} style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}>
            <p style={{ margin: 0 }}>
              <strong>Myth:</strong> {m.myth}
            </p>
            <p style={{ margin: "0.25rem 0 0" }}>
              <strong>Reality:</strong> {m.reality}
            </p>
          </div>
        ))}
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={id === s.id}
            onClick={() => setId(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <label style={{ display: "block", marginBottom: "1rem" }}>
        Window (seconds)
        <input
          type="number"
          min={0}
          max={86400}
          value={windowSec}
          onChange={(e) => setWindowSec(Number(e.target.value))}
          style={{ display: "block", marginTop: "0.25rem" }}
        />
      </label>

      <p style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.85rem" }}>
        {scenario.moves.map((m) => `${m.at}:${m.kind}`).join(" → ")}
      </p>
      {row.ok ? (
        <>
          <p>
            compound <strong>{row.compound}</strong>, extract{" "}
            <strong>{row.extract}</strong>, idle <strong>{row.idle}</strong>
          </p>
          <button
            type="button"
            onClick={() =>
              downloadText(
                "fee-lifecycle.md",
                exportClassifyMarkdown(scenario.moves, windowSec, row)
              )
            }
          >
            Download MD
          </button>
        </>
      ) : (
        <p>{row.reason}</p>
      )}

      <p style={{ marginTop: "2rem", fontSize: "0.85rem", opacity: 0.75 }}>
        See EDUCATION.md · POLICY.md
      </p>
    </main>
  );
}
