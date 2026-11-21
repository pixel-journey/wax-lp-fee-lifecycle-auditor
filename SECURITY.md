# Security — LP fee lifecycle labels

## Closed in tests

| Issue | Behavior |
| --- | --- |
| collect → add inside window | **compound** |
| collect → swap inside window | **extract** |
| collect → late swap / no next / next collect | **idle** |
| No collect in stream | refused |
| Rates | `floor(count * 10000 / collects)`; sum **≤** 10000 (not equality) |
| Dominant | unique max; ties return `"tie"` |
| windowSec | integer 0..86400 |
| Moves | 1..64; times strictly increasing |

Window default teaching value: **30** seconds.

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Live Alcor / Hyperion | Arguments only; no pool read |
| Moral / legal labels | Teaching tags, not compliance findings |
| Mapping errors | Wrong kind (remove as add) silently mislabels |

## Attack angles

1. Treating "extract" as a legal or moral finding.  
2. Claiming rates must sum to 10000 (fee-splitter rule does not apply here).  
3. Calling the first of two collects a compound when next is collect.  
4. Reading a live pool and calling this file the auditor.  
5. Auto-messaging LPs based on extract share alone.

## Honesty limits

No keys, no signing, no pool read.

| Sibling | Distinction |
| --- | --- |
| [IL heat map](https://github.com/pixel-journey/wax-lp-impermanent-loss-heat-map) | Full-range IL formula |
| [pool migration](https://github.com/pixel-journey/wax-alcor-pool-migration-tracker) | Moved-share bps |
| [range efficiency](https://github.com/pixel-journey/wax-alcor-v2-range-efficiency-backtester) | Truncating fee product |
| [fee splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter) | Legs **must** sum 10000 |

Prefer WharfKit if a host later signs. [docs.wax.io](https://docs.wax.io/).
