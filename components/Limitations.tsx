"use client";

import { AlertTriangle, Info, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function Limitations() {
  const biases = [
    {
      title: "LGED Facility Point Skew & Survey Sampling Bias",
      tag: "Spatial Data Bias",
      severity: "High",
      description:
        "Point-in-polygon spatial join of 78,129 LGED schools and 2,484 health facilities revealed severe survey sampling density skew across districts (e.g. Mymensingh has 4,581 mapped schools while Panchagarh has only 6). Using raw facility counts would severely penalize districts for administrative digitizing omissions.",
      mitigation: "Physical access scores use standardized population travel-time accessibility models from HeiGIT/HDX (modeled via openrouteservice on OSM and WorldPop); LGED point records are preserved as secondary administrative metrics."
    },
    {
      title: "Digital Axis Internal Collinearity (r = 0.72)",
      tag: "Statistical Dependence",
      severity: "Medium",
      description:
        "Within the digital composite, Internet Usage and Mobile Phone ownership correlate at r = +0.7212 (Spearman rho = 0.6654). The digital score must not be interpreted as an average of orthogonal dimensions; instead, it reflects shared variance between device ownership and active connectivity.",
      mitigation: "Documented explicitly as collinear rather than independent orthogonal dimensions."
    },
    {
      title: "Gender Parity Near-Collinearity (r = 0.99)",
      tag: "Indicator Specification",
      severity: "Medium",
      description:
        "In BBS Census 2022 enumeration data, Female Internet Usage correlates r = 0.9890 with Total Internet Usage. Folding a compressed gender parity ratio into the composite score adds minimal independent signal and risk-rewards universally low-access districts.",
      mitigation: "Dropped gender term from weighted composite score; female usage, male usage, and gender gap are reported as unweighted contextual metrics on district dossiers."
    },
    {
      title: "Monsoon Seasonality & Topographical Travel Times",
      tag: "Physical Topography",
      severity: "Medium",
      description:
        "Accessibility models use standard friction surfaces without dynamic seasonal flooding adjustments during the monsoon, which can multiply physical transit times tenfold in haor (Sunamganj, Kishoreganj) and coastal delta districts.",
      mitigation: "Acknowledge accessibility numbers reflect dry-season baseline connectivity."
    },
    {
      title: "District-Level Ecological Fallacy",
      tag: "Spatial Aggregation",
      severity: "Medium",
      description:
        "District-level aggregates (N=64) mask extreme intra-district inequalities between municipal sadar centers and peripheral upazilas or riverine chars. A district with moderate scores may still contain isolated pockets of acute deprivation.",
      mitigation: "Phase 2 research roadmap plans upazila-level (ADM3) disaggregation."
    },
    {
      title: "Exploratory Machine Learning Scope",
      tag: "Statistical Modeling",
      severity: "Low",
      description:
        "Clusters and archetype groupings generated via unsupervised K-Means and surrogate decision trees are descriptive and exploratory. They characterize multivariate patterns across the cross-section and carry no causal or predictive claims.",
      mitigation: "All cluster presentations carry an explicit non-causal disclaimer."
    }
  ];

  return (
    <section id="limitations-section" className="py-12 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Methodological Transparency & Rigor
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Limitations, Proxy Biases & Ethical Disclosure
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Policy intelligence demands absolute candor regarding data constraints. The Double Gap Index is designed for targeted resource prioritization; understanding what the metrics do and do not capture is essential for sound decision-making.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {biases.map((bias, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {bias.tag}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      bias.severity === "High"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {bias.severity} Risk
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {bias.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {bias.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-700">
                <strong className="text-slate-900 font-semibold block mb-0.5">
                  Mitigation & Treatment:
                </strong>
                {bias.mitigation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
