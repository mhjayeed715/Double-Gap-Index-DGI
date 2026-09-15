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
    digital: d.avgDigital,
    service: d.avgService,
    doubleGapCount: d.doubleGapCount,
  }));

  return (
    <section id="division-chart-section" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded border border-cyan-200 flex items-center gap-1">
                <BarChart2 className="w-3.5 h-3.5 text-cyan-600" />
                bklit-ui Chart Architecture
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Divisional Averages & Exclusion Disparity
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Comparing average Digital Access Score (Cyan) against average Service Access Score (Amber) across Bangladesh’s 8 divisions.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium bg-white p-2 rounded-lg border border-slate-200 shadow-sm self-start md:self-auto">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cyan-600 inline-block" />
              <span className="text-slate-700 flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-cyan-600" />
                Digital Access (0–1)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-600 inline-block" />
              <span className="text-slate-700 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-amber-600" />
                Physical Service (0–1)
              </span>
            </div>
          </div>
        </div>

        {/* Bklit BarChart Container */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="w-full h-[400px]">
            <BarChart
              data={chartData}
              xDataKey="name"
              barGap={0.25}
              margin={{ top: 20, right: 30, bottom: 40, left: 40 }}
              className="w-full h-full"
            >
              <BarXAxis />
              <BarYAxis />
              <Bar dataKey="digital" fill="#0891b2" lineCap={4} />
              <Bar dataKey="service" fill="#d97706" lineCap={4} />
              <ChartTooltip />
            </BarChart>
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
