"use client";

import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { BarYAxis } from "@/components/charts/bar-y-axis";
import { ChartTooltip } from "@/components/charts/tooltip";
import { BarChart2, Smartphone, Building2 } from "lucide-react";

interface DivisionStat {
  division: string;
  totalDistricts: number;
  doubleGapCount: number;
  doubleGapRate: number;
  avgDigital: number;
  avgService: number;
}

interface DivisionBarChartProps {
  divisionStats: DivisionStat[];
}

export default function DivisionBarChart({ divisionStats }: DivisionBarChartProps) {
  // Format data for Bklit BarChart
  const chartData = divisionStats.map((d) => ({
    name: d.division.replace(" Division", ""),
    digital: Number(d.avgDigital.toFixed(2)),
    service: Number(d.avgService.toFixed(2)),
    doubleGapCount: d.doubleGapCount,
  }));

  return (
    <section id="division-chart-section" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 bg-white px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1.5 shadow-sm">
                <BarChart2 className="w-3.5 h-3.5 text-cyan-600" />
                Regional Exclusion Breakdown
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Divisional Disparity & Gap Comparison
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Comparing average Digital Access (Cyan) vs. Physical Service Access (Amber) across Bangladesh’s 8 divisions. Notice how Rangpur and Mymensingh lag critically across both dimensions.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-cyan-600 inline-block shadow-xs" />
              <span className="text-slate-700 font-semibold flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-cyan-600" />
                Digital Access (0–1)
              </span>
            </div>
            <div className="h-3 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-amber-600 inline-block shadow-xs" />
              <span className="text-slate-700 font-semibold flex items-center gap-1">
                <Building2 className="w-3 h-3 text-amber-600" />
                Physical Service (0–1)
              </span>
            </div>
          </div>
        </div>

        {/* Bklit BarChart Container */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="relative w-full h-[400px]">
            {/* Custom Y-Axis Scale Guides (0.0 to 1.0) */}
            <div className="absolute left-0 top-6 bottom-14 w-10 flex flex-col justify-between text-[11px] font-mono text-slate-400 select-none pointer-events-none text-right pr-2">
              <span>1.0</span>
              <span>0.8</span>
              <span>0.6</span>
              <span>0.4</span>
              <span>0.2</span>
              <span>0.0</span>
            </div>

            <div className="w-full h-full pl-8">
              <BarChart
                data={chartData}
                xDataKey="name"
                barGap={0.25}
                margin={{ top: 20, right: 20, bottom: 50, left: 20 }}
                className="w-full h-full"
              >
                <BarXAxis />
                <Bar dataKey="digital" fill="#0891b2" lineCap={4} />
                <Bar dataKey="service" fill="#d97706" lineCap={4} />
                <ChartTooltip />
              </BarChart>
            </div>
          </div>

          {/* Division Summary Footnotes */}
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {divisionStats.map((d) => (
              <div key={d.division} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="font-semibold text-slate-800 text-xs truncate">
                  {d.division.replace(" Division", "")}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Double Gap: <strong className="text-rose-700">{d.doubleGapCount}</strong> / {d.totalDistricts} ({Math.round(d.doubleGapRate)}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
