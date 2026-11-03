# What follows a collect — labels, not a pool read

> **Trust:** `educational-reference`  
> **Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

**One-sentence goal:** Teach a time-window classifier that tags the move after a collect as compound, extract, or idle — from arguments you pass, not from Alcor.

**Real code:** `npm test`. **Does not** read a pool or sign a collect.

The course is [EDUCATION.md](EDUCATION.md).

## What is true (executed)

| Rule | Result |
| --- | --- |
| collect 100 → add 110, window 30 | compound 1 |
| collect 100 → swap 115 | extract 1 |
| collect 100 → swap 140 | idle 1 |
| collect, collect, add | idle 1 + compound 1 |
| no collect | refused |
| `rates` | floor bps; sum ≤ 10000, not required to equal it |
| one compound collect | `dominant` is `"compound"` |
| `parseMoves("100 collect\n110 add")` | second kind `add` |

Times must strictly increase. Window is an integer 0..86400. Moves are 1..64.

## What is in the repo

| Piece | Role |
| --- | --- |
| `src/fee.ts` | classify, rates, dominant, parseMoves |
| `src/fee.test.ts` | the executed rule |
| `src/Demo.tsx` | interactive sequences |
| Docs | EDUCATION · POLICY · SECURITY |

## Run

```bash
npm install
npm test
npm run dev
```

## Best practice and the opposite

**Do** treat the labels as teaching tags.  
**Do** map history into `{ at, kind }` yourself before calling `classify`.  
**Do** expect floor dust in the basis-point rates.

**Do not** call this a live auditor. No pool is read.  
**Do not** require the three rate buckets to sum to 10000. That rule belongs to `px-treasury-incoming-fee-splitter`.  
**Do not** treat "extract" as a finding about a person.

## Related

- `wax-lp-impermanent-loss-heat-map`
- `wax-alcor-pool-migration-tracker`
- `wax-lp-behavioral-profiler`

MIT — Pixel Journey
