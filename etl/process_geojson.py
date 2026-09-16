import urllib.request
import json
import os

url = "https://raw.githubusercontent.com/ahnaf-tahmid-chowdhury/Choropleth-Bangladesh/master/bangladesh_geojson_adm2_64_districts_zillas.json"
print("Downloading authentic GeoJSON from ahnaf-tahmid-chowdhury...")
with urllib.request.urlopen(url) as r:
    geo = json.loads(r.read().decode("utf-8"))

os.makedirs("public/data", exist_ok=True)
with open("public/data/bangladesh_districts.geojson", "w", encoding="utf-8") as f:
    json.dump(geo, f)

with open("lib/data/districts.json", "r", encoding="utf-8") as f:
    local_districts = json.load(f)

local_map = {d["name"].lower(): d["id"] for d in local_districts}
# Manual aliases for historical spelling variations
name_aliases = {
    "barisal": "barishal",
    "bogra": "bogura",
    "chittagong": "chattogram",
    "comilla": "cumilla",
    "cox's bazar": "coxsbazar",
    "coxs bazar": "coxsbazar",
    "dacca": "dhaka",
    "jessore": "jashore",
    "moulvibazar": "moulvibazar",
    "netrakona": "netrokona",
    "chapainawabganj": "chapainawabganj",
    "nawabganj": "chapainawabganj",
}

print(f"Total GeoJSON features: {len(geo['features'])}")

matched = 0
mapping = {}
for feat in geo["features"]:
    name = feat["properties"]["ADM2_EN"]
    cleaned = name.lower().strip()
    target_id = None

    if cleaned in local_map:
        target_id = local_map[cleaned]
    elif cleaned in name_aliases:
        alias = name_aliases[cleaned]
        if alias in local_map:
            target_id = local_map[alias]
        else:
            target_id = alias
    else:
        # fuzzy / startsWith
        for lname, lid in local_map.items():
            if lname.startswith(cleaned[:4]):
                target_id = lid
                break

    if target_id:
        matched += 1
        mapping[name] = target_id
    else:
        print(f"Unmatched: {name}")

print(f"Successfully matched: {matched} / {len(geo['features'])}")

# Add 'district_id' to GeoJSON feature properties for effortless frontend lookup
for feat in geo["features"]:
    name = feat["properties"]["ADM2_EN"]
    if name in mapping:
        feat["properties"]["district_id"] = mapping[name]
        feat["id"] = mapping[name]

with open("public/data/bangladesh_districts.geojson", "w", encoding="utf-8") as f:
    json.dump(geo, f)

print("Saved mapped GeoJSON to public/data/bangladesh_districts.geojson")
