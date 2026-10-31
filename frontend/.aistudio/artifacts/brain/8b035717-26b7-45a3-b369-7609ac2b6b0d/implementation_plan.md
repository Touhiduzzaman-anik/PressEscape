# PressEscape — Football Analytics & Press Resistance Intelligence

A high-performance, neo-brutalist football intelligence web application designed for tactical analysts, coaches, and sports data researchers. The platform evaluates opponent pressure and measures 10-event possession retention across UEFA Champions League finals with StatsBomb 120×80 coordinate pitch analytics, sequence exploration, and statistical transparency.

## User Review & Critical Decisions

> [!IMPORTANT]
> The implementation plan incorporates your confirmed choices from Phase 1:
> - **Dataset Loading**: Preloaded authentic 5 UCL Finals dataset (1,206 valid opponent-pressure events, 10 team matchups) paired with an interactive CSV import/export suite for external Python pipeline sync.
> - **Tactical Pitch Map**: Dual-mode visualization featuring discrete StatsBomb coordinate scatter points and spatial kernel density / pressure zones.
> - **Match Explorer**: Full 10-event sequence inspector examining possession retention outcomes at micro-event level.

- **Confirmed Decision 1**: Authentic UCL final dataset preloaded with client-side CSV parser (`pressure_analysis.csv`, `team_summary.csv`, `audit_report.csv`) and export tool.
- **Confirmed Decision 2**: Strict Neo-Brutalist design tokens (`#FFFBEA` canvas, `#FFFDF3` cards, `#FFE500` brand accent, `#171717` 2px/3px borders, hard `4px 4px 0px #171717` offset shadows, no rounded pills, tabular figures).
- **Confirmed Decision 3**: Six dedicated views without crowded single-page stacking: Overview, Match Explorer, Team Comparison, Pressure Analysis, Tactical Pitch Map, and Methodology & Data.

---

## 1. Overview & Core Concept

- **What It Does**: PressEscape delivers deep statistical intelligence on how teams cope when subjected to opponent pressure. Instead of conflating simple possession with tactical press resistance, PressEscape tracks a 10-event observation window post-pressure to evaluate whether possession was retained, turned over, or interrupted.
- **Target Audience**: Professional football data analysts, tactical scouts, sports scientists, and UEFA/club performance staff.
- **Key Value**: Replaces anecdotal match impressions with empirical pressure resistance analytics, rigorous 10-event retention calculations, spatial pressure maps, and transparent audit methodologies.

---

## 2. User Experience & Visual Design

### Visual Identity & Theme
- **Aesthetic Direction**: Neo-Brutalism + Retro Football Editorial + Sports Intelligence. Tactile borders, hard offset shadows, zero soft blur, high-contrast badges, crisp typography.
- **Strict Color Tokens**:
  - Primary Background Canvas: `#FFFBEA` (Warm creamy parchment)
  - Card Surface: `#FFFDF3` (Off-white tactile surface)
  - Subtle Surface: `#F2EDD9`
  - Primary Accent: `#FFE500` (Electric yellow brand punch)
  - Border & Contrast Text: `#171717` (Deep jet black)
  - Success / Retained 10-Event: `#36B879` (Sharp emerald green)
  - Alert / Possession Changed: `#F16B6B` (Vibrant coral red)
  - Neutral / Interrupted (Period Ended / Insufficient): `#64748B` & `#94A3B8`
  - Pitch Canvas: `#1F4A2C` or `#FFFDF3` tactical chalkboard toggle
- **Typography & Hierarchy**:
  - Headings & Brand: High-contrast athletic display type (`Plus Jakarta Sans` / `Outfit` font family)
  - Body & UI: Clean, balanced prose
  - Numbers & Metrics: Monospace tabular numerals (`IBM Plex Mono` / `tabular-nums`)
- **Borders & Shadows**:
  - Standard Cards & Buttons: `2px solid #171717` with `4px 4px 0px #171717` hard shadow
  - Important Containers / Active Tabs: `3px solid #171717` with `6px 6px 0px #171717` shadow
  - Interactive Hover: `translate(-2px, -2px)` with shadow expansion to `6px 6px 0px #171717`
  - Zero pills: Statuses rendered as structured rectangular tags with 2px solid borders or unboxed typographic separators.

### Dedicated Navigation & Pages Walkthrough
1. **Application Shell**:
   - Fixed left sidebar ($260\text{px}$) with PressEscape wordmark, navigation tabs (01 to 06), match quick-switch, and data source status.
   - Global Header with breadcrumb path, competition context (`UEFA Champions League — Men's`), season filter, and CSV Data Pipeline Sync button.
2. **Page 01 — Overview**:
   - Executive KPI cards: Total Pressure Events (1,206), Valid Matchups (10), Matches Analyzed (5), Overall 10-Event Retention Rate.
   - Dual analytics preview: Tactical pitch pressure distribution snippet and team retention benchmark.
   - Match overview summary table with retention rates and event counts.
   - Exact 4-category outcome distribution breakdown.
3. **Page 02 — Match Explorer**:
   - Selector for the 5 Champions League final matches.
   - Chronological match timeline scrubber (0' to 90'+ extra time) filtering pressure sequences.
   - Interactive 10-event sequence inspector: shows the pressing trigger, ensuing passes, duels, and final possession outcome.
   - Filterable event log by team, half/period, and outcome.
4. **Page 03 — Team Comparison**:
   - Dual team selector: Pressing Team vs Attacking Team.
   - Head-to-head KPI comparison grid (Pressure events faced vs applied, 10-event retained, possession turnovers, retention rate %).
   - Comparative horizontal bar charts with eligible observation denominator indicators.
   - Factual analytical synthesis highlighting tactical divergence without causal leaps.
5. **Page 04 — Pressure Analysis**:
   - Deep dive into the 4 strict categories:
     1. 10-Event Possession Retention
     2. Possession Changed
     3. Period Ended
     4. Insufficient Events
   - Team-wise pressure volume vs retention efficacy matrix.
   - Match-by-match event distribution chart.
   - Searchable, filterable pressure event table with sorting by minute, zone, and outcome.
6. **Page 05 — Tactical Pitch Map**:
   - High-fidelity SVG football pitch adhering strictly to StatsBomb dimensions (120 units wide × 80 units high).
   - Pitch markings: penalty boxes, 6-yard boxes, penalty spots, center circle, halfway line, corner arcs.
   - Visualization toggles: Discrete event points, Spatial pressure density zones (defensive third, middle third, final third, half-spaces), and Team perspective.
   - Interactive hover cards on event coordinates showing minute, pressing player/team, target player, and 10-event outcome.
7. **Page 06 — Methodology & Data**:
   - StatsBomb Open Data provenance and processing pipeline description.
   - Rigorous mathematical definitions: Retention % formula with strict denominator rules (excluding Period Ended and Insufficient Events).
   - Analytical limitations callout box (5-match finals bias, event window constraints).
   - Audit report viewer (`audit_report.csv` integration).
   - In-browser CSV file upload and JSON export suite to load updated outputs from local Python scripts.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct Bundle of Validated Python Pipeline Data with CSV Upload Support**:
  - *Approach*: Bundle the complete, validated 1,206-event dataset and 10-matchup summary as typed structured data, while providing a file-uploader tool that parses custom `pressure_analysis.csv` and `team_summary.csv` dynamically.
  - *Why*: Ensures the app runs instantly out of the box with 100% faithful UCL statistics, while fulfilling future FastAPI and local CSV synchronization without requiring a separate live server process.
- **Decision 2: Strict Metric Formula Isolation**:
  - *Approach*: Retention Rate = `Retained / (Retained + Changed) * 100`. Incomplete observations (Period Ended, Insufficient Events) are tracked separately and explicitly noted in denominators.
  - *Why*: Eliminates statistical distortion and prevents misleading tactical claims.
- **Decision 3: Pure SVG Tactical Pitch with StatsBomb Normalization**:
  - *Approach*: Custom responsive SVG pitch component converting StatsBomb `(x: 0-120, y: 0-80)` to proportional coordinate viewBox (`0 0 120 80`).
  - *Why*: Vector-crisp across all screen resolutions, zero external canvas library overhead, seamless tooltip positioning, and instant toggling between discrete points and density regions.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PressEscape App Shell                             │
│  ┌───────────────────────┐  ┌────────────────────────────────────────────┐  │
│  │   Sidebar Navigation  │  │               Global Header                │  │
│  │  - Brand Logo & Name  │  │  - Breadcrumbs & Competition Status        │  │
│  │  - 01. Overview       │  │  - Active Match / Team Global Filters      │  │
│  │  - 02. Match Explorer │  │  - CSV Pipeline Upload / Export Trigger   │  │
│  │  - 03. Team Compare   │  └────────────────────────────────────────────┘  │
│  │  - 04. Pressure Analy │  ┌────────────────────────────────────────────┐  │
│  │  - 05. Pitch Map      │  │              Dedicated Page View           │  │
│  │  - 06. Methodology    │  │  [Overview | Match | Team | Pitch | Doc]   │  │
│  └───────────────────────┘  └────────────────────────────────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                      ┌────────────────┴────────────────┐
                      ▼                                 ▼
         ┌─────────────────────────┐       ┌─────────────────────────┐
         │     Data Service        │       │    Interactive State    │
         │ - 1,206 UCL Events      │       │ - Active page & match   │
         │ - 10 Valid Team Matchups│       │ - Filter & search query │
         │ - CSV Upload & Parser   │       │ - Pitch layer & density │
         │ - Metrics Calculation   │       │ - Sequence inspector ID │
         └─────────────────────────┘       └─────────────────────────┘
```

### Component Hierarchy & File Architecture
- `src/types/analytics.ts`: Type definitions for pressure events, sequence items, team metrics, match summaries, and audit records.
- `src/data/uclDataset.ts`: Complete structured dataset containing the 1,206 pressure observations across 5 UCL finals, team metrics, and audit log.
- `src/services/dataService.ts`: Data management service handling filtering, retention percentage calculations, sequence extraction, and CSV import/export.
- `src/components/layout/`:
  - `Sidebar.tsx`: Fixed brutalist sidebar with active indicator and responsive drawer.
  - `Header.tsx`: Global top bar with breadcrumbs and competition context.
  - `AppLayout.tsx`: Container wrapper maintaining viewport integrity.
- `src/components/ui/`:
  - `Card.tsx`, `MetricCard.tsx`, `Badge.tsx`, `Button.tsx`, `Select.tsx`, `DataTable.tsx`, `SectionHeader.tsx`, `CsvModal.tsx`.
- `src/components/pitch/`:
  - `TacticalPitch.tsx`: StatsBomb 120×80 SVG pitch with coordinate markers, density grid, and event popovers.
- `src/components/charts/`:
  - `OutcomeBarChart.tsx`, `RetentionGauge.tsx`, `TimelineScrubber.tsx`, `SequenceViewer.tsx`.
- `src/pages/`:
  - `OverviewPage.tsx`, `MatchExplorerPage.tsx`, `TeamComparisonPage.tsx`, `PressureAnalysisPage.tsx`, `TacticalPitchPage.tsx`, `MethodologyPage.tsx`.

### Verification Plan
1. **Compilation Check**: Run `compile_applet` to confirm zero TypeScript, React 19, or Vite build errors.
2. **Page Navigation**: Verify all 6 pages render cleanly with persistent sidebar state.
3. **Data Integrity Audit**: Verify KPI cards reflect the exact 1,206 pressure events and 10 team matchups with zero fabricated statistics.
4. **Interactive Validation**:
   - Test match switching in Match Explorer and minute scrubber.
   - Test team pair selector in Team Comparison.
   - Test scatter vs density zones on Tactical Pitch Map with hover coordinate tooltips.
   - Test CSV import modal with real CSV input and JSON export.
