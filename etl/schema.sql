-- Double Gap Index (DGI) - Supabase / PostgreSQL Schema
-- Tables: districts, digital_indicators, service_indicators, scores
-- With Row Level Security (RLS) public SELECT-only policies.

-- 1. Districts Table
CREATE TABLE IF NOT EXISTS public.districts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    division TEXT NOT NULL,
    population INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Digital Indicators Table
CREATE TABLE IF NOT EXISTS public.digital_indicators (
    id BIGSERIAL PRIMARY KEY,
    district_id TEXT NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
    internet_usage_pct NUMERIC(5, 2),
    smartphone_ownership_pct NUMERIC(5, 2),
    digital_skills_pct NUMERIC(5, 2),
    gender_gap_pct NUMERIC(5, 2),
    source_year INTEGER DEFAULT 2025,
    source_citation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(district_id)
);

-- 3. Service Indicators Table
CREATE TABLE IF NOT EXISTS public.service_indicators (
    id BIGSERIAL PRIMARY KEY,
    district_id TEXT NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
    healthcare_facility_count INTEGER,
    education_facility_count INTEGER,
    transit_point_count INTEGER,
    healthcare_per_capita NUMERIC(8, 2),
    education_per_capita NUMERIC(8, 2),
    transit_per_capita NUMERIC(8, 2),
    source_citation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(district_id)
);

-- 4. Scores Table
CREATE TABLE IF NOT EXISTS public.scores (
    id BIGSERIAL PRIMARY KEY,
    district_id TEXT NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
    digital_access_score NUMERIC(5, 3) NOT NULL,
    service_access_score NUMERIC(5, 3) NOT NULL,
    double_gap_flag BOOLEAN NOT NULL,
    computed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(district_id)
);

-- Enable Row Level Security (RLS) per 10_SECURITY.md
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Public Read-Only Access Policies
CREATE POLICY "Allow public read access to districts"
    ON public.districts FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to digital_indicators"
    ON public.digital_indicators FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to service_indicators"
    ON public.service_indicators FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to scores"
    ON public.scores FOR SELECT
    USING (true);
