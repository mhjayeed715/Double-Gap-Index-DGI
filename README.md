# Double Gap Index (DGI) — Bangladesh

> **Mapping where digital exclusion and physical service exclusion compound in Bangladesh.**

[![CI](https://github.com/double-gap-index/dgi/actions/workflows/ci.yml/badge.svg)](https://github.com/double-gap-index/dgi/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

---

## 1. The Core Question

> **"Which districts in Bangladesh are failing their people on BOTH digital access AND physical service access at the same time — the places with no digital workaround and no physical access either?"**

Traditional indices blend all indicators into a single composite equity number. **DGI strictly separates the two axes:**
1. **Digital Access Score (0–1):** Internet penetration, smartphone ownership, digital skills, and inverse gender gap (BBS ICT Survey 2024–25).
2. **Service Access Score (0–1):** Physical healthcare, education, and transit infrastructure density per 100,000 population (OpenStreetMap & Census 2022).

### Why the Separation Matters
- **Weak physical clinics + Strong internet:** Telemedicine and remote consultation provide a vital coping mechanism.
- **Weak internet + Strong clinics:** Residents can travel to a nearby health complex in person.
- **Weak in BOTH (The Double Gap):** Zero workaround capacity. **37 of 64 districts (58%)** face this compounding deprivation.

---

## 2. Key Features

- **Interactive 64-District Choropleth Map:** Dynamic layer toggles between Digital Score (Cyan scale), Service Score (Amber scale), and Double Gap status (Rose hazard pattern).
- **2x2 Quadrant Matrix:** Visualizes the 0.40 cutoff boundaries with direct labeling of high-urgency districts (Sherpur, Kurigram, Bandarban, Netrokona).
- **District Drill-Down Pages (`/district/[id]`):** Side-by-side non-blended score cards, sub-indicator breakdowns, and explicit "Data unavailable" badges for missing fields (Rule 4).
- **Searchable & Sortable Explorer Table:** Filter by administrative division or status, and export clean CSV datasets for policy researchers.
- **Interpretable Machine Learning Archetypes:** K-Means/SHAP-aligned clustering classifying districts into 4 actionable policy intervention categories.
- **Methodology & Single-Source API:** Public documentation of all formulas, min-max scaling, and empirical limitations.

---

## 3. Tech Stack

- **Frontend:** Next.js 15 (App Router, Server Components), React 19, TypeScript
- **Styling & Motion:** Tailwind CSS v3/v4, Lenis (smooth inertial scrolling), Motion (`motion/react`)
- **Data & Backend:** Supabase (PostgreSQL with RLS) + resilient pre-computed static JSON fallback
- **ETL Pipeline:** Python 3 (Pandas / standard library fallback, pytest)
- **Deployment:** Vercel

---

## 4. Quickstart

### Prerequisites
- Node.js 18+ (tested on Node.js 24)
- Python 3.10+

### Installation

```bash
# 1. Clone repository
git clone https://github.com/your-username/double-gap-index.git
cd double-gap-index

# 2. Install Node dependencies
npm install

# 3. (Optional) Install Python ETL dependencies
pip install -r etl/requirements.txt
```

### Running Locally

```bash
# Start Next.js development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Running the Python ETL Pipeline

```bash
# Recompute scores from raw BBS and OSM data
python etl/compute_scores.py

# Run unit tests for scoring and normalization logic
python etl/test_scoring.py
# or with pytest
pytest etl/test_scoring.py
```

### Running Test Suite

```bash
# Run Node.js test suite
npm test
```

---

## 5. API Endpoints

- `GET /api/districts` — Returns summary list of all 64 districts and their scores.
- `GET /api/districts/:id` — Returns full sub-indicator breakdown, per-capita metrics, and source citations for a single district.
- `GET /api/methodology` — Returns formula weights, normalization constants, and data source citations.

---

## 6. Citations & Acknowledgments

- **BBS ICT Survey 2024–25:** Measurement of Access and Use of ICT by Households and Individuals, Bangladesh Bureau of Statistics (released April 2026).
- **OpenStreetMap:** Point-of-interest facility counts extracted via Overpass API (March 2026).
- **BBS Census 2022:** Population and Housing Census 2022, Bangladesh Bureau of Statistics.
