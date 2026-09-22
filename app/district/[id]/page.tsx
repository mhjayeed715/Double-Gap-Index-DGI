import Link from "next/link";
import { notFound } from "next/navigation";
import { getDistrictById, getAllDistricts, getNationalStats } from "@/lib/data";
import {
  ArrowLeft,
  Smartphone,
  Building2,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Info,
  MapPin,
  Users,
  ShieldCheck,
  Zap,
  GraduationCap,
  HeartPulse,
} from "lucide-react";

interface DistrictPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const districts = await getAllDistricts();
  return districts.map((d) => ({
    id: d.id,
  }));
}

export default async function DistrictPage({ params }: DistrictPageProps) {
  const { id } = await params;
  const district = await getDistrictById(id);

  if (!district) {
    notFound();
  }

  const stats = await getNationalStats();
  const isDoubleGap = district.double_gap_flag;
  const dScore = district.digital_access_score;
  const sScore = district.service_access_score;

  // Sub-indicators for Digital (BBS Census 2022 Admin 02)
  const digitalItems = [
    {
      name: "Internet Usage Rate (15+)",
      value: district.digital_breakdown.internet_usage_pct,
      unit: "%",
      national: 37.5,
      desc: "Individuals aged 15+ who accessed internet (BBS Census 2022)",
    },
    {
      name: "Mobile Phone Ownership (15+)",
      value: district.digital_breakdown.mobile_ownership_pct,
      unit: "%",
      national: 70.8,
      desc: "Individuals aged 15+ owning a mobile device (BBS Census 2022)",
    },
    {
      name: "Mobile Financial Services (MFS)",
      value: district.digital_breakdown.mobile_banking_pct,
      unit: "%",
      national: 42.1,
      desc: "Individuals aged 15+ with mobile banking account (BBS Census 2022)",
    },
  ];

  // Sub-indicators for Physical Services (HeiGIT HDX & BBS Census 2022)
  const serviceItems = [
    {
      name: "Hospital Access (30-min walking/transit)",
      value: district.service_breakdown.hospital_access_pct,
      unit: "%",
      national: 46.2,
      desc: "Share of population within 30 min of a hospital (HeiGIT HDX)",
    },
    {
      name: "Education Access (5km buffer)",
      value: district.service_breakdown.education_access_pct,
      unit: "%",
      national: 73.1,
      desc: "Share of population within 5km of an educational facility (HeiGIT HDX)",
    },
    {
      name: "National Grid Electricity Access",
      value: district.service_breakdown.electricity_access_pct,
      unit: "%",
      national: 92.4,
      desc: "Households connected to the national electrical grid (BBS Census 2022)",
    },
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-4">
          <Link
            href="/#map-section"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to National Map & Quadrant Matrix
          </Link>
        </div>

        {/* Empirical Pilot Notification */}
        <div className="mb-6 p-4 bg-emerald-50/90 rounded-2xl border border-emerald-200 text-emerald-950 text-xs shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="font-mono font-bold text-[10px] uppercase bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
              Verified Empirical Record
            </span>
            <span className="leading-snug">
              Recomputed from <strong>BBS Census 2022 Admin 02</strong> (100% CAPI enumeration, 165.1M nationals) & <strong>HeiGIT HDX accessibility models</strong>.
            </span>
          </div>
          <span className="text-[11px] text-emerald-800/80 font-mono self-end sm:self-auto shrink-0">
            Census 2022 Pilot
          </span>
        </div>

        {/* District Headline Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {district.division}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ID: {district.id}
                </span>
                {district.is_invariant_core && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    Invariant Core Priority
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {district.name} District
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                Population:{" "}
                <strong className="text-slate-700 font-semibold">
                  {district.population ? district.population.toLocaleString() : "Data unavailable"}
                </strong>{" "}
                (BBS Census 2022 Enumeration)
              </p>
            </div>

            {/* Status Badge */}
            <div>
              {isDoubleGap ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 max-w-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block text-rose-700">
                      Double Gap Status: Critical
                    </span>
                    <p className="text-xs text-rose-700/90 mt-0.5 leading-relaxed">
                      Falls below national medians on both Digital (&lt; 0.40) and Service (&lt; 0.58) axes. Compounded exclusion zone.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 max-w-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block text-emerald-800">
                      Compensated Access
                    </span>
                    <p className="text-xs text-emerald-700/90 mt-0.5 leading-relaxed">
                      At least one dimension exceeds the national median, providing either a digital workaround or physical facility cushion.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TWO SIDE-BY-SIDE SCORE CARDS — NEVER BLENDED */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Core Independent Axes (Non-Blended)
              </span>
              <span className="text-[11px] text-slate-400 italic">
                Normalized scale 0.00 – 1.00 (Higher is better)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Digital Access Score Card */}
              <div className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50/70 to-white p-6 shadow-sm">
                <div className="flex items-center justify-between text-cyan-900 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-cyan-700" />
                    Digital Access Score
                  </span>
                  <span className="text-xs font-mono font-medium text-cyan-800 bg-cyan-100/80 px-2 py-0.5 rounded">
                    Median: 0.40
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-black text-cyan-950 tracking-tight">
                    {dScore !== null ? dScore.toFixed(2) : "N/A"}
                  </span>
                  <span className="text-sm font-semibold text-cyan-700">/ 1.00</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-cyan-100 rounded-full overflow-hidden mt-4">
                  <div
                    className="h-full bg-cyan-600 rounded-full"
                    style={{ width: `${(dScore || 0) * 100}%` }}
                  />
                </div>

                <p className="text-xs text-cyan-900/80 mt-3 leading-relaxed">
                  Composite score of population internet adoption (33.3%), mobile phone ownership (33.3%), and mobile banking usage (33.4%).
                </p>

                <div className="mt-4 pt-3 border-t border-cyan-100 text-[11px] text-cyan-700">
                  <strong>Source:</strong> {district.digital_breakdown.source_citation}
                </div>
              </div>

              {/* Physical Service Access Score Card */}
              <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/70 to-white p-6 shadow-sm">
                <div className="flex items-center justify-between text-amber-900 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-700" />
                    Service Access Score
                  </span>
                  <span className="text-xs font-mono font-medium text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                    Median: 0.58
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-black text-amber-950 tracking-tight">
                    {sScore !== null ? sScore.toFixed(2) : "N/A"}
                  </span>
                  <span className="text-sm font-semibold text-amber-700">/ 1.00</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden mt-4">
                  <div
                    className="h-full bg-amber-600 rounded-full"
                    style={{ width: `${(sScore || 0) * 100}%` }}
                  />
                </div>

                <p className="text-xs text-amber-900/80 mt-3 leading-relaxed">
                  Composite score of 30-min hospital accessibility (33.3%), 5km education accessibility (33.3%), and grid electrification (33.4%).
                </p>

                <div className="mt-4 pt-3 border-t border-amber-100 text-[11px] text-amber-700">
                  <strong>Source:</strong> {district.service_breakdown.source_citation}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUB-INDICATOR BREAKDOWN SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Digital Sub-Indicators */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Smartphone className="w-4 h-4 text-cyan-600" />
              Digital Access Sub-Indicators
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Primary 100% CAPI enumeration from BBS Census 2022 Admin 02.
            </p>

            <div className="space-y-4">
              {digitalItems.map((item, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {item.desc}
                      </div>
                    </div>

                    <div className="text-right">
                      {item.value !== null ? (
                        <span className="text-base font-bold text-slate-900 font-mono">
                          {item.value}
                          <span className="text-xs font-normal text-slate-500 ml-0.5">
                            {item.unit}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-600 italic">
                          Data unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  {typeof item.value === "number" && (
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500">
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-600 h-full rounded-full"
                          style={{ width: `${Math.min(100, item.value)}%` }}
                        />
                      </div>
                      <span className="whitespace-nowrap font-mono text-[10px]">
                        Nat: {item.national}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contextual Gender Card */}
            <div className="mt-5 p-4 rounded-xl bg-cyan-50/50 border border-cyan-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-cyan-900">
                  Contextual Gender Equity Profile
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                  Unweighted Metric
                </span>
              </div>
              <p className="text-[11px] text-cyan-900/80 mb-3 leading-snug">
                Reported as an unweighted contextual indicator per Rule 4. Dropped from the composite score to prevent redundant weighting with total usage (r = 0.989).
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2 rounded-lg border border-cyan-100">
                  <span className="text-[10px] text-slate-500 block">Female Usage</span>
                  <span className="font-mono font-bold text-cyan-950 text-sm">
                    {district.digital_breakdown.female_usage_pct}%
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-cyan-100">
                  <span className="text-[10px] text-slate-500 block">Male Usage</span>
                  <span className="font-mono font-bold text-cyan-950 text-sm">
                    {district.digital_breakdown.male_usage_pct}%
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-cyan-100">
                  <span className="text-[10px] text-slate-500 block">Gender Gap</span>
                  <span className="font-mono font-bold text-rose-700 text-sm">
                    {district.digital_breakdown.gender_gap_pct}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Sub-Indicators */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-amber-600" />
              Physical Service Sub-Indicators
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Population accessibility models (HeiGIT HDX) & BBS Census 2022 electrification.
            </p>

            <div className="space-y-4">
              {serviceItems.map((item, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {item.desc}
                      </div>
                    </div>

                    <div className="text-right">
                      {item.value !== null ? (
                        <span className="text-base font-bold text-slate-900 font-mono">
                          {item.value}
                          <span className="text-xs font-normal text-slate-500 ml-0.5">
                            {item.unit}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-600 italic">
                          Data unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  {typeof item.value === "number" && (
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500">
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-600 h-full rounded-full"
                          style={{ width: `${Math.min(100, item.value)}%` }}
                        />
                      </div>
                      <span className="whitespace-nowrap font-mono text-[10px]">
                        Nat: {item.national}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Secondary Administrative Counts Card */}
            <div className="mt-5 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-amber-900">
                  LGED Spatial Point Counts
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Administrative Records
                </span>
              </div>
              <p className="text-[11px] text-amber-900/80 mb-3 leading-snug">
                Point-in-polygon spatial counts from LGED repositories. Documented as secondary records due to geographic survey density skew.
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2 rounded-lg border border-amber-100">
                  <span className="text-[10px] text-slate-500 block">LGED Hospitals</span>
                  <span className="font-mono font-bold text-amber-950 text-sm">
                    {district.service_breakdown.lged_hospital_count ?? 0}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-amber-100">
                  <span className="text-[10px] text-slate-500 block">Family Welfare</span>
                  <span className="font-mono font-bold text-amber-950 text-sm">
                    {district.service_breakdown.lged_fwc_count ?? 0}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-amber-100">
                  <span className="text-[10px] text-slate-500 block">LGED Schools</span>
                  <span className="font-mono font-bold text-amber-950 text-sm">
                    {district.service_breakdown.lged_school_count ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* POLICY RECOMMENDATION & CITATION CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-xs text-slate-600">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
            <Info className="w-4 h-4 text-cyan-600" />
            Intervention Synthesis & Analytical Context
          </div>
          <p className="leading-relaxed mb-3">
            {isDoubleGap ? (
              <span>
                <strong>Urgent Priority:</strong> Because {district.name} suffers from both digital and physical service exclusion, single-gap interventions (e.g., funding a remote learning app without local connectivity, or building physical clinics without digital equipment) will fail in isolation. Multilateral partners like UNDP should structure bundled programs combining off-grid digital access and community health centers.
              </span>
            ) : dScore !== null && dScore >= 0.40 && sScore !== null && sScore < 0.58 ? (
              <span>
                <strong>Digital Leverage Strategy:</strong> While physical facility accessibility is below the national median in {district.name}, mobile connectivity is strong. Interventions should prioritize digital telemedicine, mobile diagnostic vans, and e-learning platforms to bridge the physical infrastructure gap.
              </span>
            ) : (
              <span>
                <strong>Physical Reinforcement Strategy:</strong> With physical facilities accessible, priority should be placed on training rural medical staff and teachers on digital systems to raise local digital adoption.
              </span>
            )}
          </p>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>Citational Reference: BBS Census 2022 (Admin 02) & HeiGIT HDX Accessibility Models</span>
            <Link href="/methodology" className="text-cyan-700 hover:underline flex items-center gap-1 font-medium">
              Read complete scoring methodology
              <BookOpen className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
