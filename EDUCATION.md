# Education — fee lifecycle

## Rule

For each `collect` in order:

1. Look at the **next** move (if any).
2. If none, or gap `> windowSec`, or next is another `collect` → **idle**.
3. If next is `add` within the window → **compound**.
4. If next is `swap` within the window → **extract**.

## Why it exists

Product copy often says “compounding LPs” without defining the observation window. This helper forces an explicit window and a countable label.

## What it does not do

- Read Alcor or any pool
- Measure fee amounts
- Judge morality of extract vs compound
