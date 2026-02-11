"""Summarize open water swim activities from Garmin Connect."""

import argparse
import csv
import json
from datetime import datetime, timedelta
from functools import reduce
from pathlib import Path

import requests


def load_activities(file_path):
    """Load activities from a JSON file (Garmin activityList response)."""
    data = json.loads(Path(file_path).read_text())
    return data.get("activityList", data)


GARMIN_API_BASE = "https://connect.garmin.com/gc-api/activitylist-service/activities/search/activities"
CONFIG_PATH = Path(__file__).parent / "garmin_config.json"


def load_garmin_config():
    """Load auth tokens from garmin_config.json."""
    return json.loads(CONFIG_PATH.read_text())


def load_activities_api(start_date, end_date, activity_type="swimming", page_size=100):
    """Fetch activities from the Garmin Connect API with pagination."""
    config = load_garmin_config()
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:147.0) Gecko/20100101 Firefox/147.0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Connect-Csrf-Token": config["csrf_token"],
        "Cookie": config["cookie"],
        "DNT": "1",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
    }
    activities = []
    offset = 0
    while True:
        params = {
            "activityType": activity_type,
            "startDate": start_date,
            "endDate": end_date,
            "limit": page_size,
            "start": offset,
            "excludeChildren": "false",
        }
        resp = requests.get(GARMIN_API_BASE, headers=headers, params=params)
        resp.raise_for_status()
        page = resp.json()
        if not page:
            break
        activities.extend(page)
        if len(page) < page_size:
            break
        offset += page_size
    return activities


def load_activities_csv(file_path):
    """Load activities from a Garmin Connect CSV export."""
    activities = []
    with open(file_path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            distance_str = row.get("Distance", "0").replace(",", "").strip('"')
            distance = float(distance_str) if distance_str else 0

            time_str = row.get("Time", "00:00:00")
            parts = time_str.split(":")
            duration = (
                int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
                if len(parts) == 3
                else 0
            )

            def _num(val):
                if not val or val == "--":
                    return "N/A"
                try:
                    return float(val.replace(",", ""))
                except ValueError:
                    return "N/A"

            activities.append({
                "activityType": {"typeKey": row.get("Activity Type", "unknown")},
                "activityName": row.get("Title", "Untitled").strip('"'),
                "startTimeLocal": row.get("Date", ""),
                "distance": distance,
                "duration": duration,
                "averageHR": _num(row.get("Avg HR", "")),
                "calories": _num(row.get("Calories", "")),
                "averageSwolf": _num(row.get("Avg. Swolf", "")),
                "strokes": _num(row.get("Total Strokes", "")),
                "averageSwimCadenceInStrokesPerMinute": _num(row.get("Avg Stroke Rate", "")),
            })
    return activities


def parse_date(date_str):
    """Parse Garmin's startTimeLocal format: '2025-09-04 15:13:50'."""
    return datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")


def window_key(dt, window_days):
    """Map a datetime to the Monday-aligned start of its window bucket."""
    origin = datetime(dt.year, 1, 1)
    origin -= timedelta(days=origin.weekday())  # align to Monday
    days_since = (dt - origin).days
    bucket_start = origin + timedelta(days=(days_since // window_days) * window_days)
    return bucket_start.strftime("%Y-%m-%d")


def map_distance(activities, window_days):
    """Map: activity -> (window_key, distance_yds)."""
    return list(map(
        lambda act: (
            window_key(parse_date(act["startTimeLocal"]), window_days),
            act.get("distance", 0) or 0,
        ),
        activities,
    ))


def reduce_distance(mapped_pairs):
    """Reduce: sum distance_yds per window bucket."""
    return reduce(
        lambda acc, pair: {**acc, pair[0]: acc.get(pair[0], 0) + pair[1]},
        mapped_pairs,
        {},
    )


def summarize_distance(activities, window_days):
    """Map/reduce pipeline: sum distance (yds) per configurable window."""
    mapped = map_distance(activities, window_days)
    totals = reduce_distance(mapped)
    return dict(sorted(totals.items()))


GOAL_MILES = 40
GOAL_DATE = datetime(2026, 3, 21)
YDS_PER_MILE = 1760


def days_remaining():
    """Return the number of days from today until March 21, 2026."""
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    return (GOAL_DATE - today).days


def print_goal_progress(total_yds):
    """Print miles remaining and required daily mileage to hit 40 mi by March 21."""
    total_mi = total_yds / YDS_PER_MILE
    remaining_mi = GOAL_MILES - total_mi
    remaining_days = days_remaining()

    print(f"--- Goal: {GOAL_MILES} mi by {GOAL_DATE.strftime('%Y-%m-%d')} ---\n")
    print(f"  Swum so far:     {total_mi:.2f} mi")
    print(f"  Remaining:       {remaining_mi:.2f} mi")
    print(f"  Days left:       {remaining_days}")
    if remaining_days > 0 and remaining_mi > 0:
        daily_mi = remaining_mi / remaining_days
        print(f"  Avg needed/day:  {daily_mi:.3f} mi/day ({daily_mi * YDS_PER_MILE:.1f} yds/day)")
    elif remaining_mi <= 0:
        print(f"  Goal reached!")


def print_activities(activities):
    for act in activities:
        type_key = act.get("activityType", {}).get("typeKey", "unknown")
        name = act.get("activityName", "Untitled")
        date = act.get("startTimeLocal", "Unknown date")
        distance_yds = act.get("distance", 0) or 0
        duration_s = act.get("duration", 0) or 0
        avg_hr = act.get("averageHR", "N/A")
        calories = act.get("calories", "N/A")
        avg_swolf = act.get("averageSwolf", "N/A")
        strokes = act.get("strokes", "N/A")
        avg_cadence = act.get("averageSwimCadenceInStrokesPerMinute", "N/A")

        mins, secs = divmod(int(duration_s), 60)
        hours, mins = divmod(mins, 60)

        print(f"  {name} [{type_key}]")
        print(f"    Date:     {date}")
        print(f"    Distance: {distance_yds:.1f} yds")
        print(f"    Duration: {hours:02d}:{mins:02d}:{secs:02d}")
        print(f"    Avg HR:   {avg_hr} bpm")
        print(f"    Calories: {calories} kcal")
        print(f"    SWOLF:    {avg_swolf}")
        print(f"    Strokes:  {strokes}  (avg {avg_cadence} spm)")
        print()


def main():
    parser = argparse.ArgumentParser(description="Garmin open water swim stats")
    parser.add_argument(
        "--file", default="Activities.csv",
        help="Path to Garmin activities file (.csv or .json)",
    )
    parser.add_argument(
        "--api", action="store_true",
        help="Fetch activities from Garmin Connect API (uses garmin_config.json for auth)",
    )
    parser.add_argument(
        "--start", default=None,
        help="Start date inclusive (YYYY-MM-DD). Also used as API startDate.",
    )
    parser.add_argument(
        "--end", default=None,
        help="End date inclusive (YYYY-MM-DD). Also used as API endDate.",
    )
    parser.add_argument(
        "--window", type=int, default=7,
        help="Date range window in days for distance summation (default: 7)",
    )
    args = parser.parse_args()

    if args.api:
        start = args.start or "2025-12-21"
        end = args.end or datetime.now().strftime("%Y-%m-%d")
        activities = load_activities_api(start, end)
    elif args.file.endswith(".csv"):
        activities = load_activities_csv(args.file)
    else:
        activities = load_activities(args.file)

    if not args.api:
        if args.start:
            start_dt = datetime.strptime(args.start, "%Y-%m-%d")
            activities = [a for a in activities if parse_date(a["startTimeLocal"]) >= start_dt]
        if args.end:
            end_dt = datetime.strptime(args.end, "%Y-%m-%d").replace(hour=23, minute=59, second=59)
            activities = [a for a in activities if parse_date(a["startTimeLocal"]) <= end_dt]
    print(f"Found {len(activities)} activities\n")

    print_activities(activities)

    # Map/reduce distance summation
    totals = summarize_distance(activities, args.window)
    grand_total = sum(totals.values())

    print(f"--- Distance totals ({args.window}-day windows) ---\n")
    for window_start, yds in totals.items():
        print(f"  {window_start}:  {yds:,.1f} yds  ({yds / YDS_PER_MILE:.2f} mi)")
    print(f"\n  Grand total:  {grand_total:,.1f} yds  ({grand_total / YDS_PER_MILE:.2f} mi)")

    print()
    print_goal_progress(grand_total)


if __name__ == "__main__":
    main()
