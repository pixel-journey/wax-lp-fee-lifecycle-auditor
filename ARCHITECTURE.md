# Architecture

```
moves[], windowSec
        │
        ▼
   classify → compound / extract / idle / collects
        │
        ├── rates (bps)
        ├── dominant
        └── parseMoves
```

Honesty boundary: no pool API, no wallet, no broadcast.
