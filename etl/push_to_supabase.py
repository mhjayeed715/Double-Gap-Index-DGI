"""
Pushes computed district indicators and scores to Supabase database.
Reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from environment.
"""

import json
import os
import sys

try:
    from supabase import create_client, Client
except ImportError:
    print("supabase package not installed. Run: pip install supabase")
    sys.exit(0)


def push_data():
    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not supabase_key:
        print("Note: Supabase credentials not set in environment.")
        print("To push to Supabase, set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.")
        return

    client: Client = create_client(supabase_url, supabase_key)

    data_path = os.path.join(os.path.dirname(__file__), "processed_data/scored_districts.json")
    if not os.path.exists(data_path):
        print("processed_data/scored_districts.json not found. Run compute_scores.py first.")
        return

    with open(data_path, "r", encoding="utf-8") as f:
        records = json.load(f)

    for item in records:
        # Upsert district
        client.table("districts").upsert({
            "id": item["id"],
            "name": item["name"],
            "division": item["division"],
            "population": item["population"]
        }).execute()

        # Upsert digital indicators
        db = item["digital_breakdown"]
        client.table("digital_indicators").upsert({
            "district_id": item["id"],
            "internet_usage_pct": db["internet_usage_pct"],
            "smartphone_ownership_pct": db["smartphone_ownership_pct"],
            "digital_skills_pct": db["digital_skills_pct"],
            "gender_gap_pct": db["gender_gap_pct"],
            "source_citation": db["source_citation"]
        }).execute()

        # Upsert service indicators
        sb = item["service_breakdown"]
        client.table("service_indicators").upsert({
            "district_id": item["id"],
            "healthcare_facility_count": sb["healthcare_facility_count"],
            "education_facility_count": sb["education_facility_count"],
            "transit_point_count": sb["transit_point_count"],
            "healthcare_per_capita": sb["healthcare_per_capita"],
            "education_per_capita": sb["education_per_capita"],
            "transit_per_capita": sb["transit_per_capita"],
            "source_citation": sb["source_citation"]
        }).execute()

        # Upsert scores
        client.table("scores").upsert({
            "district_id": item["id"],
            "digital_access_score": item["digital_access_score"],
            "service_access_score": item["service_access_score"],
            "double_gap_flag": item["double_gap_flag"]
        }).execute()

    print(f"Successfully pushed {len(records)} districts to Supabase!")


if __name__ == "__main__":
    push_data()
