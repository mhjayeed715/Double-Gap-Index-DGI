import MLProfiles from "@/components/MLProfiles";
import Link from "next/link";
import { ArrowLeft, BrainCircuit, Sparkles, BookOpen } from "lucide-react";

export const metadata = {
  title: "Machine Learning & Policy Archetypes | Double Gap Index (DGI)",
  description: "Unsupervised K-Means clustering and centroid loadings identifying 4 macro policy archetypes in Bangladesh.",
};

export default function AnalysisPage() {
  return (
    <div className="w-full bg-slate-50/50 min-h-screen">
      {/* Sub-header Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Interpretable AI & Policy Clusters
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/methodology"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1 rounded-lg transition-colors shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
              View Mathematical Formulas →
            </Link>
          </div>
        </div>
      </div>

      {/* Main ML Profiles Component */}
      <main className="py-6">
        <MLProfiles />
      </main>
    </div>
  );
}
