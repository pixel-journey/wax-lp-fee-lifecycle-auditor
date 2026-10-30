import type { Move } from "./fee";

export function exportClassifyMarkdown(
  moves: readonly Move[],
  windowSec: number,
  result: { compound: number; extract: number; idle: number }
): string {
  const lines = [
    "# LP fee lifecycle classify",
    "",
    `> Educational · window ${windowSec}s`,
    "",
    "## Moves",
    "",
    ...moves.map((m) => `- ${m.at}: ${m.kind}`),
    "",
    "## Counts",
    "",
    `- compound: ${result.compound}`,
    `- extract: ${result.extract}`,
    `- idle: ${result.idle}`,
    "",
    "No pool was read.",
    "",
  ];
  return lines.join("\n");
}

export function downloadText(filename: string, content: string): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
