# A collect followed by an add

**Trust label:** `educational-reference`  
**Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

A collect at 100 and an add at 110, inside 30 seconds, is one compound. A swap 40 seconds later is idle. No pool is read.

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `src/fee.ts` | The pure rules |
| `src/fee.test.ts` | The claims in the verification log |
| `src/usecases.ts` | HTTP requests, built and not sent |
| `src/api.ts` | The same unsent WAX query builders as the other educational repos |
| `src/Demo.tsx` | Offline page |
| `docs/PRIOR-SCOPE.md` | The July README. It describes a product this tree does not ship |

`npm test` runs the rules. `npm run dev` opens the page.

## Where the neighboring idea lives

Adds versus removes, without fees, live in `wax-lp-behavioral-profiler`. Full-range impermanent loss lives in `wax-impermanent-loss-insurance-pool-tracker`. The July product description is in `docs/PRIOR-SCOPE.md` and is not what this tree does.

## Queries

`executed` is false. This repo did not call any host. No transaction is invented.
