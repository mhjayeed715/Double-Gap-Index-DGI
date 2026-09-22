import Link from "next/link";
import { ArrowLeft, BookOpen, AlertOctagon, Layers, Smartphone, Building2, Sliders, ShieldAlert, CheckCircle2 } from "lucide-react";
import SensitivityTable from "@/components/SensitivityTable";
import Limitations from "@/components/Limitations";

export const metadata = {
  title: "Methodology & Empirical Formulations — Double Gap Index (DGI)",
  description:
    "Mathematical formulas, dual-anchor thresholds, sensitivity analysis, and data provenance for the empirical Double Gap Index.",
};

export default function MethodologyPage() {
  return (
    <div className="w-full bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview Dashboard
          </Link>
        </div>

        {/* Page Title */}
        <div className="border-b border-slate-200 pb-8 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded border border-cyan-200">
            Methodology & Econometric Specifications
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Double Gap Index (DGI) Methodology
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            The empirical scoring formulas, dual-anchor thresholds, collinearity disclosures, and data provenance governing the measurement of compounding digital and physical service exclusion across all 64 districts of Bangladesh.
          </p>
        </div>

        {/* Section 1: The Core Axiom - Why Two Scores, Not One */}
        <section className="mb-12">
          <div className="flex items-center gap-2 text-slate-900 text-xl font-bold mb-3">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2>1. The Core Axiom: Why Two Scores, Never Blended</h2>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 text-slate-800 text-sm leading-relaxed mb-4">
            <p className="font-semibold text-amber-950 mb-1">
              Non-Negotiable Policy Axiom (Rule 4):
            </p>
            <p>
              Traditional composite vulnerability indices blend separate deprivation metrics into a single weighted average (e.g., 0.52).
              In development economics, blending destroys the compensatory relationship between digital connectivity and physical public services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 my-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <strong className="text-slate-900 font-bold block mb-1">
                The Compensatory Dynamics
              </strong>
              <ul className="space-y-2 list-disc list-inside text-slate-600">
                <li>
                  <strong>Weak physical clinics + Strong digital connectivity:</strong> A community can partially cope through telemedicine, mobile financial transactions, and remote health consultations.
                </li>
                <li>
                  <strong>Weak digital connectivity + Strong physical facilities:</strong> Residents can physically walk or travel to an Upazila Health Complex or local school for in-person services.
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
              <strong className="text-rose-900 font-bold block mb-1">
                The Compounding Double Gap
              </strong>
              <p className="text-rose-800 leading-relaxed">
                When a district suffers from weak physical facilities AND weak digital access simultaneously, both coping mechanisms collapse.
                There is no digital workaround and no physical safety net. Blending these factors would mask this critical policy group.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <strong className="text-slate-900 font-bold block mb-1">
              Empirical Proof of Dimensional Independence:
            </strong>
            <p className="leading-relaxed text-slate-600">
              Across all 64 districts in Bangladesh, the Pearson correlation between the Digital Access Score and Physical Service Access Score is <strong>r = +0.3350</strong> (Spearman &rho; = 0.1742). This confirms that <strong>~88.8% of the variance between the two dimensions is unshared</strong>. The two axes represent distinct structural realities; collapsing them into a single blended score would mathematically destroy the actionable policy signal.
            </p>
          </div>
        </section>

        {/* Section 2: Mathematical Formulations */}
        <section className="mb-12">
          <div className="flex items-center gap-2 text-slate-900 text-xl font-bold mb-3">
            <BookOpen className="w-5 h-5 text-cyan-600" />
            <h2>2. Mathematical Scoring Formulas & Empirical Construction</h2>
          </div>

          <div className="space-y-6 text-xs text-slate-700">
            {/* Min-Max Scaling */}
            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                A. Min-Max Normalization
              </h3>
              <p className="text-slate-600 mb-2">
                All raw sub-indicators are scaled to the unit interval [0, 1] across the 64 districts:
              </p>
              <div className="p-3 bg-slate-100 rounded-lg font-mono text-slate-800 text-xs mb-3">
                norm(x) = (x - min(X)) / (max(X) - min(X))
              </div>
              <p className="text-slate-600 leading-relaxed">
                Scores strictly preserve the empirical rank ordering and dynamic spread across all 64 administrative districts.
              </p>
            </div>

            {/* Digital Access Score */}
            <div className="p-5 rounded-xl border border-cyan-200 bg-cyan-50/30">
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className="w-4 h-4 text-cyan-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  B. Digital Access Score (DAS) — Verified Formulation
                </h3>
              </div>
              <p className="text-slate-600 mb-3">
                Combines three verified BBS Census 2022 100% CAPI enumeration indicators with equal weights (1/3 each):
              </p>
              <div className="p-3 bg-white rounded-lg font-mono text-slate-900 text-xs border border-cyan-200">
                DAS = 0.3333 * norm(Internet_Usage) + 0.3333 * norm(Mobile_Ownership) + 0.3334 * norm(Mobile_Banking)
              </div>
              <div className="mt-3 text-[11px] text-slate-600 space-y-2">
                <p>• <strong>Internet Usage (%):</strong> Share of population aged 15+ using the internet (BBS Census 2022 Admin 02, Sheet <em>Internet User</em>, range: 21.2% to 61.0%).</p>
                <p>• <strong>Mobile Phone Ownership (%):</strong> Share of population aged 15+ owning a mobile phone (BBS Census 2022 Admin 02, Sheet <em>Population having Mobile Phone</em>, range: 60.0% to 84.7%).</p>
                <p>• <strong>Mobile Financial Services (%):</strong> Share of population aged 15+ with an active mobile banking account (BBS Census 2022 Admin 02, Sheet <em>Having Mobile Banking Account</em>, range: 31.9% to 54.7%).</p>
                
                <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Methodological Resolution: Gender Indicator Policy</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Statistical evaluation of BBS Census 2022 data reveals that <strong>Female Internet Usage correlates r = 0.9890</strong> with total internet usage, and the Gender Parity Ratio correlates <strong>r = 0.9228</strong>. Folding a redundant or compressed gender parity term into the composite score adds no independent signal and mathematically awards high scores to districts with universally low access.
                    <strong> Decision:</strong> The gender term is dropped from the weighted composite score, and Female Usage, Male Usage, and the Gender Gap are reported as <strong>unweighted contextual statistics</strong> on each district dossier.
                  </p>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                  <strong className="block mb-1">Internal Collinearity Disclosure:</strong>
                  <p className="leading-relaxed">
                    Within the 3-indicator digital composite, Internet Usage and Mobile Phone ownership correlate at <strong>r = +0.7212</strong> (Spearman &rho; = 0.6654). They are explicitly disclosed as not fully independent orthogonal measures; instead, they capture device possession versus active digital connectivity.
                  </p>
                </div>
              </div>
            </div>

            {/* Service Access Score */}
            <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/30">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-amber-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  C. Service Access Score (SAS) — Accessibility & Infrastructure
                </h3>
              </div>
              <p className="text-slate-600 mb-3">
                Combines travel-time physical facility accessibility and electrical grid infrastructure (1/3 weight each):
              </p>
              <div className="p-3 bg-white rounded-lg font-mono text-slate-900 text-xs border border-amber-200">
                SAS = 0.3333 * norm(Hospital_Access_30m) + 0.3333 * norm(Education_Access_5km) + 0.3334 * norm(Grid_Electricity)
              </div>
              <div className="mt-3 text-[11px] text-slate-600 space-y-2">
                <p>• <strong>Hospital Access (% within 30 min):</strong> Share of district population able to reach a hospital within 30 minutes walking/transit friction (HeiGIT / UN OCHA HDX).</p>
                <p>• <strong>Education Access (% within 5km):</strong> Share of district population within 5km of an educational facility (HeiGIT / UN OCHA HDX).</p>
                <p>• <strong>National Grid Electricity (%):</strong> Percentage of households connected to the national electrical grid (BBS Census 2022 Admin 02, Sheet <em>Main Source of Electricity</em>).</p>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">LGED Spatial Join Audit & Sampling Bias Finding:</strong>
                  <p className="text-slate-600 leading-relaxed">
                    We performed a spatial point-in-polygon join of 78,129 LGED school points and 2,484 LGED health facilities against the 64 official district boundary polygons. 
                    This join revealed extreme surveyor sampling bias in LGED's raw point datasets (e.g. Mymensingh has 4,581 mapped schools, whereas Panchagarh has only 6 mapped schools, reflecting uneven administrative GIS digitizing coverage rather than physical reality). 
                    To prevent surveyor omissions from artificially penalizing rural districts, composite physical access uses standardized travel-time accessibility models from HeiGIT/HDX (modeled via openrouteservice on OSM and WorldPop), while raw LGED facility counts are presented as secondary administrative context records.
                  </p>
                </div>
              </div>
            </div>

            {/* Dual-Anchor Framework */}
            <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/40">
              <div className="flex items-center gap-2 mb-1">
                <AlertOctagon className="w-4 h-4 text-rose-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  D. Dual-Anchor Framework: Dual-Median Baseline vs. Dual-P40 Invariant Core
                </h3>
              </div>
              <p className="text-slate-600 mb-2 leading-relaxed">
                Rather than relying on an arbitrary fixed score cutoff, the DGI uses distribution-relative anchors:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                <div className="bg-white p-3.5 rounded-lg border border-rose-200">
                  <span className="font-bold text-rose-900 block text-xs">1. Dual-Median Baseline (P50):</span>
                  <span className="text-[11px] text-slate-600 block mt-1">
                    Digital Median = 0.3987 | Service Median = 0.5829.<br />
                    <strong>16 Districts (25.0% of Bangladesh)</strong> fall below the national median on both axes simultaneously, encompassing 37.3 million citizens.
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-950 block text-xs">2. Dual-P40 Invariant Core:</span>
                  <span className="text-[11px] text-slate-600 block mt-1">
                    Digital P40 = 0.3672 | Service P40 = 0.5529.<br />
                    <strong>9 Districts (14.1% of Bangladesh)</strong> represent the invariant core priority zone. Dual-P40 is a strict mathematical subset of the 16 Dual-Median districts, leaving 7 buffer districts.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive Sensitivity & Robustness Matrix */}
        <section className="mb-12">
          <div className="flex items-center gap-2 text-slate-900 text-xl font-bold mb-3">
            <Sliders className="w-5 h-5 text-cyan-600" />
            <h2>3. Empirical Sensitivity & Robustness Matrix</h2>
          </div>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            The table below evaluates district classifications across absolute and distribution-relative thresholds, confirming the stability of the 9-district Invariant Core and the 7-district Buffer Zone.
          </p>
          <SensitivityTable />
        </section>

        {/* Section 4: Empirical Data Sources */}
        <section className="mb-12">
          <h2 className="text-slate-900 text-xl font-bold mb-4">
            4. Empirical Data Sources & Provenance
          </h2>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-800 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Dataset</th>
                  <th className="py-3 px-4">Authoritative Source</th>
                  <th className="py-3 px-4">Coverage / Methodology</th>
                  <th className="py-3 px-4">Granularity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    ICT Access & Usage
                  </td>
                  <td className="py-3 px-4">
                    Bangladesh Bureau of Statistics (BBS)
                  </td>
                  <td className="py-3 px-4">Census 2022 Admin 02 (100% CAPI enumeration)</td>
                  <td className="py-3 px-4">64 districts (N = 165,130,774)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    Physical Healthcare Accessibility
                  </td>
                  <td className="py-3 px-4">
                    HeiGIT (Heidelberg Institute) / UN OCHA HDX
                  </td>
                  <td className="py-3 px-4">Travel-time friction surface (% within 30 min)</td>
                  <td className="py-3 px-4">64 districts</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    Education Accessibility
                  </td>
                  <td className="py-3 px-4">
                    HeiGIT / UN OCHA HDX
                  </td>
                  <td className="py-3 px-4">Spatial buffer model (% within 5km)</td>
                  <td className="py-3 px-4">64 districts</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    Electrification & Grid Connection
                  </td>
                  <td className="py-3 px-4">
                    BBS Population & Housing Census
                  </td>
                  <td className="py-3 px-4">Census 2022 Admin 02 (National Grid %)</td>
                  <td className="py-3 px-4">64 districts</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    Administrative Facilities
                  </td>
                  <td className="py-3 px-4">
                    Local Government Engineering Department (LGED)
                  </td>
                  <td className="py-3 px-4">2,484 health facilities & 78,129 school points</td>
                  <td className="py-3 px-4">Point spatial join to 64 districts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Limitations & Data Biases */}
        <Limitations />
      </div>
    </div>
  );
}
