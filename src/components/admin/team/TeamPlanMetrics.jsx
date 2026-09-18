import { Card } from "@/components/ui/card";

export const TeamPlanMetrics = ({ planData, isAllUsers }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString.split("T")[0];
    }
  };

  const modules = planData.category_totals || {
    'Company Information': 0,
    'System Analysis': 0,
    'Configure HR Policy': 0,
    'Provide Lesson (Path)': 0,
  };

  // --- ACTUALS CALCULATIONS ---
  const totalActualTraining = isAllUsers
    ? planData.actual_training || planData.total_training || 0
    : planData.daily_metrics?.reduce((sum, m) => sum + (Number(m.train_completed) || 0), 0) || 0;

  const totalActualOnboarding = isAllUsers
    ? planData.actual_onboarding || planData.total_onboarding || 0
    : planData.daily_metrics?.reduce((sum, m) => sum + (Number(m.onboard_success) || 0), 0) || 0;

  // 💡 Robust Graduation Actuals with multi-key fallbacks
  const totalActualGraduated = isAllUsers
    ? (planData.actual_graduated || 
       planData.total_graduated || 
       planData.total_grad_book || 
       planData.category_totals?.['Graduation'] || 
       planData.daily_metrics?.reduce((sum, m) => sum + (Number(m.grad_book) || Number(m.graduated) || 0), 0) || 0)
    : planData.daily_metrics?.reduce((sum, m) => sum + (Number(m.grad_book) || Number(m.graduated) || 0), 0) || 0;

  // --- TARGETS CALCULATIONS ---
  const trainingTarget = isAllUsers ? (planData.target_completed_training || 90) : 10;
  const onboardingTarget = isAllUsers ? (planData.target_completed_onboarding || 81) : 9;
  const graduatedTarget = isAllUsers ? (planData.target_graduated || planData.target_grad_book || 81) : 9;

  const getProgress = (actual, target) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((actual / target) * 100), 100);
  };

  return (
    <div className="space-y-6">
      {/* Target & Progress Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* 1. Training Progress Card */}
        <Card className="p-5 bg-white border border-gray-200/85 shadow-xs rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 bg-blue-500 w-full opacity-80" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {isAllUsers ? "Team Training Total" : "Training Progress"}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold">
              {getProgress(totalActualTraining, trainingTarget)}% Done
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-gray-900">{totalActualTraining}</span>
              <span className="text-xs font-medium text-gray-400">/ {trainingTarget} target</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shadow-inner">
              📚
            </div>
          </div>
        </Card>

        {/* 2. Onboarding Progress Card */}
        <Card className="p-5 bg-white border border-gray-200/85 shadow-xs rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 bg-emerald-500 w-full opacity-80" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {isAllUsers ? "Team Onboarding Total" : "Onboarding Progress"}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
              {getProgress(totalActualOnboarding, onboardingTarget)}% Done
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-gray-900">{totalActualOnboarding}</span>
              <span className="text-xs font-medium text-gray-400">/ {onboardingTarget} target</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-inner">
              🚀
            </div>
          </div>
        </Card>

        {/* 3. Graduation Progress Card */}
        <Card className="p-5 bg-white border border-gray-200/85 shadow-xs rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 bg-purple-500 w-full opacity-80" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {isAllUsers ? "Team Graduation Total" : "Graduation Progress"}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 text-[11px] font-bold">
              {getProgress(totalActualGraduated, graduatedTarget)}% Done
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-gray-900">{totalActualGraduated}</span>
              <span className="text-xs font-medium text-gray-400">/ {graduatedTarget} target</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg shadow-inner">
              🎓
            </div>
          </div>
        </Card>

      </div>

      {/* MODULE BREAKDOWN (No Targets, Completion Count Only) */}
      <Card className="bg-white border border-gray-200/85 p-5 shadow-xs rounded-2xl">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
          {isAllUsers ? "Team Module Completion Overview" : "Member Module Status"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Company's Information
              </span>
              <span className="text-2xl font-black text-indigo-600">
                {modules['Company Information']}
              </span>
              <span className="text-[10px] text-gray-400 ml-1">completions</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
              🏢
            </div>
          </div>

          <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                System Analysis
              </span>
              <span className="text-2xl font-black text-blue-600">
                {modules['System Analysis']}
              </span>
              <span className="text-[10px] text-gray-400 ml-1">completions</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
              📊
            </div>
          </div>

          <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Configure HR Policy
              </span>
              <span className="text-2xl font-black text-amber-600">
                {modules['Configure HR Policy']}
              </span>
              <span className="text-[10px] text-gray-400 ml-1">completions</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold">
              ⚙️
            </div>
          </div>

          <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Provide Lesson (Path)
              </span>
              <span className="text-2xl font-black text-emerald-600">
                {modules['Provide Lesson (Path)']}
              </span>
              <span className="text-[10px] text-gray-400 ml-1">completions</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
              🎯
            </div>
          </div>
        </div>
      </Card>

      {/* Daily Metrics Breakdown Table */}
      <Card className="bg-white border border-gray-200/85 overflow-hidden shadow-xs rounded-2xl">
        <div className="p-4 px-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2.5">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              {isAllUsers ? "Combined Team Daily Log Breakdown" : "Daily Log Breakdown"}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-gray-200/80 text-gray-700 text-[10px] font-bold">
              Read-Only
            </span>
          </div>
          <span className="text-xs text-gray-500 font-semibold bg-white px-3 py-1 rounded-lg border border-gray-200/60 shadow-2xs">
            📅 {formatDate(planData.start_date)} → {formatDate(planData.end_date)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/40 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Day</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5 text-center">Train Exp</th>
                <th className="py-3.5 px-5 text-center">Train Done</th>
                <th className="py-3.5 px-5 text-center">Delay/Cancel</th>
                <th className="py-3.5 px-5 text-center">Onboard Success</th>
                <th className="py-3.5 px-5 text-center">Grad Book</th>
                {!isAllUsers && <th className="py-3.5 px-5">Daily Note / Comment</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {planData.daily_metrics && planData.daily_metrics.length > 0 ? (
                planData.daily_metrics.map((metric) => (
                  <tr key={metric.id || metric.day_name} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-5 font-bold text-gray-900">{metric.day_name}</td>
                    <td className="py-4 px-5 text-gray-400 font-normal">
                      {formatDate(metric.record_date)}
                    </td>
                    <td className="py-4 px-5 text-center text-gray-600">
                      {metric.train_expected ?? 0}
                    </td>
                    <td className="py-4 px-5 text-center font-bold text-blue-600">
                      <span className="px-2 py-1 rounded-md bg-blue-50">{metric.train_completed ?? 0}</span>
                    </td>
                    <td className="py-4 px-5 text-center font-bold text-rose-500">
                      {metric.train_cancel_delay > 0 ? (
                        <span className="px-2 py-1 rounded-md bg-rose-50">{metric.train_cancel_delay}</span>
                      ) : (
                        <span className="text-gray-300">0</span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-center font-bold text-emerald-600">
                      <span className="px-2 py-1 rounded-md bg-emerald-50">{metric.onboard_success ?? 0}</span>
                    </td>
                    <td className="py-4 px-5 text-center font-bold text-purple-600">
                      <span className="px-2 py-1 rounded-md bg-purple-50">{metric.grad_book ?? 0}</span>
                    </td>
                    {!isAllUsers && (
                      <td className="py-4 px-5 text-gray-500 font-normal max-w-xs truncate">
                        {metric.comment || <span className="text-gray-300 italic">No note added</span>}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAllUsers ? 7 : 8} className="py-10 text-center text-gray-400">
                    No daily records logged for this week.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};