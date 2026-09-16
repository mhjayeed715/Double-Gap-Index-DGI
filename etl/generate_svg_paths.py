import json
import math

with open("public/data/bangladesh_districts.geojson", "r", encoding="utf-8") as f:
    geo = json.load(f)

# Collect all coordinates to find exact bounding box
lons = []
lats = []

def extract_coords(geom):
    gtype = geom["type"]
    coords = geom["coordinates"]
    if gtype == "Polygon":
        for ring in coords:
            for pt in ring:
                lons.append(pt[0])
                lats.append(pt[1])
    elif gtype == "MultiPolygon":
        for poly in coords:
            for ring in poly:
                for pt in ring:
                    lons.append(pt[0])
                    lats.append(pt[1])

for feat in geo["features"]:
    extract_coords(feat["geometry"])

min_lon, max_lon = min(lons), max(lons)
min_lat, max_lat = min(lats), max(lats)

print(f"Bangladesh bounds: Lon [{min_lon:.4f}, {max_lon:.4f}], Lat [{min_lat:.4f}, {max_lat:.4f}]")

# SVG Viewport setup
width = 800
height = 1000
padding = 45

mid_lat = (min_lat + max_lat) / 2.0
cos_mid = math.cos(math.radians(mid_lat))

dx = (max_lon - min_lon) * cos_mid
dy = max_lat - min_lat

scale_x = (width - 2 * padding) / dx
scale_y = (height - 2 * padding) / dy
scale = min(scale_x, scale_y)

w_px = dx * scale
h_px = dy * scale

offset_x = (width - w_px) / 2.0
offset_y = (height - h_px) / 2.0

print(f"Scale: {scale:.2f}, Width px: {w_px:.1f}, Height px: {h_px:.1f}, Offset: ({offset_x:.1f}, {offset_y:.1f})")

def project(lon, lat):
    x = offset_x + (lon - min_lon) * cos_mid * scale
    y = offset_y + (max_lat - lat) * scale
    return round(x, 1), round(y, 1)

def polygon_to_path(rings):
    path_parts = []
    for ring in rings:
        pts = [project(p[0], p[1]) for p in ring]
        if not pts:
            continue
        dedup = [pts[0]]
        for p in pts[1:]:
            if p != dedup[-1]:
                dedup.append(p)
        if len(dedup) < 3:
            continue
        cmds = [f"M {dedup[0][0]},{dedup[0][1]}"]
        for p in dedup[1:]:
            cmds.append(f"L {p[0]},{p[1]}")
        cmds.append("Z")
        path_parts.append(" ".join(cmds))
    return " ".join(path_parts)

features_out = []

with open("lib/data/districts.json", "r", encoding="utf-8") as f:
    local_districts = {d["id"]: d for d in json.load(f)}

for feat in geo["features"]:
    props = feat["properties"]
    dist_id = props.get("district_id")
    dist_meta = local_districts.get(dist_id, {})
    geom = feat["geometry"]
    gtype = geom["type"]
    coords = geom["coordinates"]

    paths = []
    all_pts = []
    if gtype == "Polygon":
        paths.append(polygon_to_path(coords))
        for ring in coords:
            all_pts.extend(ring)
    elif gtype == "MultiPolygon":
        for poly in coords:
            paths.append(polygon_to_path(poly))
            for ring in poly:
                all_pts.extend(ring)

    # Compute centroid
    c_lon = sum(p[0] for p in all_pts) / len(all_pts)
    c_lat = sum(p[1] for p in all_pts) / len(all_pts)
    cx, cy = project(c_lon, c_lat)

    full_d = " ".join(p for p in paths if p.strip())

    features_out.append({
        "id": dist_id,
        "name": dist_meta.get("name", props.get("ADM2_EN")),
        "division": dist_meta.get("division", props.get("ADM1_EN") + " Division"),
        "cx": cx,
        "cy": cy,
        "d": full_d
    })

# Sort alphabetically by id
features_out.sort(key=lambda x: x["id"])

print(f"Generated {len(features_out)} exact geographic district paths!")
sample = [f for f in features_out if f["id"] == "dhaka"][0]
print("Dhaka:", sample["cx"], sample["cy"], "Panchagarh:", [f for f in features_out if f["id"] == "panchagarh"][0]["cy"])

with open("lib/data/accurate_districts_map.json", "w", encoding="utf-8") as f:
    json.dump(features_out, f, indent=2)

ts_content = f"""/**
 * Authentic, exact area-wise geographic boundaries for all 64 districts of Bangladesh.
 * Projected with accurate geographic aspect ratio from official BBS/OCHA administrative shapefiles.
 * Viewport: 0 0 {width} {height}
 */

export interface DistrictMapFeature {{
  id: string;
  name: string;
  division: string;
  cx: number;
  cy: number;
  d: string;
}}

export const BANGLADESH_DISTRICTS_MAP: DistrictMapFeature[] = {json.dumps(features_out, indent=2)};
"""

with open("lib/data/map_coordinates.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print("Updated lib/data/map_coordinates.ts successfully!")
