/**
 * What follows a collect, inside a window.
 * The moves are arguments. No pool is read.
 */

export type Move = { at: number; kind: "collect" | "add" | "swap" };

export function classify(moves: readonly Move[], windowSec: number): { ok: false; reason: string } | { ok: true; compound: number; extract: number; idle: number } {
  if (!Number.isInteger(windowSec) || windowSec < 0 || windowSec > 86_400) return { ok: false, reason: "windowSec must be an integer from 0 to 86400" };
  if (moves.length < 1 || moves.length > 20) return { ok: false, reason: "pass 1 to 20 moves" };
  let previous = -1;
  for (const move of moves) {
    if (move.kind !== "collect" && move.kind !== "add" && move.kind !== "swap") return { ok: false, reason: "kind must be collect, add, or swap" };
    if (!Number.isInteger(move.at) || move.at < 0) return { ok: false, reason: "at must be a non-negative integer" };
    if (move.at <= previous) return { ok: false, reason: "times must increase" };
    previous = move.at;
  }
  let compound = 0;
  let extract = 0;
  let idle = 0;
  for (let i = 0; i < moves.length; i++) {
    if (moves[i].kind !== "collect") continue;
    const next = moves[i + 1];
    if (!next || next.at - moves[i].at > windowSec || next.kind === "collect") idle += 1;
    else if (next.kind === "add") compound += 1;
    else extract += 1;
  }
  if (compound + extract + idle === 0) return { ok: false, reason: "pass at least one collect" };
  return { ok: true, compound, extract, idle };
}
