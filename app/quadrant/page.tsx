import { getAllDistricts } from "@/lib/data";
import QuadrantChart from "@/components/QuadrantChart";

export const metadata = {
  title: "2x2 Policy Quadrant Matrix | Double Gap Index (DGI)",
  description: "Interactive scatter plot mapping Digital Access vs Physical Service Access across Bangladesh's 64 districts.",
};

export default async function QuadrantPage() {
  const districts = await getAllDistricts();
  return (
    <div className="w-full bg-slate-50 min-h-screen py-8">
      <QuadrantChart districts={districts} />
    </div>
  );
}
