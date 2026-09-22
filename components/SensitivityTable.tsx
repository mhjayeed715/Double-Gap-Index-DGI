"use client";

import React, { useState } from "react";
import { Sliders, CheckCircle2, ShieldAlert, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import sensitivityData from "@/lib/data/sensitivity_results.json";

export default function SensitivityTable() {
  const [activeThreshold, setActiveThreshold] = useState<number>(0.40);
  const currentSweep = sensitivityData.threshold_sensitivity.find(
    (s) => s.threshold === activeThreshold
  ) || sensitivityData.threshold_sensitivity[2];

  const invariantCore = sensitivityData.dual_anchor_framework.invariant_dual_method_core;
  const empiricalMedian = sensitivityData.dual_anchor_framework.empirical_core_median;
  const bufferInfo = sensitivityData.dual_anchor_framework.policy_buffer_040;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
              Sensitivity & Robustness Matrix
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Dual-Anchor Empirical Validation & Robustness
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Empirical Dual-Median baseline (16 districts) and Dual-P40 Invariant Core (9 districts) across parametric cutoffs (0.30 to 0.50).
          </p>
        </div>

        {/* Threshold Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          {sensitivityData.threshold_sensitivity.map((item) => (
            <button
              key={item.threshold}
              onClick={() => setActiveThreshold(item.threshold)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeThreshold === item.threshold
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {item.threshold.toFixed(2)}
              {item.threshold === 0.40 && (
                <span className="ml-1 text-[9px] text-cyan-600 font-bold uppercase">
                  (Cutoff)
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Card Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Empirical Invariant Core */}
        <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase text-emerald-800 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Empirical Invariant Core (Dual-P40)
            </div>
            <div className="text-2xl font-extrabold text-emerald-950">
              {invariantCore.count} Districts
            </div>
            <div className="text-xs text-emerald-900 mt-1 leading-snug">
              Core priority zone: 9 districts fall strictly below the 40th percentile on both Digital (0.367) and Service (0.553) axes.
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-emerald-200/70 text-[10px] text-emerald-700 truncate">
            {invariantCore.districts.slice(0, 5).join(", ")}... (Census 2022)
          </div>
        </div>

        {/* Card 2: Empirical Dual-Median Baseline */}
        <div className="bg-rose-50/60 rounded-xl p-4 border border-rose-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase text-rose-800 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Dual-Median Baseline (P50)
            </div>
            <div className="text-2xl font-extrabold text-rose-950">
              {empiricalMedian.count} Districts
            </div>
            <div className="text-xs text-rose-900 mt-1 leading-snug">
              Standard zero-parameter policy benchmark: 16 districts (25.0% of Bangladesh) below national median on both dimensions.
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-rose-200/80 text-[10px] text-rose-700">
            Digital &lt; {sensitivityData.metadata.median_digital_access_score} & Service &lt; {sensitivityData.metadata.median_service_access_score}
          </div>
        </div>

        {/* Card 3: Selected Threshold Perimeter */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-600 mb-1">
              Absolute Sweep (&tau; = {activeThreshold.toFixed(2)})
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {currentSweep.flagged_count} Districts
            </div>
            <div className="text-xs text-slate-600 mt-1 leading-snug">
              {currentSweep.flagged_pct}% of districts fall below {activeThreshold.toFixed(2)} on both absolute scores simultaneously.
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[10px] text-slate-500">
            {activeThreshold === 0.40 ? "Absolute cutoff check." : "Parametric sensitivity check."}
          </div>
        </div>

        {/* Card 4: Dual-Anchor Buffer Analysis */}
        <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase text-indigo-800 mb-1">
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
              Core & Buffer Structure
            </div>
            <div className="text-lg font-extrabold text-indigo-950 mt-1">
              9 Core / 7 Buffer
            </div>
            <div className="text-xs text-indigo-900 mt-1 leading-snug">
              All 9 Dual-P40 core districts are strictly nested within the 16 Dual-Median set. 7 buffer districts sit in the transitional P40–P50 zone.
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-indigo-200/70 text-[10px] text-indigo-700">
            Buffer: Sunamganj, Kishoreganj, Sirajganj...
          </div>
        </div>
      </div>

      {/* Threshold Sweep Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Cutoff Specification</th>
              <th className="py-2.5 px-3">Flagged Districts</th>
              <th className="py-2.5 px-3">National Share</th>
              <th className="py-2.5 px-3">Composition / Key Districts</th>
              <th className="py-2.5 px-3">Policy Classification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            <tr className="bg-emerald-50/50 font-semibold text-emerald-950">
              <td className="py-2.5 px-3 text-emerald-700 font-mono">Dual-P40 Core</td>
              <td className="py-2.5 px-3 font-bold">9</td>
              <td className="py-2.5 px-3">14.1%</td>
              <td className="py-2.5 px-3 text-emerald-800 text-[11px]">
                Habiganj, Moulvibazar, Chapainawabganj, Lalmonirhat, Bandarban, Natore, Naogaon, Rajbari, Cox's Bazar.
              </td>
              <td className="py-2.5 px-3">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Invariant Core Priority
                </span>
              </td>
            </tr>
            <tr className="bg-rose-50/60 font-semibold text-slate-900">
              <td className="py-2.5 px-3 text-rose-700 font-mono">Dual-Median (P50)</td>
              <td className="py-2.5 px-3 font-bold">16</td>
              <td className="py-2.5 px-3">25.0%</td>
              <td className="py-2.5 px-3 text-slate-700 text-[11px]">
                9 Core Priority + 7 Buffer Districts (Sunamganj, Kishoreganj, Sirajganj, Thakurgaon, Pabna, Magura, Gaibandha).
              </td>
              <td className="py-2.5 px-3">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                  Policy Baseline Target
                </span>
              </td>
            </tr>
            {sensitivityData.threshold_sensitivity.map((row) => {
              const isSelected = row.threshold === activeThreshold;
              return (
                <tr
                  key={row.threshold}
                  className={`${
                    isSelected ? "bg-cyan-50/40 font-medium text-slate-900" : ""
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold">
                    Score &lt; {row.threshold.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3">{row.flagged_count}</td>
                  <td className="py-2.5 px-3">{row.flagged_pct}%</td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                    {row.flagged_count > 0 ? row.flagged_districts.slice(0, 4).join(", ") + (row.flagged_count > 4 ? ` (+${row.flagged_count - 4} more)` : "") : "None meet strict simultaneous cutoff on both axes"}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        row.flagged_count >= 10
                          ? "bg-amber-100 text-amber-800"
                          : row.flagged_count >= 5
                          ? "bg-rose-100 text-rose-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {row.flagged_count >= 10
                        ? "Broad Exclusion Band"
                        : row.flagged_count >= 5
                        ? "Acute Perimeter"
                        : "Extreme Deep Deprivation"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500">
        <div>
          Dual-Anchor Structure: 9 Core Priority districts are strictly contained within 16 Dual-Median districts (7 buffer districts).
        </div>
        <div>
          Dimensional Independence: Spearman &rho; = {sensitivityData.dimensional_independence.digital_vs_service_rank_correlation.toFixed(4)} ({sensitivityData.dimensional_independence.unshared_variance_pct}% unshared variance). Digital collinearity disclosed: Internet & Mobile r = +0.7212.
        </div>
      </div>
    </div>
  );
}
