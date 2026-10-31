import csv
import json
from pathlib import Path


MATCH_IDS = ("18245", "18244", "18243", "18242", "22912")
EVENT_TYPES = ("Pressure", "Pass", "Carry", "Interception", "Dispossessed")
FIELDS = ("possession", "possession_team", "team", "player", "location")


def load_records(path):
    with path.open(encoding="utf-8") as file:
        records = json.load(file)
    if isinstance(records, dict):
        return [records]
    if not isinstance(records, list):
        raise ValueError(f"Expected a JSON array or object in {path}")
    if any(not isinstance(record, dict) for record in records):
        raise ValueError(f"Expected every record to be an object in {path}")
    return records


def load_match_seasons(matches_dir):
    requested_ids = set(MATCH_IDS)
    matches = {}

    for path in sorted(matches_dir.glob("*.json")):
        for match in load_records(path):
            match_id = str(match.get("match_id", ""))
            if match_id not in requested_ids:
                continue
            if match_id in matches:
                raise ValueError(f"Duplicate match_id {match_id} in {matches_dir}")
            season = match.get("season")
            if not isinstance(season, dict):
                raise ValueError(f"Missing season metadata for match_id {match_id} in {path}")
            matches[match_id] = {
                "season_id": season.get("season_id"),
                "season_name": season.get("season_name"),
                "season_match_file": path.name,
            }

    return matches


def audit_event_file(match_id, event_path, match):
    row = {
        "match_id": match_id,
        "season_id": match.get("season_id", ""),
        "season_name": match.get("season_name", ""),
        "season_match_file": match.get("season_match_file", ""),
        "total_events": 0,
        "missing_event_file": not event_path.is_file(),
        "missing_match_record": not bool(match),
    }

    for event_type in EVENT_TYPES:
        row[event_type.lower()] = 0
    for field in FIELDS:
        row[f"{field}_available"] = 0
        row[f"{field}_missing"] = 0

    row["records_missing_any_field"] = 0
    row["missing_field_values_total"] = 0
    row["under_pressure_true"] = 0

    if not event_path.is_file():
        return row

    for event in load_records(event_path):
        row["total_events"] += 1
        if event.get("under_pressure") is True:
            row["under_pressure_true"] += 1
        event_type = event.get("type")
        if isinstance(event_type, dict):
            type_name = event_type.get("name")
            if type_name in EVENT_TYPES:
                row[type_name.lower()] += 1

        missing_this_record = False
        for field in FIELDS:
            if event.get(field) is None:
                row[f"{field}_missing"] += 1
                row["missing_field_values_total"] += 1
                missing_this_record = True
            else:
                row[f"{field}_available"] += 1

        if missing_this_record:
            row["records_missing_any_field"] += 1
    return row


def main():
    root = Path(__file__).resolve().parent
    data_dir = root / "Data"
    events_dir = data_dir / "raw" / "events"
    matches_dir = data_dir / "raw" / "matches" / "16"
    output_path = data_dir / "processed" / "audit_report.csv"

    if not matches_dir.is_dir():
        raise FileNotFoundError(f"Match season directory not found: {matches_dir}")
    if not events_dir.is_dir():
        raise FileNotFoundError(f"Event directory not found: {events_dir}")
    output_path.parent.mkdir(parents=True, exist_ok=True)

    matches = load_match_seasons(matches_dir)
    rows = []
    for match_id in MATCH_IDS:
        rows.append(
            audit_event_file(
                match_id,
                events_dir / f"{match_id}.json",
                matches.get(match_id, {}),
            )
        )

    fieldnames = [
        "match_id",
        "season_id",
        "season_name",
        "season_match_file",
        "total_events",
        *[event_type.lower() for event_type in EVENT_TYPES],
        "under_pressure_true",
        *[
            column
            for field in FIELDS
            for column in (f"{field}_available", f"{field}_missing")
        ],
        "records_missing_any_field",
        "missing_field_values_total",
        "missing_event_file",
        "missing_match_record",
    ]
    with output_path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    missing_events = [row["match_id"] for row in rows if row["missing_event_file"]]
    missing_matches = [row["match_id"] for row in rows if row["missing_match_record"]]
    print(f"Audit report: {output_path}")
    print(f"Missing event IDs: {', '.join(missing_events) if missing_events else 'none'}")
    print(f"Missing match IDs: {', '.join(missing_matches) if missing_matches else 'none'}")
    for row in rows:
        print(
            f"{row['match_id']}: season {row['season_id']} "
            f"({row['season_name']}); {row['total_events']} events; "
            f"{row['records_missing_any_field']} records missing at least one field."
        )


if __name__ == "__main__":
    main()
