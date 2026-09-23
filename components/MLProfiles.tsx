"use client";

import { BrainCircuit, Info, Smartphone, Building2, Sliders, CheckCircle2, ShieldAlert } from "lucide-react";
import clusterData from "@/lib/data/cluster_results.json";

export default function MLProfiles() {
  const { optimal_k4_metrics, archetype_profiles, candor_evaluation, metadata } = clusterData;

  const clusterColors = ["rose", "sky", "amber", "emerald"];

  return (
    <section id="ml-profiles-section" className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
              Unsupervised Machine Learning & Macro Archetypes
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Exploratory Cluster Archetypes & Centroid Profiles
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Unsupervised K-Means clustering ($k=4$, Silhouette Score: <strong>{optimal_k4_metrics.silhouette_score}</strong>) groups the 64 districts based on normalized variance across 7 digital and physical indicators.
          </p>

          {/* Mandatory Exploratory Disclaimer */}
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Methodological Clarification:</strong> {metadata.exploratory_disclaimer} They describe multivariate structure in the BBS Census 2022 and HeiGIT accessibility cross-section to assist multi-sector policy planning, rather than proving econometric causality.
            </div>
          </div>
        </div>

        {/* 4 Archetype Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {archetype_profiles.map((cluster, i) => {
            const color = clusterColors[i % clusterColors.length];
            return (
              <div
                key={cluster.cluster_id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-200 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        color === "rose"
                          ? "bg-rose-100 text-rose-800"
                          : color === "amber"
                          ? "bg-amber-100 text-amber-800"
                          : color === "sky"
                          ? "bg-sky-100 text-sky-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      Archetype {cluster.cluster_id} ({cluster.district_count} Districts)
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    {cluster.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 my-2 bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block">Mean Digital</span>
                      <span className="font-mono font-bold text-slate-800">{cluster.mean_digital_score}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block">Mean Service</span>
                      <span className="font-mono font-bold text-slate-800">{cluster.mean_service_score}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 mb-4">
                    <strong className="text-slate-700 font-semibold">Districts:</strong>{" "}
                    {cluster.sample_districts.join(", ")}
                    {cluster.district_count > cluster.sample_districts.length && "..."}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 text-[11px]">
                  <strong className="text-slate-800 block mb-1">Key Indicator Loadings:</strong>
                  <div className="space-y-1 font-mono text-[10px] text-slate-600">
                    <div>Internet: {Math.round(cluster.centroid_loadings.internet_usage_pct * 100)}% norm</div>
                    <div>Hospital: {Math.round(cluster.centroid_loadings.hospital_access_pct * 100)}% norm</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cluster Candor & Validation Note */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h4 className="text-sm font-bold text-slate-900 mb-2">
            Analytical Candor: What Does Clustering Add Beyond the 2x2 Quadrant?
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            {candor_evaluation.what_clustering_adds_beyond_quadrant}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Cluster Stability Metrics */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <strong className="text-slate-900 block font-semibold">Unsupervised Stability Metrics:</strong>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div>• Optimal $k=4$ Silhouette Coefficient: <strong>{optimal_k4_metrics.silhouette_score}</strong></div>
                <div>• Optimal $k=4$ Inertia (SSE): <strong>{optimal_k4_metrics.inertia}</strong></div>
                <div>• Sub-clustering sensitivity: Raising $k$ to 5 or 6 splits coastal char districts from northern border zilas but decays overall silhouette score.</div>
              </div>
            </div>

            {/* Surrogate Decision Rules (LOOCV 90.6% / In-Sample 95.3%) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <strong className="text-slate-900 font-semibold">Interpretable Surrogate Rules (Depth 3):</strong>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                    LOOCV: {optimal_k4_metrics.loocv_fidelity_pct}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                    In-Sample: {optimal_k4_metrics.in_sample_fidelity_pct}%
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Generalization fidelity under Leave-One-Out Cross-Validation (58/64 districts correctly mapped out-of-sample; 61/64 in-sample):
              </p>
              <div className="space-y-1 font-mono text-[10px] text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                {candor_evaluation.surrogate_decision_tree.decision_rules.map((rule: string, idx: number) => (
                  <div key={idx} className="truncate">
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transparent Null-Handling Disclosure */}
          <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Rule 4 & Geometric Null-Handling:</strong> {metadata.null_handling}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
