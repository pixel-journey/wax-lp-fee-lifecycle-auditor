# Education — fee lifecycle after collect

## Pattern

For each `collect` in a time-ordered stream:

| Next move | Label |
|-----------|--------|
| `add` within `windowSec` | **compound** |
| `swap` within `windowSec` | **extract** |
| none, another collect, or outside window | **idle** |

## Teaching points

1. Moves are **arguments** — not Hyperion history.
2. Labels are **heuristic teaching tags**, not legal characterizations of capital flows.
3. `rates` floors each bucket over collect count; bps may not sum to 10000.
4. Prefer WharfKit if a host later signs real collect/add actions.

## Related

- `wax-lp-impermanent-loss-heat-map`
- `wax-alcor-pool-migration-tracker`
- `wax-lp-behavioral-profiler`
