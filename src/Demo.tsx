"use client";

import { useMemo, useState } from "react";
import {
  classify,
  dominant,
  parseMoves,
  rates,
  SAMPLE_SEQUENCES,
} from "./fee";
import { FEE_MYTHS, GLOSSARY } from "./myths";

export function Demo() {
  const [text, setText] = useState("100 collect\n110 add");
  const [windowSec, setWindowSec] = useState("30");

  const result = useMemo(() => {
    const parsed = parseMoves(text);
    if (!parsed.ok) return parsed;
    const w = Number(windowSec);
    if (!Number.isInteger(w)) {
      return { ok: false as const, reason: "windowSec must be an integer" };
    }
    return classify(parsed.moves, w);
  }, [text, windowSec]);

  const rate = result.ok ? rates(result) : null;
  const dom = result.ok ? dominant(result) : null;

  return (
    <main className="wrap">
      <p className="kicker">Educational reference · Pixel Journey</p>
      <h1>Fee lifecycle after collect</h1>
      <p className="lede">
        Classify what follows each collect inside a time window: compound · extract ·
        idle. Moves are arguments — no pool is read.
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
        {FEE_MYTHS.map((m) => (
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
        {SAMPLE_SEQUENCES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setText(
                s.moves.map((m) => `${m.at} ${m.kind}`).join("\n")
              );
              setWindowSec(String(s.windowSec));
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <label style={{ display: "block", marginBottom: "0.75rem" }}>
        Moves (one per line: "timestamp kind")
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
        />
      </label>
      <label style={{ display: "block", marginBottom: "1rem" }}>
        Window seconds
        <input
          value={windowSec}
          onChange={(e) => setWindowSec(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
        />
      </label>

      {result.ok ? (
        <>
          <p>
            compound <strong>{result.compound}</strong> · extract{" "}
            <strong>{result.extract}</strong> · idle <strong>{result.idle}</strong> ·
            collects <strong>{result.collects}</strong>
          </p>
          {rate && (
            <p style={{ fontSize: "0.9rem" }}>
              rates (bps of collects): compound {rate.compoundBps.toString()} · extract{" "}
              {rate.extractBps.toString()} · idle {rate.idleBps.toString()}
            </p>
          )}
          {dom && (
            <p style={{ fontSize: "0.9rem" }}>
              dominant: <strong>{dom}</strong>
            </p>
          )}
        </>
      ) : (
        <p>{result.reason}</p>
      )}

      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Runbook</h2>
        <ol style={{ fontSize: "0.9rem" }}>
          <li>List moves with strictly increasing times.</li>
          <li>Include at least one collect.</li>
          <li>Set windowSec; read compound / extract / idle counts and rates.</li>
          <li>Do not treat labels as live Alcor fee-claim proofs.</li>
        </ol>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Glossary</h2>
        <dl>
          {GLOSSARY.map((g) => (
            <div key={g.term} style={{ marginBottom: "0.5rem" }}>
              <dt>
                <strong>{g.term}</strong>
              </dt>
              <dd style={{ margin: 0 }}>{g.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p style={{ marginTop: "2rem", fontSize: "0.85rem", opacity: 0.75 }}>
        See EDUCATION.md · POLICY.md · SECURITY.md · companions: IL heat map, migration
        tracker
      </p>
    </main>
  );
}
