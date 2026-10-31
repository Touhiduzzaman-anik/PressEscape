
import csv
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT = BASE_DIR / "Data" / "processed" / "pressure_analysis.csv"
OUTPUT = BASE_DIR / "Data" / "processed" / "team_summary.csv"

summary = defaultdict(lambda: {
    "total_pressure": 0,
    "retained_10_events": 0,
    "possession_changed": 0,
    "period_ended": 0,
    "insufficient_events": 0
})

with open(INPUT, encoding="utf-8") as file:
    reader = csv.DictReader(file)

    for row in reader:
        key = (
            row["match_id"],
            row["pressing_team"],
            row["attacking_team"]
        )

        summary[key]["total_pressure"] += 1

        outcome = row["outcome"]

        if outcome in summary[key]:
            summary[key][outcome] += 1

fields = [
    "match_id",
    "pressing_team",
    "attacking_team",
    "total_pressure",
    "retained_10_events",
    "possession_changed",
    "period_ended",
    "insufficient_events",
    "retention_percentage"
]

with open(OUTPUT, "w", newline="", encoding="utf-8") as file:

    writer = csv.DictWriter(file, fieldnames=fields)
    writer.writeheader()

    for key, data in sorted(summary.items()):

        denominator = (
            data["retained_10_events"]
            + data["possession_changed"]
        )

        percentage = (
            data["retained_10_events"] / denominator * 100
            if denominator else 0
        )

        writer.writerow({
            "match_id": key[0],
            "pressing_team": key[1],
            "attacking_team": key[2],
            **data,
            "retention_percentage": round(percentage, 2)
        })

print("Team summary completed!")
print("Total team matchups:", len(summary))
print("Output:", OUTPUT)
