"""
Double Gap Index (DGI) - Python Scoring Pipeline
Implements normalization and scoring formulas per 04_DATA_MODEL.md.
Supports both Pandas and native Python standard library (zero-dependency fallback).
"""

import csv
import json
import math
import os
import sys


def min_max_scale(values):
    """Min-max normalization scaling non-None numbers to [0, 1]."""
    valid = [v for v in values if v is not None and not math.isnan(v)]
    if not valid:
        return [None for _ in values]
    v_min = min(valid)
    v_max = max(valid)
    if v_max == v_min:
        return [0.5 if v is not None else None for v in values]
    return [round((v - v_min) / (v_max - v_min), 5) if (v is not None and not math.isnan(v)) else None for v in values]


def compute_dgi(
    bbs_path: str = "raw_data/bbs_ict_2025.csv",
    osm_path: str = "raw_data/osm_facilities.csv",
    pop_path: str = "raw_data/population.csv",
    output_json_path: str = "processed_data/scored_districts.json",
    app_data_path: str = "../lib/data/districts.json",
    threshold: float = 0.40
):
    """
    Computes Digital Access Score, Service Access Score, and Double Gap Flag for all 64 districts.
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))
    bbs_file = os.path.join(script_dir, bbs_path)
    osm_file = os.path.join(script_dir, osm_path)
    pop_file = os.path.join(script_dir, pop_path)

    # 1. Read Population
    pop_map = {}
    with open(pop_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            pop_map[r["district_id"]] = {
                "population": int(r["population"]) if r["population"] else None,
                "census_year": int(r["census_year"]) if r.get("census_year") else 2022
            }

    # 2. Read OSM Facilities
    osm_map = {}
    with open(osm_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            osm_map[r["district_id"]] = {
                "healthcare": int(r["healthcare_facility_count"]) if r["healthcare_facility_count"] else 0,
                "education": int(r["education_facility_count"]) if r["education_facility_count"] else 0,
                "transit": int(r["transit_point_count"]) if r["transit_point_count"] else 0,
                "source_citation": r.get("source_citation", "OpenStreetMap, extracted 2026-03-12")
            }

    # 3. Read BBS ICT Survey
    districts = []
    with open(bbs_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            d_id = r["district_id"]
            pop_info = pop_map.get(d_id, {"population": None})
            osm_info = osm_map.get(d_id, {"healthcare": 0, "education": 0, "transit": 0, "source_citation": ""})

            pop = pop_info["population"]
            h_count = osm_info["healthcare"]
            e_count = osm_info["education"]
            t_count = osm_info["transit"]

            h_per_capita = (h_count / pop * 100000.0) if pop else None
            e_per_capita = (e_count / pop * 100000.0) if pop else None
            t_per_capita = (t_count / pop * 100000.0) if pop else None

            # Helper for floats or None
            def parse_float(val):
                if val is None or val.strip() == "":
                    return None
                try:
                    return float(val)
                except ValueError:
                    return None

            internet = parse_float(r.get("internet_usage_pct"))
            smart = parse_float(r.get("smartphone_ownership_pct"))
            skills = parse_float(r.get("digital_skills_pct"))
            gender_gap = parse_float(r.get("gender_gap_pct"))
            inv_gender = (100.0 - gender_gap) if gender_gap is not None else None

            districts.append({
                "id": d_id,
                "name": r["district_name"],
                "division": r["division"],
                "population": pop,
                "internet_usage_pct": internet,
                "smartphone_ownership_pct": smart,
                "digital_skills_pct": skills,
                "gender_gap_pct": gender_gap,
                "inverse_gender_gap": inv_gender,
                "digital_citation": r.get("source_citation", "BBS ICT Survey 2024-25"),
                "healthcare_facility_count": h_count,
                "education_facility_count": e_count,
                "transit_point_count": t_count,
                "healthcare_per_capita": h_per_capita,
                "education_per_capita": e_per_capita,
                "transit_per_capita": t_per_capita,
                "service_citation": osm_info["source_citation"]
            })

    # 4. Perform min-max normalization across all districts
    norm_internet = min_max_scale([d["internet_usage_pct"] for d in districts])
    norm_smart = min_max_scale([d["smartphone_ownership_pct"] for d in districts])
    norm_skills = min_max_scale([d["digital_skills_pct"] for d in districts])
    norm_gender = min_max_scale([d["inverse_gender_gap"] for d in districts])

    norm_health = min_max_scale([d["healthcare_per_capita"] for d in districts])
    norm_edu = min_max_scale([d["education_per_capita"] for d in districts])
    norm_transit = min_max_scale([d["transit_per_capita"] for d in districts])

    # 5. Compute scores
    records = []
    for i, d in enumerate(districts):
        # Digital indicators (equal weight across available sub-indicators)
        d_indicators = [
            norm_internet[i],
            norm_smart[i],
            norm_skills[i],
            norm_gender[i]
        ]
        valid_d = [val for val in d_indicators if val is not None]
        digital_score = round(sum(valid_d) / len(valid_d), 3) if valid_d else None

        # Service indicators (equal weight 0.333 each)
        s_indicators = [
            norm_health[i],
            norm_edu[i],
            norm_transit[i]
        ]
        valid_s = [val for val in s_indicators if val is not None]
        service_score = round(sum(valid_s) / len(valid_s), 3) if valid_s else None

        # Double gap flag: True if BOTH scores are below threshold
        double_gap = bool(
            digital_score is not None and
            service_score is not None and
            digital_score < threshold and
            service_score < threshold
        )

        rec = {
            "id": d["id"],
            "name": d["name"],
            "division": d["division"],
            "population": d["population"],
            "digital_access_score": digital_score,
            "service_access_score": service_score,
            "double_gap_flag": double_gap,
            "digital_breakdown": {
                "internet_usage_pct": d["internet_usage_pct"],
                "smartphone_ownership_pct": d["smartphone_ownership_pct"],
                "digital_skills_pct": d["digital_skills_pct"],
                "gender_gap_pct": d["gender_gap_pct"],
                "source_citation": d["digital_citation"]
            },
            "service_breakdown": {
                "healthcare_facility_count": d["healthcare_facility_count"],
                "education_facility_count": d["education_facility_count"],
                "transit_point_count": d["transit_point_count"],
                "healthcare_per_capita": round(d["healthcare_per_capita"], 2) if d["healthcare_per_capita"] is not None else None,
                "education_per_capita": round(d["education_per_capita"], 2) if d["education_per_capita"] is not None else None,
                "transit_per_capita": round(d["transit_per_capita"], 2) if d["transit_per_capita"] is not None else None,
                "source_citation": d["service_citation"]
            }
        }
        records.append(rec)

    # 6. Save outputs
    os.makedirs(os.path.join(script_dir, "processed_data"), exist_ok=True)
    full_output_json = os.path.join(script_dir, output_json_path)
    with open(full_output_json, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)

    # Save to Next.js app lib/data
    full_app_path = os.path.join(script_dir, app_data_path)
    os.makedirs(os.path.dirname(full_app_path), exist_ok=True)
    with open(full_app_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)

    # Save CSV
    csv_path = os.path.join(script_dir, "processed_data/scored_districts.csv")
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "id", "name", "division", "population",
            "digital_access_score", "service_access_score", "double_gap_flag",
            "internet_usage_pct", "smartphone_ownership_pct", "digital_skills_pct", "gender_gap_pct",
            "healthcare_per_capita", "education_per_capita", "transit_per_capita"
        ])
        for r in records:
            writer.writerow([
                r["id"], r["name"], r["division"], r["population"],
                r["digital_access_score"], r["service_access_score"], r["double_gap_flag"],
                r["digital_breakdown"]["internet_usage_pct"],
                r["digital_breakdown"]["smartphone_ownership_pct"],
                r["digital_breakdown"]["digital_skills_pct"],
                r["digital_breakdown"]["gender_gap_pct"],
                r["service_breakdown"]["healthcare_per_capita"],
                r["service_breakdown"]["education_per_capita"],
                r["service_breakdown"]["transit_per_capita"],
            ])

    double_gap_districts = [r["name"] for r in records if r["double_gap_flag"]]
    print(f"Scoring complete! Processed {len(records)} districts.")
    print(f"Identified {len(double_gap_districts)} Double Gap districts (both scores < {threshold}):")
    print(", ".join(double_gap_districts))

    return records


if __name__ == "__main__":
    compute_dgi()
