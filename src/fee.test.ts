import { describe, expect, it } from "vitest";
import { classify } from "./fee";

describe("fee lifecycle", () => {
  it("counts an add inside the window as compound", () => {
    expect(classify([{ at: 100, kind: "collect" }, { at: 110, kind: "add" }], 30)).toEqual({ ok: true, compound: 1, extract: 0, idle: 0 });
  });

  it("counts a late swap as idle", () => {
    expect(classify([{ at: 100, kind: "collect" }, { at: 140, kind: "swap" }], 30)).toEqual({ ok: true, compound: 0, extract: 0, idle: 1 });
  });
});
