import { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const CompanySummaryDashboard = () => {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(9);
  const [weekNumber, setWeekNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await apiService.getCompanySummary({
        year,
        month,
        week_number: weekNumber,
      });
      setData(res);
    } catch (err) {
      console.error("Failed to load company summary", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [year, month, weekNumber]);

  const summary = data?.summary;
  const members = data?.members || [];

  return (
    <div className="p-6 w-full mx-auto">
      {/* Header & Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Company Performance Summary</h1>
          <p className="text-xs text-gray-500">Aggregated team deliverables across all active trainers.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Year</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="h-9 px-2.5 text-xs border border-gray-300 rounded-md bg-white"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Month</span>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="h-9 px-2.5 text-xs border border-gray-300 rounded-md bg-white"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Week</span>
            <select
              value={weekNumber}
              onChange={(e) => setWeekNumber(Number(e.target.value))}
              className="h-9 px-2.5 text-xs border border-gray-300 rounded-md bg-white"
            >
              {[1, 2, 3, 4, 5].map((w) => (
                <option key={w} value={w}>
                  Week {w}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end pt-4">
            <Button variant="outline" size="sm" onClick={fetchSummary} className="h-9 text-xs">
              🔄 Refresh
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <Card className="p-12 text-center text-gray-400 text-xs">Aggregating company metrics...</Card>
      ) : !summary ? (
        <Card className="p-12 text-center text-gray-400 text-xs">No records found for this timeframe.</Card>
      ) : (
        <div className="space-y-6">
          {/* Executive Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="p-4 bg-white border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Trainings</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-blue-600">{summary.actuals.training}</span>
                <span className="text-xs text-gray-400">/ {summary.targets.training} target</span>
              </div>
            </Card>

            <Card className="p-4 bg-white border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Onboarding Success</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-emerald-600">{summary.actuals.onboarding}</span>
                <span className="text-xs text-gray-400">/ {summary.targets.onboarding} target</span>
              </div>
            </Card>

            <Card className="p-4 bg-white border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Graduations</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-purple-600">{summary.actuals.graduated}</span>
                <span className="text-xs text-gray-400">/ {summary.targets.graduated} target</span>
              </div>
            </Card>

            <Card className="p-4 bg-white border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Delays / Cancellations</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-rose-500">{summary.actuals.delays_cancels}</span>
                <span className="text-xs text-gray-400">incidents</span>
              </div>
            </Card>
          </div>

          {/* Member Contribution Breakdown Table */}
          <Card className="bg-white border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Staff Contribution Breakdown
              </h2>
              <span className="text-xs text-gray-400">{members.length} Active Plan(s)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-semibold text-gray-500 uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Trainer</th>
                    <th className="py-2.5 px-4 text-center">Training (Act / Tgt)</th>
                    <th className="py-2.5 px-4 text-center">Onboarding (Act / Tgt)</th>
                    <th className="py-2.5 px-4 text-center">Graduated (Act / Tgt)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.length > 0 ? (
                    members.map((m) => (
                      <tr key={m.user_id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-gray-800">{m.user_name}</p>
                          <p className="text-[10px] text-gray-400">{m.user_email}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-blue-600">{m.actual_training}</span>
                          <span className="text-gray-400"> / {m.target_training}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-emerald-600">{m.actual_onboarding}</span>
                          <span className="text-gray-400"> / {m.target_onboarding}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-purple-600">{m.actual_graduated}</span>
                          <span className="text-gray-400"> / {m.target_graduated}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-400">
                        No member contributions submitted for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
