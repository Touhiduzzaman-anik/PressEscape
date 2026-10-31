import csv
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

EVENT_DIR = BASE_DIR / "Data" / "raw" / "events"
OUTPUT_DIR = BASE_DIR / "Data" / "processed"

WINDOW_SIZE = 10

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

results = []

for file_path in sorted(EVENT_DIR.glob("*.json")):

    with open(file_path, encoding="utf-8") as file:
        events = json.load(file)

    for i, event in enumerate(events):

        if event.get("type", {}).get("name") != "Pressure":
            continue

        possession_id = event.get("possession")
        period = event.get("period")

        attacking_team = (
            event.get("possession_team") or {}
        ).get("name")

        pressing_team = (
            event.get("team") or {}
        ).get("name")

        if not attacking_team or not pressing_team:
            continue

        # Ignore same-team pressure records
        if pressing_team == attacking_team:
            continue

        # --- প্রতিস্থাপিত অংশ শুরু ---
        checked = 0
        outcome = None

        window = events[i + 1:i + 1 + WINDOW_SIZE]

        for next_event in window:

            if next_event.get("period") != period:
                outcome = "period_ended"
                break

            if next_event.get("possession") != possession_id:
                outcome = "possession_changed"
                break

            next_team = (
                next_event.get("possession_team") or {}
            ).get("name")

            if next_team != attacking_team:
                outcome = "possession_changed"
                break

            checked += 1

        if outcome is None:

            if len(window) < WINDOW_SIZE:
                outcome = "insufficient_events"
            else:
                outcome = "retained_10_events"
        # --- প্রতিস্থাপিত অংশ শেষ ---

        results.append({
            "match_id": file_path.stem,
            "pressure_index": event.get("index"),
            "period": period,
            "minute": event.get("minute"),
            "pressing_team": pressing_team,
            "attacking_team": attacking_team,
            "possession_id": possession_id,
            "events_checked": checked,
            "outcome": outcome
        })

output_file = OUTPUT_DIR / "pressure_analysis.csv"

if results:
    with open(output_file, "w", newline="", encoding="utf-8") as file:

        writer = csv.DictWriter(
            file,
            fieldnames=results[0].keys()
        )

        writer.writeheader()
        writer.writerows(results)

print("Pressure analysis completed!")
print("Total valid pressure events:", len(results))
print("Output:", output_file)