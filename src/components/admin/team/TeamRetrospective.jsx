import { Card } from "@/components/ui/card";

export const TeamRetrospective = ({ planData }) => {
  if (
    !planData.what_worked &&
    !planData.what_didnt_work &&
    !planData.what_to_improve &&
    !planData.what_is_next
  ) {
    return null;
  }

  return (
    <Card className="bg-white border border-gray-200/80 p-5 shadow-xs rounded-xl space-y-4">
      <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2.5">
        Trainer Retrospective & Insights
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 bg-emerald-50/50 rounded-lg border border-emerald-100/80 space-y-1">
          <span className="font-bold text-emerald-800 block">What Worked:</span>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {planData.what_worked || "—"}
          </p>
        </div>

        <div className="p-3.5 bg-rose-50/50 rounded-lg border border-rose-100/80 space-y-1">
          <span className="font-bold text-rose-800 block">What Didn't Work:</span>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {planData.what_didnt_work || "—"}
          </p>
        </div>

        <div className="p-3.5 bg-amber-50/50 rounded-lg border border-amber-100/80 space-y-1">
          <span className="font-bold text-amber-800 block">What to Improve:</span>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {planData.what_to_improve || "—"}
          </p>
        </div>

        <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-100/80 space-y-1">
          <span className="font-bold text-blue-800 block">What is Next:</span>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {planData.what_is_next || "—"}
          </p>
        </div>
      </div>
    </Card>
  );
};