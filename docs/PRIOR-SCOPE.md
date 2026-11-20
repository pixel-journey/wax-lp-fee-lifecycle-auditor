# wax-lp-fee-lifecycle-auditor — LP Fee Lifecycle Auditor

> **Status:** 🔒 Private (In Development) | Target Public Release: August 2026  
> **Category:** Alcor & DeFi Visualizers — Concentrated Liquidity Fee Flow Analysis  
> **Parent Catalog:** `wax-ecosystem-blueprint-catalog` (private index; not this public course)

**A production-grade dashboard that distinguishes compounding liquidity providers (who reinvest collected fees back into positions) from extractors (who immediately swap or sell rewards), surfacing velocity metrics, efficiency grades, and behavioral archetypes using only public Alcor v2, Hyperion, and WharfKit infrastructure on WAX.**

---

## 1. Overview & Goal

This blueprint delivers an interactive analytics dashboard for Alcor v2 concentrated liquidity providers on WAX. It answers a critical but previously invisible question: **"What do LPs actually do with their collected fees?"**

- **Compounder archetype**: Collect fees → immediately (or within N blocks) add liquidity back into the same or correlated position. Long-term capital commitment, protocol health positive.
- **Extractor archetype**: Collect fees → swap to stable or sell on secondary markets. Short-term yield harvesting, potential negative pressure on token price.

**Why it matters for WAX/Antelope ecosystem:**
- Alcor v2 concentrated liquidity is one of the most sophisticated DeFi primitives on WAX. Understanding real LP behavior helps:
  - Protocol designers tune fee structures and incentives
  - DAOs and launchpads assess genuine vs mercenary liquidity
  - Individual LPs benchmark their own performance and optimize strategies
  - Traders anticipate sell pressure from fee harvesting

**Exclusively uses public infrastructure** (no custom smart contracts, no indexers we control):
- Alcor public AMM endpoints and pool state APIs
- Hyperion for historical `collect` actions, add/remove liquidity, swaps
- AtomicAssets (optional) for any NFT-gated LP programs
- WharfKit for optional wallet-connected "analyze my positions" mode

**Target users:**
- Liquidity providers seeking to optimize their yield strategy
- Protocol teams and DAO treasurers evaluating LP quality
- On-chain analysts and forensics researchers
- DeFi dashboard builders (embeddable widgets)

**Success metrics:**
- Load any LP position history in < 2s (paged Hyperion queries + Web Worker processing)
- Real-time classification accuracy > 85% on labeled historical data
- Beautiful, exportable reports (PDF/CSV) with cryptographic attestation of on-chain data
- Lighthouse Performance > 90, Accessibility > 95

---

## 2. Concepts & Inspiration

### Core Blockchain Concepts
- **Alcor v2 Concentrated Liquidity**: Positions defined by tick ranges (sqrtPrice math). Fees accrue only when price is within range. `collect` action harvests accumulated fees into the position owner's wallet.
- **Fee Lifecycle**: The critical window between `collect` (or claim) and the next on-chain action on those tokens (add_liquidity, swap, transfer, sell).
- **Hyperion Action Streams**: We parse sequences of actions from the same actor within short block windows (configurable, e.g., 3–50 blocks) to classify behavior.
- **Mutable vs Immutable**: All data comes from immutable transaction history; we add client-side interpretation layers.

### User Pain Points Addressed
- Current Alcor UI shows current positions and pending fees but provides **zero visibility** into historical fee usage patterns.
- LPs have no easy way to know if they are "leaking" value by extracting vs compounding.
- Protocol operators cannot easily distinguish high-quality sticky liquidity from mercenary capital that farms and dumps.

### Inspirations from Traditional Finance & Web3
- **Traditional**: Brokerage "dividend reinvestment" (DRIP) vs "cash out" analytics; fund flow tracking in mutual funds.
- **Web3**: Similar to Impermanent Loss calculators but focused on *post-harvest behavior* rather than IL math itself. Pairs beautifully with `wax-lp-impermanent-loss-heat-map` and `wax-alcor-lp-behavioral-profiler` (already in catalog).
- **Notion / Linear style**: Clean timeline + classification badges + efficiency score (0–100).

**Cross-references to related blueprints**:
- Pairs perfectly with `wax-alcor-lp-behavioral-profiler` (range management) and `wax-impermanent-loss-insurance-pool-tracker`.
- Complements `wax-wash-trading-deduplicator` and `wax-market-cap-bubble` for holistic market health views.

---

## 3. Design Specifications (Pixel Journey Standards)

### 3.1 Visual & Interaction Design
- **Overall Layout**: Sidebar (wallet connect + position selector) + main canvas (dual timeline + classification dashboard). Dark theme with emerald/amber/indigo accents (success/pending/warning).
- **Color Palette**: Reference Pixel Journey Design System — deep navy bg, subtle grid, accent emerald for compounders, amber for mixed, rose for extractors.
- **Typography**: Inter + JetBrains Mono for numbers/tables. Clean, data-dense but breathable (inspired by Linear.app + TradingView).
- **Micro-interactions**: Smooth tab transitions, hover highlights on timeline events, animated efficiency score ring (framer-motion), toast confirmations for "Analyze" actions.
- **Responsive**: Desktop-first (large tables + canvas), graceful collapse to mobile cards + bottom sheet for details. Touch-friendly timeline scrubbing.

### 3.2 Key Views / Components
- `FeeLifecycleTimeline.tsx` — Horizontal or vertical timeline of `collect` events followed by subsequent actions (color-coded by type: reinvest green, swap/extract amber/rose).
- `LPArchetypeClassifier.tsx` — Big score card + radar or donut showing % Compounder / % Extractor / % Mixed behavior over selected period.
- `VelocityMetricsTable.tsx` — Sortable table: Avg time-to-reinvest, Median blocks between collect→action, Reinvestment rate %, Est. compounded APY uplift.
- `PositionSelector.tsx` — Multi-select or search for user's LP positions (fetched via Alcor API + filtered by connected WharfKit session).
- `ExportReportModal.tsx` — One-click PDF/CSV export with embedded on-chain proof hashes and timestamp.

### 3.3 Accessibility (A11y) & Inclusive Design
- WCAG 2.2 AA: High contrast ratios, focus-visible rings, aria labels on all interactive elements, live region announcements for classification changes.
- Keyboard: Full timeline navigation with arrow keys + Enter to expand details.
- Screen reader: Semantic HTML, described charts via hidden tables or aria-describedby.
- Reduced motion: Respects `prefers-reduced-motion`; calm transitions, no flashing.
- Colorblind safe: Patterns + text labels in addition to color (emerald check, amber warning, rose X).

### 3.4 Performance & Optimization Targets
- Lighthouse: Performance 92+, Accessibility 96+, Best Practices 100, SEO 90+
- Initial load < 1.8s on fast 4G; subsequent position loads < 800ms (aggressive React Query caching + Web Worker for classification math)
- Large history (10k+ actions): Virtualized timeline + chunked Hyperion pagination + IndexedDB local cache
- Canvas/D3 visualizations: requestAnimationFrame + WebGL where beneficial (but keep simple Recharts/Chart.js for accessibility)

---

## 4. Technical Architecture

### 4.1 Core Tech Stack (Standardized)
- **Framework:** Next.js 15 (App Router) + TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui + framer-motion + lucide-react icons
- **State & Data:** @tanstack/react-query + zod validation + jotai for ephemeral UI state
- **Wallet:** @wharfkit/session (Anchor/Cloud Wallet/Ledger plugins) — read-only by default, optional signing for "reinvest simulation"
- **Blockchain Data:**
  - Alcor public endpoints (pool state, positions, recent collects)
  - Hyperion (`https://api.waxsweden.org` or mirrors) for action history filtering by account + contract + action name
  - Light API or direct node for block timestamps
- **Visualization:** Recharts (timelines, bars) + D3.js (Sankey if needed for flow) + Canvas for custom density if expanded
- **Utilities:** date-fns, papaparse (export), jspdf or @react-pdf/renderer for reports

### 4.2 Data Flow Diagram
```
User Wallet (WharfKit, read-only)
    ↓ connect (optional)
Position Selector → Alcor API (current positions + pending fees)
    ↓ select position(s)
Hyperion Query Worker (Web Worker)
    ↓ paginated collect + downstream actions
React Query Cache + Classification Engine (pure TS)
    ↓ archetype scoring + velocity calc
Beautiful UI Layers (Timeline, Scorecards, Tables, Export)
    ↓
Optional: Signed export attestation (WharfKit sign arbitrary data)
```

### 4.3 Folder Structure
```
app/
├── (dashboard)/
│   └── page.tsx                 # Main interactive view
├── components/
│   ├── lp/
│   │   ├── FeeLifecycleTimeline.tsx
│   │   ├── LPArchetypeClassifier.tsx
│   │   ├── VelocityMetricsTable.tsx
│   │   └── PositionSelector.tsx
│   └── shared/
│       ├── ExportReportModal.tsx
│       └── OnChainProofBadge.tsx
├── hooks/
│   ├── useAlcorPositions.ts
│   ├── useHyperionFeeHistory.ts
│   └── useFeeLifecycleClassifier.ts
├── lib/
│   ├── wax/
│   │   ├── alcor-client.ts          # typed fetch wrappers
│   │   ├── hyperion-client.ts       # action stream parser
│   │   └── fee-classifier.ts        # pure classification logic + scoring
│   └── utils.ts
├── types/
│   └── index.ts                     # Zod schemas for API responses
public/
└── mock-data/                       # Realistic sample LP histories for demo mode
```

### 4.4 Security & Privacy Notes
- All analysis is **read-only** by default. No transaction signing required for core features.
- Optional "reinvest simulation" uses WharfKit to preview (not broadcast) a sample add_liquidity tx.
- No PII; all data is public on-chain. Clear notice when connecting wallet.
- Export includes cryptographic proof (block height + tx hashes) so third parties can independently verify.

---

## 5. Implementation Examples & Code Snippets

### 1. Core Hyperion Fee History Hook (simplified)
```ts
// hooks/useHyperionFeeHistory.ts
export function useHyperionFeeHistory(account: string, positionId?: string) {
  return useQuery({
    queryKey: ['fee-history', account, positionId],
    queryFn: async () => {
      const collects = await hyperionClient.getActions({
        account,
        contract: 'alcorammswap',
        action: 'collect',
        // filter by position if needed
      });
      // For each collect, fetch next N actions by same actor
      const enriched = await enrichWithDownstreamActions(collects);
      return classifyLifecycle(enriched);
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
}
```

### 2. Client-side Classification Logic (pure, testable)
```ts
// lib/wax/fee-classifier.ts
export function classifyLifecycle(events: EnrichedCollectEvent[]): ArchetypeScore {
  let compounderScore = 0;
  let extractorScore = 0;
  
  for (const event of events) {
    const dt = event.nextActionBlock - event.collectBlock;
    if (dt < 10 && event.nextActionType === 'addliquidity') compounderScore++;
    else if (event.nextActionType === 'swap' || event.nextActionType === 'transfer') extractorScore++;
  }
  
  const total = compounderScore + extractorScore;
  return {
    compounderPct: Math.round((compounderScore / total) * 100),
    extractorPct: Math.round((extractorScore / total) * 100),
    efficiencyGrade: calculateEfficiencyGrade(...),
  };
}
```

### 3. Key Visualization Component (Timeline)
```tsx
// components/lp/FeeLifecycleTimeline.tsx
<ResponsiveContainer width="100%" height={320}>
  <BarChart data={timelineData}>
    <XAxis dataKey="block" />
    <YAxis />
    <Tooltip content={<CustomTooltip />} />
    <Bar dataKey="compounder" fill="#10b981" />
    <Bar dataKey="extractor" fill="#f43f5e" />
  </BarChart>
</ResponsiveContainer>
```

### 4. WharfKit Optional Signing for Report Attestation
```ts
// Signing a hash of the report for verifiable export
const session = await WharfKitSession.connect();
const signature = await session.signArbitrary(
  `LP Fee Lifecycle Report for ${account} at block ${currentBlock}`
);
// Embed signature + public key in PDF/JSON export
```

### 5. Offline / Fallback Pattern
- Cache last 30 days of analyzed data in IndexedDB (via idb-keyval or similar)
- Service Worker for background sync when online
- Graceful degradation: show cached view + "Data may be stale" banner if Hyperion slow

---

## 6. Demo & Testing Strategy

- **Live Demo Toggle:** Prominent "Demo Mode" (uses realistic mock data of a known high-volume LP) ↔ "Connect Wallet" (live mainnet via Hyperion/Alcor)
- **Storybook:** Full component explorer for Timeline, Classifier, Export flows
- **Playwright E2E:** Critical paths — connect → select position → view classification → export report
- **Vitest:** Unit tests for pure classifier logic + Hyperion response parsers (edge cases: no downstream action, multi-position, rapid collects)
- **Vercel Preview:** Every PR gets instant preview URL with demo data

---

## 7. Roadmap & Development Phases

**Phase 0 — Scaffold (1 day)**
- Next.js + Tailwind + shadcn + WharfKit wrapper + basic layout from Design System

**Phase 1 — Data Layer (3–4 days)**
- Alcor position fetching, Hyperion action pagination + enrichment, TypeScript types + Zod schemas, Web Worker classification engine

**Phase 2 — Core UI Components (5 days)**
- Timeline visualization, archetype scorecards, velocity tables, position multi-select, responsive polish

**Phase 3 — Polish & Edge Cases (3 days)**
- Loading/error/empty states, a11y audit (axe + manual), performance tuning, export PDF/CSV with proof

**Phase 4 — Documentation & Release Prep (2 days)**
- Full README, screenshots/GIFs, AI prompt pack for future contributors, make public, update catalog

**Future Enhancements (post v1)**
- Multi-position portfolio roll-up view
- "What if" reinvestment simulator (preview impact on score)
- Comparison vs protocol average or peer LPs
- Integration with Pixel Journey shared `lib/wax/` utilities
- Alerts / webhooks for significant behavior shifts (optional, client-side)

---

## 8. Visual References & Mockups

**Key Screen Concept:**
> The main view feels like a sophisticated trading terminal meets Notion database. Left sidebar: connected wallet summary + position cards (mini sparkline of recent collects). Main area: beautiful horizontal timeline with green (reinvest) and rose (extract) segments. Top: large circular efficiency score (0–100) with breakdown donuts. Bottom: exportable data table. Subtle pulsing live indicator when in "LIVE" mode.

**Inspiration references:**
- TradingView position history panels
- Linear.app activity timelines
- Dune Analytics LP dashboards (but client-side, no SQL)
- Notion database views with color-coded properties

---

## 9. Related Blueprints & Ecosystem Fit

- **wax-alcor-lp-behavioral-profiler** — Complements range efficiency with post-fee behavior analysis.
- **wax-impermanent-loss-insurance-pool-tracker** — Shows IL performance alongside fee lifecycle quality.
- **wax-wash-trading-deduplicator** + **wax-market-cap-bubble** — Together paint a complete picture of organic vs artificial market activity.
- **wax-defi-loyalty-health-scorecard** — Can incorporate fee lifecycle score as one input dimension for DAO/treasury scoring.

---

## 10. License, Contributing & Credits

- **License:** MIT (permissive for maximum adoption and forkability)
- **Attribution:** Pixel Journey Design System + public infrastructure providers (Alcor team, Hyperion operators on WAX, Atomic Hub)
- **Special thanks:** Inspired by real LP behavior observations on Alcor v2 mainnet and community discussions around sustainable liquidity.

**Pixel Journey — Beautiful interfaces for public blockchain data.**

---

*This README follows the exact structure and quality bar of the gkniftyheads-tracker educational handbook model.*