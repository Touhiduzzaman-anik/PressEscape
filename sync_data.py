"""
PressEscape Data Synchronizer
Syncs processed CSVs from Data/processed to frontend/public/data/
Cross-references raw StatsBomb events to enrich pressure coordinates (x, y) and player names
without modifying any original Python scripts or processed CSV datasets.
"""

import csv
import json
import shutil
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
PROCESSED_DIR = ROOT_DIR / "Data" / "processed"
RAW_EVENTS_DIR = ROOT_DIR / "Data" / "raw" / "events"
PUBLIC_DATA_DIR = ROOT_DIR / "frontend" / "public" / "data"

MATCH_METADATA = {
    "18242": {
        "match_name": "Juventus vs Barcelona",
        "season": "2014/15",
        "date": "2015-06-06",
        "venue": "Olympiastadion, Berlin",
    },
    "18243": {
        "match_name": "Real Madrid vs Atlético Madrid",
        "season": "2015/16",
        "date": "2016-05-28",
        "venue": "San Siro, Milan",
    },
    "18244": {
        "match_name": "Juventus vs Real Madrid",
        "season": "2016/17",
        "date": "2017-06-03",
        "venue": "Millennium Stadium, Cardiff",
    },
    "18245": {
        "match_name": "Real Madrid vs Liverpool",
        "season": "2017/18",
        "date": "2018-05-26",
        "venue": "NSC Olimpiyskiy, Kyiv",
    },
    "22912": {
        "match_name": "Tottenham Hotspur vs Liverpool",
        "season": "2018/19",
        "date": "2019-06-01",
        "venue": "Estadio Metropolitano, Madrid",
    },
}


def clean_team_name(name: str) -> str:
    """Normalize team names for consistent display and fix encoding artifacts."""
    if not name:
        return "Unknown Team"
    if "Madrid" in name and "Real" not in name:
        return "Atlético Madrid"
    return name.strip()


def sync_team_summary():
    src_file = PROCESSED_DIR / "team_summary.csv"
    dest_file = PUBLIC_DATA_DIR / "team_summary.csv"

    if not src_file.exists():
        print(f"[!] Warning: {src_file} does not exist. Skipping.")
        return 0

    rows = []
    with open(src_file, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            match_id = r.get("match_id", "")
            meta = MATCH_METADATA.get(match_id, {})
            attacking_team = clean_team_name(r.get("attacking_team", ""))
            pressing_team = clean_team_name(r.get("pressing_team", ""))

            faced = int(r.get("total_pressure", 0))
            retained = int(r.get("retained_10_events", 0))
            changed = int(r.get("possession_changed", 0))
            period_ended = int(r.get("period_ended", 0))
            insufficient = int(r.get("insufficient_events", 0))
            eligible = retained + changed
            retention_rate = float(r.get("retention_percentage", 0.0))

            match_duration = 120 if match_id == "18243" else 90
            avg_intensity = round(faced / match_duration, 2)

            rows.append({
                "team_name": attacking_team,
                "match_id": match_id,
                "opponent": pressing_team,
                "season": meta.get("season", "2014/15"),
                "total_pressure_events_faced": faced,
                "retained_10_event": retained,
                "possession_changed": changed,
                "period_ended": period_ended,
                "insufficient_events": insufficient,
                "eligible_observations": eligible,
                "retention_rate_pct": round(retention_rate, 2),
                "avg_pressure_intensity_per_min": avg_intensity,
            })

    if rows:
        fieldnames = list(rows[0].keys())
        with open(dest_file, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)

    print(f"[✓] Synced team_summary.csv ({len(rows)} matchups) -> {dest_file}")
    return len(rows)


def sync_audit_report():
    src_file = PROCESSED_DIR / "audit_report.csv"
    dest_file = PUBLIC_DATA_DIR / "audit_report.csv"

    if not src_file.exists():
        print(f"[!] Warning: {src_file} does not exist. Skipping.")
        return 0

    # Also copy the raw audit report directly
    shutil.copy2(src_file, dest_file)
    print(f"[✓] Synced audit_report.csv -> {dest_file}")
    return 1


def sync_pressure_analysis():
    src_file = PROCESSED_DIR / "pressure_analysis.csv"
    dest_file = PUBLIC_DATA_DIR / "pressure_analysis.csv"

    if not src_file.exists():
        print(f"[!] Warning: {src_file} does not exist. Skipping.")
        return 0

    # Preload raw event lookup for each match
    print("[-] Reading raw event telemetry to map coordinates & players...")
    events_lookup = {}
    for match_id in MATCH_METADATA:
        json_file = RAW_EVENTS_DIR / f"{match_id}.json"
        if json_file.exists():
            with open(json_file, encoding="utf-8") as jf:
                match_events = json.load(jf)
                # Map by event index
                events_lookup[match_id] = {ev.get("index"): ev for ev in match_events if "index" in ev}

    enriched_rows = []
    with open(src_file, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader):
            match_id = row.get("match_id", "")
            pressure_idx = int(row.get("pressure_index", 0))
            meta = MATCH_METADATA.get(match_id, {})

            # Lookup raw event
            raw_event = events_lookup.get(match_id, {}).get(pressure_idx, {})
            loc = raw_event.get("location") or [60.0, 40.0]
            x = float(loc[0]) if len(loc) > 0 else 60.0
            y = float(loc[1]) if len(loc) > 1 else 40.0

            # Pitch corridor & zone
            pitch_zone = "Defensive Third" if x < 40 else ("Attacking Third" if x >= 80 else "Middle Third")
            if y < 18:
                pitch_corridor = "Left Wing"
            elif y < 34:
                pitch_corridor = "Left Half-Space"
            elif y > 62:
                pitch_corridor = "Right Wing"
            elif y > 46:
                pitch_corridor = "Right Half-Space"
            else:
                pitch_corridor = "Center"

            pressing_player = (raw_event.get("player") or {}).get("name", "Pressing Player")

            # Determine targeted player (player under pressure in possession)
            targeted_player = "Targeted Player"
            if raw_event.get("related_events"):
                # Check preceding or following events in possession
                for offset in (-1, 1, 2):
                    target_ev = events_lookup.get(match_id, {}).get(pressure_idx + offset)
                    if target_ev and target_ev.get("player"):
                        targeted_player = target_ev.get("player", {}).get("name", "Targeted Player")
                        break

            # Outcome normalization
            raw_outcome = row.get("outcome", "")
            if "retained" in raw_outcome:
                outcome = "10-Event Possession Retention"
            elif "changed" in raw_outcome:
                outcome = "Possession Changed"
            elif "period" in raw_outcome:
                outcome = "Period Ended"
            else:
                outcome = "Insufficient Events"

            enriched_rows.append({
                "event_id": f"PRE-{match_id}-{pressure_idx}",
                "match_id": match_id,
                "match_name": meta.get("match_name", "UCL Final"),
                "season": meta.get("season", "2014/15"),
                "date": meta.get("date", "2015-06-06"),
                "minute": int(row.get("minute", 0)),
                "second": int(raw_event.get("second", 0)),
                "period": int(row.get("period", 1)),
                "pressing_team": clean_team_name(row.get("pressing_team", "")),
                "attacking_team": clean_team_name(row.get("attacking_team", "")),
                "pressing_player": pressing_player,
                "targeted_player": targeted_player,
                "x": round(x, 1),
                "y": round(y, 1),
                "pitch_zone": pitch_zone,
                "pitch_corridor": pitch_corridor,
                "outcome": outcome,
                "sequence_count": int(row.get("events_checked", 0)),
            })

    if enriched_rows:
        fieldnames = list(enriched_rows[0].keys())
        with open(dest_file, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(enriched_rows)

    print(f"[✓] Synced pressure_analysis.csv ({len(enriched_rows)} events) -> {dest_file}")
    return len(enriched_rows)


def main():
    print("=" * 60)
    print("PressEscape: Synchronizing Python Data Pipeline to Frontend")
    print("=" * 60)
    PUBLIC_DATA_DIR.mkdir(parents=True, exist_ok=True)
    sync_team_summary()
    sync_audit_report()
    sync_pressure_analysis()
    print("=" * 60)
    print("Synchronization Complete! All actual data ready in frontend/public/data/")
    print("=" * 60)


if __name__ == "__main__":
    main()
