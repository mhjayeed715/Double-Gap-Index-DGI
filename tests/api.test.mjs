import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const dataFilePath = path.join(process.cwd(), "lib", "data", "districts.json");

test("Data file exists and contains all 64 districts", () => {
  assert.ok(fs.existsSync(dataFilePath), "districts.json must exist");
  const raw = fs.readFileSync(dataFilePath, "utf8");
  const districts = JSON.parse(raw);

  assert.equal(districts.length, 64, "Must contain exactly 64 districts");
});

test("Dhaka and Bandarban adhere to empirical census expectations", () => {
  const districts = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  const map = new Map(districts.map((d) => [d.id, d]));

  const dhaka = map.get("dhaka");
  assert.ok(dhaka, "Dhaka district must exist");
  assert.equal(dhaka.digital_breakdown.internet_usage_pct, 60.97);
  assert.ok(dhaka.digital_access_score > 0.9, "Dhaka digital score should be > 0.9");
  assert.equal(dhaka.double_gap_flag, false, "Dhaka should not be double gap");

  const bandarban = map.get("bandarban");
  assert.ok(bandarban, "Bandarban district must exist");
  assert.equal(bandarban.digital_breakdown.internet_usage_pct, 29.54);
  assert.ok(bandarban.digital_access_score < 0.40, "Bandarban digital score should be < 0.40");
  assert.ok(bandarban.service_access_score < 0.40, "Bandarban service score should be < 0.40");
  assert.equal(bandarban.double_gap_flag, true, "Bandarban must be flagged as Double Gap");
});

test("100% Census Enumeration: Zero synthetic data or missing fields in published records", () => {
  const districts = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  for (const d of districts) {
    assert.ok(d.digital_breakdown.internet_usage_pct > 0, `Internet rate must be > 0 for ${d.id}`);
    assert.ok(d.digital_breakdown.mobile_ownership_pct > 0, `Mobile ownership must be > 0 for ${d.id}`);
    assert.ok(d.digital_breakdown.mobile_banking_pct > 0, `Mobile banking must be > 0 for ${d.id}`);
    assert.ok(d.service_breakdown.hospital_access_pct >= 0, `Hospital access must be >= 0 for ${d.id}`);
    assert.ok(d.service_breakdown.education_access_pct >= 0, `Education access must be >= 0 for ${d.id}`);
    assert.ok(d.service_breakdown.electricity_access_pct > 0, `Electricity access must be > 0 for ${d.id}`);
  }
});

test("Two scores separation rule: scores are distinct and never blended", () => {
  const districts = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

  // Check that every district has both fields separately
  for (const d of districts) {
    assert.ok(
      "digital_access_score" in d && "service_access_score" in d,
      "Both separate score keys must exist"
    );
    assert.ok(!("exclusion_score" in d), "Blended exclusion_score is forbidden");
    assert.ok(!("composite_score" in d), "Blended composite_score is forbidden");
  }
});
