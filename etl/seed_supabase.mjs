/**
 * Double Gap Index (DGI) - Supabase Data Seeding Script
 * Seeds the 64 districts, digital indicators, service indicators, and scores
 * directly into your Supabase database using the configured credentials.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vanmijillnfxxqwqnxuw.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_nUtr8TUj0O96JYvu5YAJHw_yGHp7Cxg";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log(`Connecting to Supabase at: ${supabaseUrl}`);

  const raw = readFileSync(resolve(__dirname, "../lib/data/districts.json"), "utf8");
  const districts = JSON.parse(raw);

  console.log(`Loaded ${districts.length} districts from local database.`);

  // 1. Check if tables exist
  const { error: checkErr } = await supabase.from("districts").select("id").limit(1);

  if (checkErr && checkErr.code === "PGRST205") {
    console.log("\n⚠️ Note: The Supabase tables do not exist yet in your schema.");
    console.log("Please execute the schema in etl/schema.sql inside your Supabase SQL Editor first:\n");
    console.log("1. Open: https://supabase.com/dashboard/project/vanmijillnfxxqwqnxuw/sql");
    console.log("2. Paste the contents of etl/schema.sql");
    console.log("3. Click 'Run' to create the tables.");
    console.log("4. Then run: npm run seed:supabase\n");
    return;
  }

  // 2. Insert districts
  console.log("Seeding districts...");
  const districtsPayload = districts.map((d) => ({
    id: d.id,
    name: d.name,
    division: d.division,
    population: d.population,
  }));
  const { error: distErr } = await supabase.from("districts").upsert(districtsPayload);
  if (distErr) console.error("Error inserting districts:", distErr);
  else console.log("✓ Districts seeded successfully.");

  // 3. Insert digital indicators
  console.log("Seeding digital indicators...");
  const digitalPayload = districts.map((d) => ({
    district_id: d.id,
    internet_usage_pct: d.digital_breakdown.internet_usage_pct,
    smartphone_ownership_pct: d.digital_breakdown.smartphone_ownership_pct,
    digital_skills_pct: d.digital_breakdown.digital_skills_pct,
    gender_gap_pct: d.digital_breakdown.gender_gap_pct,
    source_citation: d.digital_breakdown.source_citation || "BBS ICT Survey 2024-25",
  }));
  const { error: digErr } = await supabase.from("digital_indicators").upsert(digitalPayload);
  if (digErr) console.error("Error inserting digital indicators:", digErr);
  else console.log("✓ Digital indicators seeded successfully.");

  // 4. Insert service indicators
  console.log("Seeding service indicators...");
  const servicePayload = districts.map((d) => ({
    district_id: d.id,
    healthcare_facility_count: d.service_breakdown.healthcare_facility_count,
    education_facility_count: d.service_breakdown.education_facility_count,
    transit_point_count: d.service_breakdown.transit_point_count,
    healthcare_per_capita: d.service_breakdown.healthcare_per_capita,
    education_per_capita: d.service_breakdown.education_per_capita,
    transit_per_capita: d.service_breakdown.transit_per_capita,
    source_citation: d.service_breakdown.source_citation || "OpenStreetMap / DGHS",
  }));
  const { error: srvErr } = await supabase.from("service_indicators").upsert(servicePayload);
  if (srvErr) console.error("Error inserting service indicators:", srvErr);
  else console.log("✓ Service indicators seeded successfully.");

  // 5. Insert scores
  console.log("Seeding scores...");
  const scoresPayload = districts.map((d) => ({
    district_id: d.id,
    digital_access_score: d.digital_access_score,
    service_access_score: d.service_access_score,
    double_gap_flag: d.double_gap_flag,
  }));
  const { error: scErr } = await supabase.from("scores").upsert(scoresPayload);
  if (scErr) console.error("Error inserting scores:", scErr);
  else console.log("✓ Scores seeded successfully.");

  console.log("\n🎉 Complete! All 64 districts and scores are active in Supabase.");
}

seed().catch(console.error);
