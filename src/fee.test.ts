import { describe, expect, it } from "vitest";
import { classify } from "./fee";

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
    ).toEqual({ ok: true, compound: 1, extract: 0, idle: 0 });
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
    ).toEqual({ ok: true, compound: 0, extract: 1, idle: 0 });
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
    ).toEqual({ ok: true, compound: 0, extract: 0, idle: 1 });
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
    ).toEqual({ ok: true, compound: 1, extract: 0, idle: 1 });
  });

  it("rejects empty collect set", () => {
    expect(classify([{ at: 1, kind: "add" }], 30).ok).toBe(false);
  });
});
