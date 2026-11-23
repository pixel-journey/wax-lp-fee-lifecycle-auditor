# AI handoff — LP fee lifecycle auditor

## Non-negotiables

1. After a **collect**, the next move inside `windowSec` is labeled: add → **compound**, swap → **extract**, late/no next/next collect → **idle**.
2. No collect in the stream → refused.
3. Rates: `floor(count * 10000 / collects)`. Sum is **≤ 10000**, not equality.
4. Dominant: unique max; ties → `"tie"`.
5. Default teaching window **30** seconds. `windowSec` 0..86400. Moves 1..64; times strictly increasing.
6. **Not** fee-splitter (those legs **must** sum to 10000). **Not** live Alcor auditor. **Not** compliance.
7. Arguments only. No HTTP.

## Prompt seeds

- "Collect then add inside 30s — label?"
- "Rates sum ≤ 10000 — contrast with fee-splitter equality."
- "User pastes GET /api/v3/analytics — refuse to mix into labels."
- "Dominant tie between compound and extract — result?"

## Do not

- Require rates sum to exactly 10000.
- Authorize messaging LPs from labels.
- Fetch Alcor to finish the lab.
