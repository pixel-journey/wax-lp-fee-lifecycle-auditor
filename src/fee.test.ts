import { describe, expect, it } from "vitest";
import { classify, dominant, parseMoves, rates } from "./fee";

describe("fee lifecycle", () => {
  it("counts an add inside the window as compound", () => {
    expect(
      classify(
        [
          { at: 100, kind: "collect" },
          { at: 110, kind: "add" },
        ],
        30
      )
    ).toEqual({ ok: true, compound: 1, extract: 0, idle: 0, collects: 1 });
  });

  it("counts a swap inside the window as extract", () => {
    expect(
      classify(
        [
          { at: 100, kind: "collect" },
          { at: 115, kind: "swap" },
        ],
        30
      )
    ).toEqual({ ok: true, compound: 0, extract: 1, idle: 0, collects: 1 });
  });

  it("counts a late swap as idle", () => {
    expect(
      classify(
        [
          { at: 100, kind: "collect" },
          { at: 140, kind: "swap" },
        ],
        30
      )
    ).toEqual({ ok: true, compound: 0, extract: 0, idle: 1, collects: 1 });
  });

  it("counts back-to-back collects as idle on the first", () => {
    expect(
      classify(
        [
          { at: 100, kind: "collect" },
          { at: 105, kind: "collect" },
          { at: 110, kind: "add" },
        ],
        30
      )
    ).toEqual({ ok: true, compound: 1, extract: 0, idle: 1, collects: 2 });
  });

  it("rejects empty collect set", () => {
    expect(classify([{ at: 1, kind: "add" }], 30).ok).toBe(false);
  });
});

describe("rates / dominant", () => {
  it("rates sum floors near 10000", () => {
    const r = classify(
      [
        { at: 1, kind: "collect" },
        { at: 2, kind: "add" },
        { at: 10, kind: "collect" },
        { at: 50, kind: "swap" },
      ],
      5
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const rt = rates(r);
    expect(rt.compoundBps + rt.extractBps + rt.idleBps).toBeLessThanOrEqual(10_000n);
  });

  it("dominant compound", () => {
    const r = classify(
      [
        { at: 1, kind: "collect" },
        { at: 2, kind: "add" },
      ],
      30
    );
    expect(r.ok && dominant(r)).toBe("compound");
  });
});

describe("parseMoves", () => {
  it("parses lines", () => {
    const p = parseMoves("100 collect\n110 add");
    expect(p.ok).toBe(true);
    if (p.ok) expect(p.moves[1].kind).toBe("add");
  });
});
