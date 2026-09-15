"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { District } from "@/lib/types";
import { Search, Download, ArrowUpDown, ArrowUpRight, AlertTriangle } from "lucide-react";

interface DistrictTableProps {
  districts: District[];
}

type SortField = "name" | "division" | "population" | "digital" | "service" | "doublegap";

export default function DistrictTable({ districts }: DistrictTableProps) {
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "doublegap" | "resilient">("all");
  const [sortField, setSortField] = useState<SortField>("doublegap");
  const [sortAsc, setSortAsc] = useState(false);

  // Extract divisions
  const divisions = useMemo(() => {
    const set = new Set<string>();
    districts.forEach((d) => set.add(d.division));
    return Array.from(set).sort();
  }, [districts]);

  // Filtering & Sorting
  const filteredAndSorted = useMemo(() => {
    let result = districts.filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.division.toLowerCase().includes(search.toLowerCase());
      const matchDivision =
        divisionFilter === "all" || d.division === divisionFilter;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "doublegap" && d.double_gap_flag) ||
        (statusFilter === "resilient" && !d.double_gap_flag);

      return matchSearch && matchDivision && matchStatus;
    });

    result.sort((a, b) => {
      let aVal: any = 0;
      let bVal: any = 0;

      switch (sortField) {
        case "name":
          aVal = a.name;
          bVal = b.name;
          return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        case "division":
          aVal = a.division;
          bVal = b.division;
          return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        case "population":
          aVal = a.population || 0;
          bVal = b.population || 0;
          break;
        case "digital":
          aVal = a.digital_access_score ?? -1;
          bVal = b.digital_access_score ?? -1;
          break;
        case "service":
          aVal = a.service_access_score ?? -1;
          bVal = b.service_access_score ?? -1;
          break;
        case "doublegap":
          aVal = a.double_gap_flag ? 1 : 0;
          bVal = b.double_gap_flag ? 1 : 0;
          break;
      }

      return sortAsc ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [districts, search, divisionFilter, statusFilter, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "District ID",
      "Name",
      "Division",
      "Population",
      "Digital Access Score",
      "Service Access Score",
      "Double Gap Status",
      "Internet Usage (%)",
      "Healthcare / 100k",
      "Education / 100k",
      "Transit / 100k",
    ];

    const rows = filteredAndSorted.map((d) => [
      d.id,
      `"${d.name}"`,
      `"${d.division}"`,
      d.population || "",
      d.digital_access_score ?? "",
      d.service_access_score ?? "",
      d.double_gap_flag ? "Double Gap" : "Compensated",
      d.digital_breakdown.internet_usage_pct ?? "",
      d.service_breakdown.healthcare_per_capita ?? "",
      d.service_breakdown.education_per_capita ?? "",
      d.service_breakdown.transit_per_capita ?? "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dgi_bangladesh_districts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="explorer-section" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                National District Explorer
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              District Rankings & Sub-Indicator Table
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Compare all 64 districts side by side. Search by name, filter by status or division, and export data for external policy research.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors border border-slate-200 shadow-sm self-start md:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            Export Clean CSV
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search district or division..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 shadow-sm w-56"
              />
            </div>

            {/* Division dropdown */}
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              aria-label="Filter districts by division"
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-cyan-500 shadow-sm"
            >
              <option value="all">All Divisions (64)</option>
              {divisions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Status Tabs */}
            <div className="flex items-center p-0.5 bg-white rounded-lg border border-slate-300">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  statusFilter === "all"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All ({districts.length})
              </button>
              <button
                onClick={() => setStatusFilter("doublegap")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                  statusFilter === "doublegap"
                    ? "bg-rose-600 text-white"
                    : "text-rose-700 hover:bg-rose-50"
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                Double Gap (37)
              </button>
              <button
                onClick={() => setStatusFilter("resilient")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  statusFilter === "resilient"
                    ? "bg-emerald-700 text-white"
                    : "text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                Compensated (27)
              </button>
            </div>
          </div>

          <div className="text-slate-500 text-[11px]">
            Showing <strong>{filteredAndSorted.length}</strong> of {districts.length} districts
          </div>
        </div>

        {/* Data Table with Internal Scroll and Sticky Header */}
        <div className="overflow-x-auto overflow-y-auto max-h-[680px] rounded-xl border border-slate-200 shadow-sm relative">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead className="sticky top-0 z-20 bg-slate-100/95 backdrop-blur-sm text-slate-800 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 select-none shadow-xs">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>District</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("division")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Division</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("population")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Population</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("digital")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Digital Score (0–1)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("service")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Service Score (0–1)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("doublegap")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Double Gap Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredAndSorted.map((d) => {
                const isDoubleGap = d.double_gap_flag;
                const dScore = d.digital_access_score;
                const sScore = d.service_access_score;

                return (
                  <tr
                    key={d.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isDoubleGap ? "bg-rose-50/20" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <Link
                        href={`/district/${d.id}`}
                        className="hover:text-cyan-700 hover:underline flex items-center gap-1.5"
                      >
                        {d.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{d.division}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      {d.population ? d.population.toLocaleString() : "N/A"}
                    </td>

                    {/* Digital Score Bar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-slate-900 w-8">
                          {dScore !== null ? dScore.toFixed(2) : "N/A"}
                        </span>
                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-600 rounded-full"
                            style={{ width: `${(dScore || 0) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Service Score Bar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-slate-900 w-8">
                          {sScore !== null ? sScore.toFixed(2) : "N/A"}
                        </span>
                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-600 rounded-full"
                            style={{ width: `${(sScore || 0) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Double Gap Status Badge */}
                    <td className="py-3 px-4">
                      {isDoubleGap ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Double Gap
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Compensated
                        </span>
                      )}
                    </td>

                    {/* Drill-Down Link */}
                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/district/${d.id}`}
                        className="inline-flex items-center gap-1 text-slate-600 hover:text-cyan-700 font-medium text-xs hover:underline"
                      >
                        Inspect
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
