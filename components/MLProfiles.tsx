"use client";

import { BrainCircuit, CheckCircle2, AlertOctagon, Smartphone, Building2 } from "lucide-react";

export default function MLProfiles() {
  const clusters = [
    {
      title: "Cluster 1: Compounded Double Gap",
      tag: "Severe Vulnerability (37 Districts)",
      color: "rose",
      districts: ["Sherpur", "Kurigram", "Bandarban", "Netrokona", "Sunamganj", "Bhola"],
      description:
        "Severe dual deprivation. Physical facility density is in the lowest national quintile, while household internet and smartphone ownership remain below 35%. No digital coping mechanism is feasible.",
      intervention: "Co-invest in solar microgrids/towers alongside satellite mobile community clinics.",
    },
    {
      title: "Cluster 2: Digital-First Workaround",
      tag: "Digital Offset (11 Districts)",
      color: "amber",
      districts: ["Gazipur", "Narayanganj", "Cumilla", "Feni", "Munshiganj"],
      description:
        "High population density strains physical hospital and school beds per capita, but mobile broadband exceeds 55%. Residents leverage digital banking, telemedicine, and online portals to circumvent physical bottlenecks.",
      intervention: "Fund digital service quality, certified telemedicine accreditation, and high-speed public Wi-Fi hubs.",
    },
    {
      title: "Cluster 3: Physical Safety Net",
      tag: "Infrastructure Cushion (9 Districts)",
      color: "sky",
      districts: ["Rajshahi rural", "Jhalokati", "Pirojpur", "Chuadanga"],
      description:
        "Traditional brick-and-mortar health complexes and schools remain accessible per capita despite low household smartphone ownership. Physical access shields communities from immediate exclusion.",
      intervention: "Focus on digital literacy training, local union digital center (UDC) upgrades, and device financing.",
    },
    {
      title: "Cluster 4: Dual-Access Resilient Core",
      tag: "Metropolitan Resilience (7 Districts)",
      color: "emerald",
      districts: ["Dhaka", "Chattogram", "Khulna", "Sylhet urban"],
      description:
        "Highest tier of both digital access (internet >65%) and per-capita public and private facilities. Serves as regional service hubs.",
      intervention: "Focus on reducing intra-district slum disparities and informal settlement access.",
    },
  ];

  const featureWeights = [
    { name: "Internet Usage Rate (%)", weight: 28, group: "Digital" },
    { name: "Healthcare Density (per 100k)", weight: 24, group: "Service" },
    { name: "Smartphone Ownership (%)", weight: 20, group: "Digital" },
    { name: "Transit Infrastructure Density", weight: 16, group: "Service" },
    { name: "Gender Parity Gap (%)", weight: 12, group: "Digital" },
  ];

  return (
    <section id="ml-profiles-section" className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
              Interpretable Machine Learning
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Exclusion Profiles & Feature Attribution (SHAP-Aligned)
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Per PRD Section 5 & 7, all statistical models remain 100% interpretable.
            Rather than treating deprivation as a black box, unsupervised clustering segments the 64 districts into 4 actionable policy archetypes.
          </p>
        </div>

        {/* 4 Archetype Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {clusters.map((cluster, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-200 shadow-xs"
            >
              <div>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${
                    cluster.color === "rose"
                      ? "bg-rose-100 text-rose-800"
                      : cluster.color === "amber"
                      ? "bg-amber-100 text-amber-800"
                      : cluster.color === "sky"
                      ? "bg-sky-100 text-sky-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {cluster.tag}
                </span>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  {cluster.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {cluster.description}
                </p>

                <div className="text-[11px] text-slate-500 mb-4">
                  <strong className="text-slate-700 font-semibold">Sample Districts:</strong>{" "}
                  {cluster.districts.join(", ")}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 text-[11px]">
                <span className="font-semibold text-slate-800 block mb-0.5">Recommended Policy:</span>
                <span className="text-slate-600">{cluster.intervention}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Importance Attribution Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Sub-Indicator Feature Importance Attribution
              </h4>
              <p className="text-xs text-slate-500">
                Relative contribution of each independent indicator to the compounded exclusion classification
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Normalized Weights (Sum: 100%)
            </span>
          </div>

          <div className="space-y-3">
            {featureWeights.map((f, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700 flex items-center gap-1.5">
                    {f.group === "Digital" ? (
                      <Smartphone className="w-3.5 h-3.5 text-cyan-600" />
                    ) : (
                      <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {f.name}
                  </span>
                  <span className="font-mono text-slate-900 font-semibold">
                    {f.weight}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      f.group === "Digital" ? "bg-cyan-600" : "bg-amber-600"
                    }`}
                    style={{ width: `${f.weight * 3.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
