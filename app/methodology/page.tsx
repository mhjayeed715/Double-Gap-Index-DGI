import Link from "next/link";
import { ArrowLeft, BookOpen, AlertOctagon, CheckCircle2, Layers, Smartphone, Building2 } from "lucide-react";
import { SCORING_CONFIG } from "@/lib/scoring";

export const metadata = {
  title: "Methodology & Formulas — Double Gap Index (DGI)",
  description:
    "Transparent mathematical formulas, weighting criteria, normalization methods, and empirical data sources for the Double Gap Index.",
};

export default function MethodologyPage() {
  return (
    <div className="w-full bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview Dashboard
          </Link>
        </div>

        {/* Page Title */}
        <div className="border-b border-slate-200 pb-8 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded border border-cyan-200">
            Methodology & Statistical Specifications
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Double Gap Index (DGI) Methodology
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            The mathematical, conceptual, and empirical framework governing the measurement of compounding digital and physical exclusion across Bangladesh.
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
              Non-Negotiable Design Rule:
            </p>
            <p>
              Traditional composite vulnerability indices average all deprivation metrics into a single blended score (e.g., 0.52).
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
                  <strong>Weak clinics + Strong internet:</strong> A community can partially cope through telemedicine, remote consultation, and digital prescriptions.
                </li>
                <li>
                  <strong>Weak internet + Strong clinics:</strong> Residents can physically walk or travel to a nearby upazila health complex for face-to-face diagnosis.
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
              <strong className="text-rose-900 font-bold block mb-1">
                The Compounding Double Gap
              </strong>
              <p className="text-rose-800 leading-relaxed">
                When a district suffers from weak clinics AND weak internet simultaneously, both avenues are blocked.
                There is no digital workaround and no physical safety net. Blending these factors would mask this critical policy group.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Mathematical Formulations */}
        <section className="mb-12">
          <div className="flex items-center gap-2 text-slate-900 text-xl font-bold mb-3">
            <BookOpen className="w-5 h-5 text-cyan-600" />
            <h2>2. Mathematical Scoring Formulas</h2>
          </div>

          <div className="space-y-6 text-xs text-slate-700">
            {/* Min-Max Scaling */}
            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                A. Min-Max Normalization
              </h3>
              <p className="text-slate-600 mb-2">
                All raw sub-indicators are scaled to the standard unit interval [0, 1] across the 64 districts:
              </p>
              <div className="p-3 bg-slate-100 rounded-lg font-mono text-slate-800 text-xs">
                norm(x) = (x - min(X)) / (max(X) - min(X))
              </div>
              <p className="text-slate-500 mt-2 text-[11px]">
                In cases of identical values across all districts (max == min), the indicator normalizes to 0.5.
              </p>
            </div>

            {/* Digital Access Score */}
            <div className="p-5 rounded-xl border border-cyan-200 bg-cyan-50/30">
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className="w-4 h-4 text-cyan-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  B. Digital Access Score (DAS)
                </h3>
              </div>
              <p className="text-slate-600 mb-3">
                Combines four digital exclusion sub-indicators using equal weights (25% each):
              </p>
              <div className="p-3 bg-white rounded-lg font-mono text-slate-900 text-xs border border-cyan-200">
                DAS = 0.25 * norm(Internet_Usage) + 0.25 * norm(Smartphone_Ownership) + 0.25 * norm(Digital_Skills) + 0.25 * norm(100 - Gender_Gap)
              </div>
              <div className="mt-3 text-[11px] text-slate-600 space-y-1">
                <p>• <strong>Internet Usage (%):</strong> 3-month rolling individual access rate (BBS).</p>
                <p>• <strong>Smartphone Ownership (%):</strong> Household penetration rate (BBS).</p>
                <p>• <strong>Digital Skills (%):</strong> Basic digital transaction capability (BBS).</p>
                <p>• <strong>Inverse Gender Gap:</strong> Computed as <code>100 - (Male% - Female%)</code> so higher values represent greater gender equity.</p>
              </div>
            </div>

            {/* Service Access Score */}
            <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/30">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-amber-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  C. Service Access Score (SAS)
                </h3>
              </div>
              <p className="text-slate-600 mb-3">
                Measures the physical facility endowment per 100,000 residents across three public sectors (33.3% weight each):
              </p>
              <div className="p-3 bg-white rounded-lg font-mono text-slate-900 text-xs border border-amber-200">
                SAS = 0.333 * norm(Health_per_100k) + 0.333 * norm(Education_per_100k) + 0.334 * norm(Transit_per_100k)
              </div>
              <div className="mt-3 text-[11px] text-slate-600 space-y-1">
                <p>• <strong>Health per 100k:</strong> <code>(Hospitals + Clinics + Health Complexes) / Population * 100,000</code></p>
                <p>• <strong>Education per 100k:</strong> <code>(Primary + Secondary + Colleges) / Population * 100,000</code></p>
                <p>• <strong>Transit per 100k:</strong> <code>(Bus Stops + Rail Stations + Ferry Terminals) / Population * 100,000</code></p>
              </div>
            </div>

            {/* Double Gap Definition */}
            <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/40">
              <div className="flex items-center gap-2 mb-1">
                <AlertOctagon className="w-4 h-4 text-rose-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  D. The Double Gap Threshold (Cutoff: 0.40)
                </h3>
              </div>
              <p className="text-slate-600 mb-2">
                A district is flagged with <code>double_gap_flag = true</code> if and only if:
              </p>
              <div className="p-3 bg-white rounded-lg font-mono text-rose-800 text-xs border border-rose-200">
                Digital Access Score &lt; 0.40  AND  Service Access Score &lt; 0.40
              </div>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                The 0.40 threshold isolates districts in the lower two-fifths of national performance across both dimensions.
                In sensitivity checks across relative quartiles, 37 districts consistently cluster in this compounding deprivation state.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Empirical Data Sources */}
        <section className="mb-12">
          <h2 className="text-slate-900 text-xl font-bold mb-4">
            3. Empirical Data Sources & Provenance
          </h2>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-800 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Dataset</th>
                  <th className="py-3 px-4">Authoritative Source</th>
                  <th className="py-3 px-4">Round / Date</th>
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
                  <td className="py-3 px-4">2024–25 Survey (April 2026)</td>
                  <td className="py-3 px-4">District (64 districts)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    Physical Facility Locations
                  </td>
                  <td className="py-3 px-4">
                    OpenStreetMap (Overpass API)
                  </td>
                  <td className="py-3 px-4">Extracted March 2026</td>
                  <td className="py-3 px-4">Point nodes aggregated to district</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    Population & Demographics
                  </td>
                  <td className="py-3 px-4">
                    BBS Population & Housing Census
                  </td>
                  <td className="py-3 px-4">2022 Census Round</td>
                  <td className="py-3 px-4">District census totals</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    Administrative Boundaries
                  </td>
                  <td className="py-3 px-4">
                    Survey of Bangladesh / HDX
                  </td>
                  <td className="py-3 px-4">2024 Admin-2 Boundaries</td>
                  <td className="py-3 px-4">Polygon boundary coordinates</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Known Methodological Limitations */}
        <section className="mb-8">
          <h2 className="text-slate-900 text-xl font-bold mb-4">
            4. Methodological Limitations & Future Iterations
          </h2>

          <div className="space-y-3 text-xs text-slate-700">
            {SCORING_CONFIG.limitations.map((lim, i) => (
              <div key={i} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <span className="font-mono font-bold text-slate-400 mt-0.5">0{i + 1}</span>
                <p className="leading-relaxed text-slate-600">{lim}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
