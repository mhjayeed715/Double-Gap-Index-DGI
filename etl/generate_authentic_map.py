import json
import math

# Load authentic GeoJSON
with open("public/data/bangladesh_districts.geojson", "r", encoding="utf-8") as f:
    geo = json.load(f)

# Load metadata for names and divisions
with open("lib/data/districts.json", "r", encoding="utf-8") as f:
    meta_list = json.load(f)
    meta_map = {d["id"]: d for d in meta_list}

def mercator_y(lat):
    lat_rad = math.radians(lat)
    return math.log(math.tan(math.pi / 4 + lat_rad / 2))

# Find overall bounds
lons, lats, merc_ys = [], [], []

def collect(coords, gtype):
    rings = coords if gtype == "Polygon" else [r for poly in coords for r in poly]
    for ring in rings:
        for pt in ring:
            lons.append(pt[0])
            lats.append(pt[1])
            merc_ys.append(mercator_y(pt[1]))

for feat in geo["features"]:
    collect(feat["geometry"]["coordinates"], feat["geometry"]["type"])

min_lon, max_lon = min(lons), max(lons)
min_lat, max_lat = min(lats), max(lats)
min_my, max_my = min(merc_ys), max(merc_ys)

rad_min_lon = math.radians(min_lon)
rad_lon_span = math.radians(max_lon) - rad_min_lon
my_span = max_my - min_my

# Target SVG Viewport: 800 x 1000
viewport_w = 800
viewport_h = 1000

# We want around 70px margin on sides, 50px top/bottom
target_w = 660
scale = target_w / rad_lon_span
target_h = my_span * scale

offset_x = (viewport_w - target_w) / 2.0
offset_y = (viewport_h - target_h) / 2.0

print(f"Viewport: {viewport_w}x{viewport_h}")
print(f"Projected map size: {target_w:.1f}w x {target_h:.1f}h, Offsets: ({offset_x:.1f}, {offset_y:.1f})")

def project(lon, lat):
    x = offset_x + (math.radians(lon) - rad_min_lon) * scale
    y = offset_y + (max_my - mercator_y(lat)) * scale
    return round(x, 1), round(y, 1)

# Douglas-Peucker point-line distance
def pt_line_dist(pt, start, end):
    if start == end:
        return math.hypot(pt[0] - start[0], pt[1] - start[1])
    n = abs((end[1] - start[1]) * pt[0] - (end[0] - start[0]) * pt[1] + end[0] * start[1] - end[1] * start[0])
    d = math.hypot(end[1] - start[1], end[0] - start[0])
    return n / d if d > 0 else 0

def simplify_points(pts, tol=0.8):
    if len(pts) <= 3:
        return pts
    dmax = 0
    idx = 0
    for i in range(1, len(pts) - 1):
        d = pt_line_dist(pts[i], pts[0], pts[-1])
        if d > dmax:
            dmax = d
            idx = i
    if dmax > tol:
        rec1 = simplify_points(pts[:idx + 1], tol)
        rec2 = simplify_points(pts[idx:], tol)
        return rec1[:-1] + rec2
    else:
        return [pts[0], pts[-1]]

def polygon_area(pts):
    n = len(pts)
    if n < 3:
        return 0
    area = 0.0
    for i in range(n):
        j = (i + 1) % n
        area += pts[i][0] * pts[j][1]
        area -= pts[j][0] * pts[i][1]
    return abs(area) / 2.0

def polygon_centroid(pts):
    n = len(pts)
    if n < 3:
        return pts[0] if pts else (0, 0)
    cx, cy, signed_area = 0.0, 0.0, 0.0
    for i in range(n):
        j = (i + 1) % n
        a = pts[i][0] * pts[j][1] - pts[j][0] * pts[i][1]
        signed_area += a
        cx += (pts[i][0] + pts[j][0]) * a
        cy += (pts[i][1] + pts[j][1]) * a
    if abs(signed_area) < 1e-5:
        # Fallback to mean
        return round(sum(p[0] for p in pts) / n, 1), round(sum(p[1] for p in pts) / n, 1)
    signed_area *= 0.5
    cx = cx / (6.0 * signed_area)
    cy = cy / (6.0 * signed_area)
    return round(cx, 1), round(cy, 1)

districts_output = []

for feat in geo["features"]:
    props = feat["properties"]
    dist_id = props.get("district_id")
    dist_name = props.get("ADM2_EN")
    meta = meta_map.get(dist_id, {})
    name = meta.get("name", dist_name)
    division = meta.get("division", props.get("ADM1_EN", "") + " Division")

    geom = feat["geometry"]
    gtype = geom["type"]
    raw_coords = geom["coordinates"]

    polys = [raw_coords] if gtype == "Polygon" else raw_coords

    all_paths = []
    largest_ring = []
    max_ring_area = 0

    for poly in polys:
        exterior = poly[0]
        pts = [project(pt[0], pt[1]) for pt in exterior]
        # Remove consecutive duplicates
        dedup = [pts[0]]
        for p in pts[1:]:
            if p != dedup[-1]:
                dedup.append(p)
        if len(dedup) < 3:
            continue
        
        area = polygon_area(dedup)
        # Filter tiny specks (< 12 sq pixels) to remove coastline noise
        if area < 12 and len(polys) > 1:
            continue

        simplified = simplify_points(dedup, tol=0.7)
        if len(simplified) < 3:
            simplified = dedup

        if area > max_ring_area:
            max_ring_area = area
            largest_ring = simplified

        cmds = [f"M {simplified[0][0]},{simplified[0][1]}"]
        for p in simplified[1:]:
            cmds.append(f"L {p[0]},{p[1]}")
        cmds.append("Z")
        all_paths.append(" ".join(cmds))

    cx, cy = polygon_centroid(largest_ring) if largest_ring else (0, 0)

    districts_output.append({
        "id": dist_id,
        "name": name,
        "division": division,
        "cx": cx,
        "cy": cy,
        "d": " ".join(all_paths)
    })

# Sort alphabetically by id
districts_output.sort(key=lambda x: x["id"])

print(f"Processed {len(districts_output)} districts.")

# Write to TypeScript file directly
ts_code = '''/**
 * Authentic Geographic SVG boundary paths and centroids for all 64 districts of Bangladesh
 * Maintained with true geographic shape, river boundaries, and coastal topology.
 * Projection: Conformal Mercator centered on Bangladesh.
 * Viewport: 0 0 800 1000
 */

export interface DistrictMapFeature {
  id: string;
  name: string;
  division: string;
  cx: number;
  cy: number;
  d: string;
}

export const BANGLADESH_DISTRICTS_MAP: DistrictMapFeature[] = ''' + json.dumps(districts_output, indent=2) + ";\n"

with open("lib/data/map_coordinates.ts", "w", encoding="utf-8") as f:
    f.write(ts_code)

print("[OK] Successfully generated lib/data/map_coordinates.ts with authentic Bangladesh map shape!")
