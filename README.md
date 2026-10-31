# PressEscape — Football Analytics & Press Resistance Intelligence

A unified platform combining a Python data analytics pipeline with a reactive React + TypeScript tactical dashboard for analyzing high-pressing resistance across UEFA Champions League Finals.

---

## Architecture Overview

```text
D:\PressEscape/
├── Data/                                # Raw and processed data assets (Preserved)
│   ├── raw/
│   │   ├── competitions.json            # StatsBomb competition definitions
│   │   ├── events/                      # 5 UCL Finals match events (JSON)
│   │   └── matches/16/                  # UCL match metadata
│   └── processed/                       # Python pipeline exports
│       ├── pressure_analysis.csv        # 1,206 pressure event observations
│       ├── team_summary.csv             # 10 team matchup retention summaries
│       └── audit_report.csv             # 5-match data quality & audit report
├── src/                                 # Python Analytics Engine (Preserved)
│   ├── analyze_pressures.py             # Event-level pressure parser (10-event window)
│   └── summarize_pressures.py           # Team matchup aggregator & retention %
├── audit_events.py                      # Comprehensive data validation audit
├── sync_data.py                         # Synchronizes processed CSVs to frontend/public/data/
├── requirements.txt                     # Python analytics dependency specifications
└── frontend/                            # React 19 + TypeScript Tactical Dashboard
    ├── public/
    │   └── data/                        # Synchronized actual CSVs for zero-click loading
    │       ├── pressure_analysis.csv
    │       ├── team_summary.csv
    │       └── audit_report.csv
    ├── src/
    │   ├── pages/                       # 6 Dashboard pages (Overview, Tactical Pitch, etc.)
    │   ├── components/                  # Neo-Brutalist UI & Tactical pitch components
    │   ├── services/dataService.ts      # Multi-CSV loader & calculation engine
    │   └── types/analytics.ts           # Domain models & coordinate types
    ├── package.json
    └── vite.config.ts
```

---

## How to Run the Project

### 1. Python Analytics Pipeline
To re-run the Python analysis on raw StatsBomb event data:

```bash
# In project root (D:\PressEscape)
python src/analyze_pressures.py
python src/summarize_pressures.py
python audit_events.py
```

### 2. Synchronize Data to Frontend
After generating fresh CSVs, run the synchronizer to update the frontend's static data:

```bash
python sync_data.py
```

This will automatically:
- Copy `team_summary.csv` and `audit_report.csv` to `frontend/public/data/`.
- Cross-reference raw event coordinates (`x, y`) and player names into `frontend/public/data/pressure_analysis.csv` without modifying your original files.

---

### 3. Running the React Dashboard

> **Prerequisite:** Node.js (v18 or higher with npm) is required to run the frontend Vite dev server.

Once Node.js is installed on your system:

```bash
cd frontend
npm install
npm run dev
```

The dashboard will open at `http://localhost:3000`, automatically loading your actual processed data.
You can also use the **CSV Synchronizer modal** in the UI to upload or inspect CSV files anytime.
