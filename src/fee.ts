/**
 * What follows a collect, inside a time window.
 * The moves are arguments. No pool is read.
 */

export type MoveKind = "collect" | "add" | "swap";
export type Move = { at: number; kind: MoveKind };

export type ClassifyOk = {
  ok: true;
  compound: number;
  extract: number;
  idle: number;
  /** Total collects that were classified */
  collects: number;
};

export type ClassifyErr = { ok: false; reason: string };
export type ClassifyResult = ClassifyOk | ClassifyErr;

export function classify(
  moves: readonly Move[],
  windowSec: number
): ClassifyResult {
  if (!Number.isInteger(windowSec) || windowSec < 0 || windowSec > 86_400) {
    return { ok: false, reason: "windowSec must be an integer from 0 to 86400" };
  }
  if (moves.length < 1 || moves.length > 64) {
    return { ok: false, reason: "pass 1 to 64 moves" };
  }
  let previous = -1;
  for (const move of moves) {
    if (move.kind !== "collect" && move.kind !== "add" && move.kind !== "swap") {
      return { ok: false, reason: "kind must be collect, add, or swap" };
    }
    if (!Number.isInteger(move.at) || move.at < 0) {
      return { ok: false, reason: "at must be a non-negative integer" };
    }
    if (move.at <= previous) {
      return { ok: false, reason: "times must increase" };
    }
    previous = move.at;
  }
  let compound = 0;
  let extract = 0;
  let idle = 0;
  let collects = 0;
  for (let i = 0; i < moves.length; i++) {
    if (moves[i].kind !== "collect") continue;
    collects += 1;
    const next = moves[i + 1];
    if (!next || next.at - moves[i].at > windowSec || next.kind === "collect") {
      idle += 1;
    } else if (next.kind === "add") {
      compound += 1;
    } else {
      extract += 1;
    }
  }
  if (collects === 0) return { ok: false, reason: "pass at least one collect" };
  return { ok: true, compound, extract, idle, collects };
}

export function rates(
  r: ClassifyOk
): { compoundBps: bigint; extractBps: bigint; idleBps: bigint } {
  const n = BigInt(r.collects);
  return {
    compoundBps: (BigInt(r.compound) * 10_000n) / n,
    extractBps: (BigInt(r.extract) * 10_000n) / n,
    idleBps: (BigInt(r.idle) * 10_000n) / n,
  };
}

/** Dominant outcome by count (ties prefer idle > extract > compound for conservatism). */
export function dominant(
  r: ClassifyOk
): "compound" | "extract" | "idle" | "tie" {
  const max = Math.max(r.compound, r.extract, r.idle);
  const hits = [
    r.idle === max ? ("idle" as const) : null,
    r.extract === max ? ("extract" as const) : null,
    r.compound === max ? ("compound" as const) : null,
  ].filter(Boolean) as ("compound" | "extract" | "idle")[];
  if (hits.length !== 1) return "tie";
  return hits[0];
}

export function parseMoves(
  text: string
): { ok: false; reason: string } | { ok: true; moves: Move[] } {
  // lines or ; separated: "100 collect" or "100,collect"
  const parts = text
    .split(/[\n;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length < 1 || parts.length > 64) {
    return { ok: false, reason: "enter 1 to 64 moves" };
  }
  const moves: Move[] = [];
  for (const p of parts) {
    const m = p.match(/^(\d+)[,\s]+(collect|add|swap)$/i);
    if (!m) return { ok: false, reason: `invalid move: ${p}` };
    moves.push({
      at: Number(m[1]),
      kind: m[2].toLowerCase() as MoveKind,
    });
  }
  return { ok: true, moves };
}

export const SAMPLE_SEQUENCES: { id: string; label: string; moves: Move[]; windowSec: number }[] = [
  {
    id: "compound",
    label: "Collect → add",
    moves: [
      { at: 100, kind: "collect" },
      { at: 110, kind: "add" },
    ],
    windowSec: 30,
  },
  {
    id: "extract",
    label: "Collect → swap",
    moves: [
      { at: 100, kind: "collect" },
      { at: 115, kind: "swap" },
    ],
    windowSec: 30,
  },
  {
    id: "idle",
    label: "Late swap",
    moves: [
      { at: 100, kind: "collect" },
      { at: 140, kind: "swap" },
    ],
    windowSec: 30,
  },
  {
    id: "mixed",
    label: "Idle collect + compound",
    moves: [
      { at: 100, kind: "collect" },
      { at: 105, kind: "collect" },
      { at: 110, kind: "add" },
    ],
    windowSec: 30,
  },
];
