# Sources

| Source | Use |
| --- | --- |
| [docs.alcor.exchange/api](https://docs.alcor.exchange/api) | If a **different** product later reads pools: v3 market / analytics / feed. This lab does not. |
| [SECURITY.md](SECURITY.md) | Locked labels and refusals |
| [fee splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter) | Legs **must** sum to 10000 bps — **different** product |

## Product facts locked by tests

After a **collect**, the next move inside `windowSec` is labeled:

| Next move | Label |
| --- | --- |
| add inside window | **compound** |
| swap inside window | **extract** |
| late swap / no next / next collect | **idle** |

- No collect in the stream → refused.
- Rates: `floor(count * 10000 / collects)`. Sum is **≤ 10000**, not equality.
- Dominant: unique max; ties → `"tie"`.
- Default teaching window: **30** seconds. `windowSec` is 0..86400. Moves 1..64; times strictly increasing.

## What this is not

- Not a live Alcor / Hyperion auditor.
- Not a legal or compliance finding.
- Not the fee-splitter rule (those legs must sum to 10000).
- Not an authorization to message LPs.

Arguments only. Prefer WharfKit if a host later signs.
