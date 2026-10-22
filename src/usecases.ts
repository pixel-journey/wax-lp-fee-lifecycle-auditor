import { ATOMIC_ORIGIN, HISTORY_ORIGIN, historyActions } from "./api";
import { classify } from "./fee";
import type { ChainAction, HttpRequest } from "./api";

export type UseCase = {
  title: string;
  detail: string;
  request: HttpRequest;
  transaction: { note: string; actions: ChainAction[] } | null;
};

const row = classify([{ at: 100, kind: "collect" }, { at: 110, kind: "add" }], 30);
if (!row.ok) throw new Error(row.reason);
const compound = row.compound;

export const USE_CASES: UseCase[] = [
  {
    title: "Transfer history is not a collect",
    detail: `The fixture is ${compound} compound. The history request is not sent.`,
    request: historyActions(HISTORY_ORIGIN, "alice", "eosio.token:transfer", 20),
    transaction: null,
  },
  {
    title: "A template is not a position",
    detail: "No liquidity action is built. The Alcor contract is not guessed here.",
    request: { method: "GET", url: `${ATOMIC_ORIGIN}/atomicassets/v1/templates/pixeljourney/1`, executed: false },
    transaction: null,
  },
];

export function assertUseCases(): void {
  if (compound !== 1) throw new Error("fee");
}
