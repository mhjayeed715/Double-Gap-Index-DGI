import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const dataFilePath = path.join(process.cwd(), "lib", "data", "districts.json");
const sensitivityFilePath = path.join(process.cwd(), "lib", "data", "sensitivity_results.json");
const clusterFilePath = path.join(process.cwd(), "lib", "data", "cluster_results.json");

test("Min-max normalization bounds: all 64 districts have scores strictly between 0 and 1", () => {
  const districts = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  assert.equal(districts.length, 64, "Must contain all 64 districts");
  for (const d of districts) {
    assert.ok(d.digital_access_score !== null, `Digital score must not be null for ${d.id}`);
    assert.ok(d.service_access_score !== null, `Service score must not be null for ${d.id}`);
    assert.ok(d.digital_access_score >= 0.0 && d.digital_access_score <= 1.0, `Digital score out of bounds for ${d.id}`);
    assert.ok(d.service_access_score >= 0.0 && d.service_access_score <= 1.0, `Service score out of bounds for ${d.id}`);
  }
});

test("Dual-Anchor Framework: Dual-median split isolates exactly 16 districts (25.0%)", () => {
  const districts = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  const dScores = districts.map((d) => d.digital_access_score).sort((a, b) => a - b);
  const sScores = districts.map((d) => d.service_access_score).sort((a, b) => a - b);

  // Exact empirical medians
  const medD = (dScores[31] + dScores[32]) / 2;
  const medS = (sScores[31] + sScores[32]) / 2;

  const dualMedian = districts.filter(
    (d) => d.digital_access_score < medD && d.service_access_score < medS
  );

  assert.equal(dualMedian.length, 16, "Dual-median split must isolate exactly 16 districts");
});

test("Dual-P40 Core Cutoff isolates exactly 9 districts and is a strict subset of Dual-Median", () => {
  const districts = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  const sens = JSON.parse(fs.readFileSync(sensitivityFilePath, "utf8"));

  const dScores = districts.map((d) => d.digital_access_score).sort((a, b) => a - b);
  const sScores = districts.map((d) => d.service_access_score).sort((a, b) => a - b);
  const medD = (dScores[31] + dScores[32]) / 2;
  const medS = (sScores[31] + sScores[32]) / 2;

  const dualMedianSet = new Set(
    districts.filter((d) => d.digital_access_score < medD && d.service_access_score < medS).map((d) => d.id)
  );

  const coreDistricts = districts.filter((d) => d.is_invariant_core);
  assert.equal(coreDistricts.length, 9, "Dual-P40 cutoff must isolate exactly 9 districts");
  assert.equal(sens.dual_anchor_framework.invariant_dual_method_core.count, 9, "Sensitivity framework must record 9 core districts");

  for (const d of coreDistricts) {
    assert.ok(dualMedianSet.has(d.id), `Core district ${d.id} must be strictly contained within Dual-Median set`);
  }
});

test("Buffer Transition Zone contains exactly 7 districts", () => {
  const sens = JSON.parse(fs.readFileSync(sensitivityFilePath, "utf8"));
  const bufferDistricts = sens.dual_anchor_framework.policy_buffer_040.buffer_districts;
  assert.equal(bufferDistricts.length, 7, "Buffer zone must contain exactly 7 districts");
  assert.ok(bufferDistricts.includes("Kishoreganj"), "Kishoreganj must be in buffer zone");
  assert.ok(bufferDistricts.includes("Sunamganj"), "Sunamganj must be in buffer zone");
});

test("Gender contextual metrics: unweighted rates and gaps are populated across all 64 districts", () => {
  const districts = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  for (const d of districts) {
    const male = d.digital_breakdown.male_usage_pct;
    const female = d.digital_breakdown.female_usage_pct;
    const gap = d.digital_breakdown.gender_gap_pct;

    assert.ok(typeof male === "number" && male >= 0, `Male usage must be valid number for ${d.id}`);
    assert.ok(typeof female === "number" && female >= 0, `Female usage must be valid number for ${d.id}`);
    assert.ok(typeof gap === "number", `Gender gap must be valid number for ${d.id}`);
    assert.equal(Math.round((male - female) * 100) / 100, gap, `Gender gap must equal male - female for ${d.id}`);
  }
});

test("Internal collinearity disclosure: Internet and mobile phone ownership are correlated", () => {
  const sens = JSON.parse(fs.readFileSync(sensitivityFilePath, "utf8"));
  const disclosure = sens.dimensional_independence.digital_axis_internal_collinearity;
  assert.ok(disclosure.internet_vs_mobile_rho > 0.60, "Internet vs mobile rho must be documented > 0.60");
});

test("Dimensional separation: Digital Access and Service Access scores exhibit moderate correlation", () => {
  const sens = JSON.parse(fs.readFileSync(sensitivityFilePath, "utf8"));
  const rho = sens.dimensional_independence.digital_vs_service_rank_correlation;
  assert.ok(rho < 0.60, `DAS and SAS must have moderate correlation (< 0.60), got ${rho}`);
  assert.ok(sens.dimensional_independence.unshared_variance_pct > 60.0, "Unshared variance must be > 60%");
});

test("Unsupervised clustering & decision tree: achieves valid silhouette score and >= 85% LOOCV fidelity", () => {
  const clusterData = JSON.parse(fs.readFileSync(clusterFilePath, "utf8"));
  const inSample = clusterData.optimal_k4_metrics.in_sample_fidelity_pct;
  const loocv = clusterData.optimal_k4_metrics.loocv_fidelity_pct;
  const sil = clusterData.optimal_k4_metrics.silhouette_score;

  assert.ok(sil >= 0.25, `Silhouette score must be >= 0.25, got ${sil}`);
  assert.ok(inSample >= 90.0, `Surrogate in-sample fidelity must be >= 90%, got ${inSample}%`);
  assert.ok(loocv >= 85.0, `Surrogate LOOCV generalization fidelity must be >= 85%, got ${loocv}%`);
});
