# wax-lp-fee-lifecycle-auditor

> **Trust label:** `educational-reference`  
> **Status:** Full-thrust education pass (2026-11-03)

Classify what follows a **collect** inside a time window: **compound** · **extract** · **idle**.

Moves are arguments. No pool is read.

```bash
npm test && npm run dev
```

| Helper | Role |
|--------|------|
| `classify` | count outcomes per collect |
| `rates` | floor bps of each outcome |
| `dominant` | majority label |
| `parseMoves` | text → moves |

[EDUCATION.md](./EDUCATION.md) · [POLICY.md](./POLICY.md) · [SECURITY.md](./SECURITY.md)

MIT — Pixel Journey
