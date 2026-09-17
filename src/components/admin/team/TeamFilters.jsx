import { Button } from "@/components/ui/button";

export const TeamFilters = ({
  members,
  selectedUserId,
  setSelectedUserId,
  year,
  setYear,
  month,
  setMonth,
  weekNumber,
  setWeekNumber,
  onRefresh,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Team Plan Inspector</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Inspect individual member commitments or company-wide team performance by week.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Member Selector */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Staff Member / Scope
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="h-9 px-3 text-xs border border-gray-300 rounded-lg bg-gray-50/50 font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-500/25 outline-none transition"
          >
            <option value="all">🌟 All Users (Team Summary)</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                👤 {m.name} ({m.role})
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="h-9 px-3 text-xs border border-gray-300 rounded-lg bg-gray-50/50 font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-500/25 outline-none transition"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>

        {/* Month */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Month
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="h-9 px-3 text-xs border border-gray-300 rounded-lg bg-gray-50/50 font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-500/25 outline-none transition"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {String(m).padStart(2, "0")} - {new Date(2026, m - 1).toLocaleString('default', { month: 'short' })}
              </option>
            ))}
          </select>
        </div>

        {/* Week */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Week
          </label>
          <select
            value={weekNumber}
            onChange={(e) => setWeekNumber(Number(e.target.value))}
            className="h-9 px-3 text-xs border border-gray-300 rounded-lg bg-gray-50/50 font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-500/25 outline-none transition"
          >
            {[1, 2, 3, 4, 5].map((w) => (
              <option key={w} value={w}>
                Week {w}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end h-full pt-5">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="h-9 text-xs font-semibold px-3.5 hover:bg-gray-50"
          >
            🔄 Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};