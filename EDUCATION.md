# Education — what follows a collect, as a label

> **Rung:** `npm test` passes. Moves are arguments. No pool is read. Labels are teaching tags, not a legal or economic characterization.  
> **The test is the rule.**

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Label collect→add as compound, collect→swap as extract, and a late swap as idle |
| Intermediate | See why back-to-back collects idle the first one, and why rates may not sum to 10000 |
| Masterclass | Say what would have to change before these labels describe a real Alcor position |

---

## Beginner — one scene

Window is 30 seconds. Times must increase.

| Moves | Label |
| --- | --- |
| collect at 100, add at 110 | compound 1 |
| collect at 100, swap at 115 | extract 1 |
| collect at 100, swap at 140 | idle 1 (outside the window) |
| collect 100, collect 105, add 110 | idle 1, compound 1, collects 2 |

An `add` with no collect is refused (`pass at least one collect`).

### Words

| Word | Meaning here |
| --- | --- |
| Collect | The event being classified |
| Add inside the window | Compound |
| Swap inside the window | Extract |
| No next move, another collect, or too late | Idle |
| Rates | `floor(count * 10000 / collects)` per bucket |

### Predict, then run

```bash
npm test
```

1. `parseMoves("100 collect\n110 add")` yields an add as the second kind.
2. A single compound collect is `dominant` `"compound"`.
3. Floor rates are ≤ 10000. They are not required to equal 10000.

---

## Intermediate — the window and the floors

```text
for each collect:
  next = the following move
  if no next, or next is collect, or next.at - this.at > windowSec:
      idle
  else if next is add:
      compound
  else:
      extract   // swap
```

`windowSec` must be an integer from 0 to 86400. Moves must be 1–64, kinds only `collect` / `add` / `swap`, times non-negative integers that strictly increase.

Back-to-back collects: the first is idle because the next kind is `collect`, even if that next collect is inside the window. The second collect is classified on its own next move. The mixed test locks this.

`rates` uses bigint floor division. Three buckets of floor can sum under 10000. The test asserts `<= 10000n`, not equality. Do not copy the fee-splitter rule (must sum to 10000) onto this one.

`dominant` returns the unique max. Ties return `"tie"`. The comment about preferring idle is not what the function does when counts are equal — it returns tie. Believe the code and the tests.

### Attack → test

| Attack | Naive code | This lab | Test |
| --- | --- | --- | --- |
| Call a late swap an extract | Window ignored | idle | `counts a late swap as idle` |
| Call the first of two collects a compound | Wrong next | idle, then compound | `counts back-to-back collects as idle on the first` |
| Classify a stream with no collect | Division by zero later | refused | `rejects empty collect set` |
| Claim rates sum to 10000 | Lost dust | floor, sum ≤ 10000 | `rates sum floors near 10000` |

---

## Masterclass — arguments are not Hyperion

Nothing in this repo reads an Alcor pool, a position id, or a transfer history. A product that wants real labels must fetch moves, map them into `{ at, kind }`, then call `classify`. Wrong mapping (a remove coded as add, a clock in milliseconds coded as seconds) silently mislabels.

Still absent:

- Liquidity math. Impermanent loss is `wax-lp-impermanent-loss-heat-map`.
- Migration between fee tiers. That is `wax-alcor-pool-migration-tracker`.
- A signed collect or add. Prefer WharfKit if a host later signs.

The labels are heuristics for teaching. They are not a judgment of a wallet.

### Exercise

1. Collect at 100, add at 110, window 30. Compound count? (1. Tested.)
2. Why is the first of two collects idle? (Next kind is collect. Tested.)
3. Do the three rate buckets have to sum to 10000? (No. Floor. Tested as ≤.)

---

## What this course will not teach

- A live LP audit
- That "extract" is a moral or legal finding
- Pool reserves or fee APR
