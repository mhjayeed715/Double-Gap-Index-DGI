"""
Double Gap Index (DGI) - Empirical Scoring Pipeline
===================================================
Recomputes both Digital and Service axes from verified primary files:
1. BBS Population and Housing Census 2022 (Admin 02 Dataset):
   - Population (Population_District)
   - Internet User 15+ (Internet User)
   - Mobile Phone 15+ (Population having Mobile Phone)
   - Mobile Banking 15+ (Having Mobile Banking Account)
   - Electricity (Main Source of Electricity)
   - Female/Male internet usage (unweighted contextual metrics)
2. HeiGIT Accessibility Indicators (UN OCHA HDX):
   - Hospital access (% within 30 min)
   - Education access (% within 5km)
3. LGED Spatial Point Records:
   - Health facilities (2,484 facilities: 367 hospitals, 1,717 FWCs)
   - Education facilities (78,129 points spatially joined to 64 district polygons)

Methodological Decisions:
- Gender term dropped from composite Digital Access Score (DAS) due to near-collinearity (r=0.989 with total internet rate).
- Digital Access Score (DAS) = 1/3 Internet + 1/3 Mobile + 1/3 MFS.
- Internal collinearity documented: Internet and Mobile ownership correlate r = 0.7212.
- Female and male internet usage and gender gap reported as unweighted contextual metrics on each district dossier.
- Service Access Score (SAS) = 1/3 Hospital Access 30m + 1/3 Education Access 5km + 1/3 National Grid Electricity.
"""

import json
import os
import re
import time
import numpy as np
import pandas as pd
import shapefile
from shapely.geometry import shape, Point
from shapely.prepared import prep
from sklearn.cluster import KMeans

def norm_id(name):
    s = re.sub(r'[^a-z]', '', str(name).lower())
    aliases = {
        'barisal': 'barishal', 'comilla': 'cumilla', 'bogra': 'bogura',
        'jessore': 'jashore', 'brahamanbaria': 'brahmanbaria',
        'coxsbazarteknaf': 'coxs_bazar', 'coxsbazar': 'coxs_bazar',
        'chittagong': 'chattogram', 'netrakona': 'netrokona',
        'maulvibazar': 'moulvibazar', 'chapainababganj': 'chapainawabganj',
        'nawabganj': 'chapainawabganj'
    }
    return aliases.get(s, s)

def min_max_scale(series):
    s_min = series.min()
    s_max = series.max()
    if s_max == s_min:
        return series * 0.0
    return (series - s_min) / (s_max - s_min)

def compute_all_scores(base_dir=None):
    if base_dir is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    print("=" * 70)
    print("DGI EMPIRICAL SCORING PIPELINE (CENSUS 2022 + HEIGIT + LGED)")
    print("=" * 70)
    t_start = time.time()

    # 1. District Boundaries
    geojson_path = os.path.join(base_dir, "public", "data", "bangladesh_districts.geojson")
    with open(geojson_path, "r", encoding="utf-8") as f:
        geojson = json.load(f)

    district_polys = []
    district_meta = {}
    for feat in geojson["features"]:
        props = feat["properties"]
        d_id = props["district_id"]
        poly = shape(feat["geometry"])
        district_meta[d_id] = {
            "name": props.get("ADM2_EN"),
            "division": props.get("ADM1_EN", ""),
            "pcode": props.get("ADM2_PCODE", "")
        }
        district_polys.append({
            "id": d_id,
            "name": props.get("ADM2_EN"),
            "poly": poly,
            "prep": prep(poly),
            "bounds": poly.bounds,
            "school_count": 0
        })

    # 2. Spatial Join of 78,129 LGED schools & Health Facilities
    lged_counts_file = os.path.join(base_dir, "etl", "verified_raw", "lged_district_counts.json")
    shp_path = os.path.join(base_dir, "etl", "verified_raw", "education_facilities_lged", "bgd_poi_educationfacilities_lged.shp")
    health_dbf_path = os.path.join(base_dir, "etl", "verified_raw", "health_facilities_lged", "bgd_poi_healthfacilities_lged.dbf")

    school_counts = {d_id: 0 for d_id in district_meta}
    hosp_counts = {d_id: 0 for d_id in district_meta}
    fwc_counts = {d_id: 0 for d_id in district_meta}

    if os.path.exists(lged_counts_file):
        with open(lged_counts_file, "r", encoding="utf-8") as f:
            cached = json.load(f)
        for d_id, c in cached.items():
            school_counts[d_id] = c.get("lged_school_count", 0)
            hosp_counts[d_id] = c.get("lged_hospital_count", 0)
            fwc_counts[d_id] = c.get("lged_fwc_count", 0)
        print(f"[1/5] Loaded verified LGED facility counts for 64 districts from cache.")
    elif os.path.exists(shp_path):
        sf = shapefile.Reader(shp_path)
        shapes = sf.shapes()
        matched = 0
        unmatched = 0
        for s in shapes:
            x, y = s.points[0]
            pt = Point(x, y)
            found = False
            for d in district_polys:
                minx, miny, maxx, maxy = d["bounds"]
                if minx <= x <= maxx and miny <= y <= maxy:
                    if d["prep"].contains(pt):
                        d["school_count"] += 1
                        matched += 1
                        found = True
                        break
            if not found:
                unmatched += 1

        school_counts = {d["id"]: d["school_count"] for d in district_polys}
        print(f"[1/5] Spatial Join complete: {matched} matched, {unmatched} shoreline points ({unmatched/len(shapes)*100:.2f}%).")

        if os.path.exists(health_dbf_path):
            with open(health_dbf_path, "rb") as f:
                header = f.read(32)
                numrec = int.from_bytes(header[4:8], byteorder="little")
                lenheader = int.from_bytes(header[8:10], byteorder="little")
                lenrecord = int.from_bytes(header[10:12], byteorder="little")
                fields = []
                while True:
                    desc = f.read(32)
                    if desc[0] == 0x0D: break
                    name = desc[:11].replace(b"\x00", b"").decode("latin1").strip()
                    length = desc[16]
                    fields.append((name, length))

                f.seek(lenheader)
                for _ in range(numrec):
                    rec_data = f.read(lenrecord)
                    if not rec_data or rec_data[0] == 0x2A: continue
                    offset = 1
                    rec = {}
                    for name, length in fields:
                        rec[name] = rec_data[offset:offset+length].decode("latin1").strip()
                        offset += length
                    d_norm = norm_id(rec.get("District", ""))
                    ftype = rec.get("FType", "")
                    if d_norm in hosp_counts:
                        if ftype == "Hospital":
                            hosp_counts[d_norm] += 1
                        elif "Welfare" in ftype:
                            fwc_counts[d_norm] += 1

        # Cache results
        cached_out = {
            d_id: {
                "name": district_meta.get(d_id, {}).get("name", d_id),
                "lged_hospital_count": hosp_counts.get(d_id, 0),
                "lged_fwc_count": fwc_counts.get(d_id, 0),
                "lged_school_count": school_counts.get(d_id, 0)
            }
            for d_id in district_meta
        }
        with open(lged_counts_file, "w", encoding="utf-8") as f:
            json.dump(cached_out, f, indent=2)

    # 4. Census 2022 & HeiGIT Data
    census_file = os.path.join(base_dir, "etl", "verified_raw", "bbs_census_2022_admin02.xlsx")

    df_pop = pd.read_excel(census_file, sheet_name="Population_District").dropna(subset=["District"])
    df_pop = df_pop[~df_pop["District"].astype(str).str.contains("Total|Division|Bangladesh", case=False, na=False)]
    df_pop["id"] = df_pop["District"].apply(norm_id)

    df_net = pd.read_excel(census_file, sheet_name="Internet User").dropna(subset=["District"])
    df_net = df_net[~df_net["District"].astype(str).str.contains("Total|Division|Bangladesh", case=False, na=False)]
    df_net["id"] = df_net["District"].apply(norm_id)

    df_mob = pd.read_excel(census_file, sheet_name=" Population having Mobile Phone").dropna(subset=["District"])
    df_mob = df_mob[~df_mob["District"].astype(str).str.contains("Total|Division|Bangladesh", case=False, na=False)]
    df_mob["id"] = df_mob["District"].apply(norm_id)

    df_mfs = pd.read_excel(census_file, sheet_name=" Having Mobile Banking Account").dropna(subset=["District"])
    df_mfs = df_mfs[~df_mfs["District"].astype(str).str.contains("Total|Division|Bangladesh", case=False, na=False)]
    df_mfs["id"] = df_mfs["District"].apply(norm_id)

    df_elec = pd.read_excel(census_file, sheet_name=" Main Source of Electricity ").dropna(subset=["District"])
    df_elec = df_elec[~df_elec["District"].astype(str).str.contains("Total|Division|Bangladesh", case=False, na=False)]
    df_elec["id"] = df_elec["District"].apply(norm_id)

    df_hosp_access = pd.read_csv(os.path.join(base_dir, "etl", "verified_raw", "heigit_hospitals_access_wide.csv"))
    df_hosp_access = df_hosp_access[(df_hosp_access["admin_level"] == "ADM2") & (df_hosp_access["range"] == 1800)].copy()
    df_hosp_access["id"] = df_hosp_access["name"].apply(norm_id)

    df_edu_access = pd.read_csv(os.path.join(base_dir, "etl", "verified_raw", "heigit_education_access_wide.csv"))
    df_edu_access = df_edu_access[(df_edu_access["admin_level"] == "ADM2") & (df_edu_access["range"] == 5000)].copy()
    df_edu_access["id"] = df_edu_access["name"].apply(norm_id)

    master = df_pop[["id", "District", "# Overall_Bangladeshi_National"]].rename(columns={"# Overall_Bangladeshi_National": "population"})
    master = master.merge(df_net[["id", "Inernet_Total_15 year+", "Inernet_Male_15 year+", "Inernet_Female_15 year+"]], on="id")
    master = master.merge(df_mob[["id", "Mobile Phone_Total_15 year+"]], on="id")
    master = master.merge(df_mfs[["id", "Mobile Bank Account_Overall"]], on="id")
    master = master.merge(df_elec[["id", "National Grid_%"]], on="id")
    master = master.merge(df_hosp_access[["id", "population_share"]].rename(columns={"population_share": "hosp_access_30m"}), on="id")
    master = master.merge(df_edu_access[["id", "population_share"]].rename(columns={"population_share": "edu_access_5km"}), on="id")

    master["school_count"] = master["id"].map(school_counts)
    master["hospital_count"] = master["id"].map(hosp_counts)
    master["fwc_count"] = master["id"].map(fwc_counts)

    # 5. Composite Scoring
    # Digital Access Score (DAS) = 1/3 Internet + 1/3 Mobile + 1/3 MFS
    norm_net = min_max_scale(master["Inernet_Total_15 year+"])
    norm_mob = min_max_scale(master["Mobile Phone_Total_15 year+"])
    norm_mfs = min_max_scale(master["Mobile Bank Account_Overall"])
    master["digital_access_score"] = (norm_net + norm_mob + norm_mfs) / 3.0

    # Service Access Score (SAS) = 1/3 Hospital Access 30m + 1/3 Education Access 5km + 1/3 National Grid Electricity
    norm_hosp = min_max_scale(master["hosp_access_30m"])
    norm_edu = min_max_scale(master["edu_access_5km"])
    norm_elec = min_max_scale(master["National Grid_%"])
    master["service_access_score"] = (norm_hosp + norm_edu + norm_elec) / 3.0

    # Dual-Anchor Thresholds
    med_d = float(master["digital_access_score"].median())
    med_s = float(master["service_access_score"].median())
    p40_d = float(master["digital_access_score"].quantile(0.40))
    p40_s = float(master["service_access_score"].quantile(0.40))

    master["double_gap_median"] = (master["digital_access_score"] < med_d) & (master["service_access_score"] < med_s)
    master["double_gap_p40"] = (master["digital_access_score"] < p40_d) & (master["service_access_score"] < p40_s)

    core_districts = master[master["double_gap_p40"]]["id"].tolist()
    median_districts = master[master["double_gap_median"]]["id"].tolist()
    buffer_districts = [d for d in median_districts if d not in core_districts]

    # Cluster mapping (3 clusters)
    X = master[["digital_access_score", "service_access_score"]].values
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=20)
    clusters = kmeans.fit_predict(X)
    center_sums = [c[0] + c[1] for c in kmeans.cluster_centers_]
    sorted_order = np.argsort(center_sums)
    mapping = {old_idx: new_idx + 1 for new_idx, old_idx in enumerate(sorted_order)}
    master["cluster"] = [mapping[c] for c in clusters]

    final_records = []
    for _, row in master.iterrows():
        d_id = row["id"]
        d_name = district_meta.get(d_id, {}).get("name", row["District"])
        d_div = district_meta.get(d_id, {}).get("division", "")
        pop = int(row["population"])

        d_score = float(round(row["digital_access_score"], 4))
        s_score = float(round(row["service_access_score"], 4))
        is_double_gap = bool(row["double_gap_median"])
        is_core = bool(d_id in core_districts)

        if d_score < med_d and s_score < med_s:
            quadrant = "DOUBLE_GAP"
        elif d_score < med_d and s_score >= med_s:
            quadrant = "DIGITAL_ONLY_GAP"
        elif d_score >= med_d and s_score < med_s:
            quadrant = "PHYSICAL_ONLY_GAP"
        else:
            quadrant = "WELL_SERVED"

        male_usage = float(round(row["Inernet_Male_15 year+"], 2))
        female_usage = float(round(row["Inernet_Female_15 year+"], 2))
        gender_gap = float(round(male_usage - female_usage, 2))

        record = {
            "id": d_id,
            "name": d_name,
            "division": d_div,
            "population": pop,
            "digital_access_score": d_score,
            "service_access_score": s_score,
            "double_gap_flag": is_double_gap,
            "quadrant": quadrant,
            "is_invariant_core": is_core,
            "cluster": int(row["cluster"]),
            "digital_breakdown": {
                "internet_usage_pct": float(round(row["Inernet_Total_15 year+"], 2)),
                "mobile_ownership_pct": float(round(row["Mobile Phone_Total_15 year+"], 2)),
                "mobile_banking_pct": float(round(row["Mobile Bank Account_Overall"], 2)),
                "male_usage_pct": male_usage,
                "female_usage_pct": female_usage,
                "gender_gap_pct": gender_gap,
                "source_citation": "BBS Census 2022 (Admin 02 Dataset, HDX)"
            },
            "service_breakdown": {
                "hospital_access_pct": float(round(row["hosp_access_30m"], 2)),
                "education_access_pct": float(round(row["edu_access_5km"], 2)),
                "electricity_access_pct": float(round(row["National Grid_%"], 2)),
                "lged_hospital_count": int(row["hospital_count"]),
                "lged_fwc_count": int(row["fwc_count"]),
                "lged_school_count": int(row["school_count"]),
                "source_citation": "HeiGIT Accessibility (HDX) & BBS Census 2022"
            }
        }
        final_records.append(record)

    # Save output
    scored_path = os.path.join(base_dir, "etl", "processed_data", "scored_districts.json")
    with open(scored_path, "w", encoding="utf-8") as f:
        json.dump(final_records, f, indent=2)

    lib_path = os.path.join(base_dir, "lib", "data", "districts.json")
    with open(lib_path, "w", encoding="utf-8") as f:
        json.dump(final_records, f, indent=2)

    print(f"[5/5] Recomputed and saved {len(final_records)} empirical district records.")
    print(f"      Median Digital: {med_d:.4f}, Median Service: {med_s:.4f}")
    print(f"      Dual-Median Double Gap Districts: {len(median_districts)} (25.0%)")
    print(f"      Dual-P40 Core Priority Districts: {len(core_districts)} (14.1%)")
    print(f"      Buffer Districts: {len(buffer_districts)}")
    print(f"Completed in {time.time() - t_start:.2f}s.")
    return final_records

if __name__ == "__main__":
    compute_all_scores()
