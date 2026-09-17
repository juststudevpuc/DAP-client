export const TeamMemberBanner = ({ targetUser, weekNumber, month, year, planData }) => {
  if (!targetUser) return null;

  // Helper to format ISO dates cleanly
  const formatDate = (dateString) => {
    if (!dateString) return null;
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

  const startDateFormatted = formatDate(planData?.start_date);
  const endDateFormatted = formatDate(planData?.end_date);

  return (
    <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md w-full">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white font-black text-base flex items-center justify-center shadow-inner">
          {targetUser.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-base font-bold tracking-wide">{targetUser.name}</span>
            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/30 border border-blue-400/30 text-blue-200 text-[10px] font-extrabold uppercase tracking-wider">
              {targetUser.role || "user"}
            </span>
          </div>
          <p className="text-xs text-blue-200/80 mt-0.5">{targetUser.email}</p>
        </div>
      </div>
      <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10 flex sm:flex-col justify-between items-center sm:items-end">
        <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest block">
          Inspection Period (Week {weekNumber})
        </span>
        <span className="text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-lg border border-white/10 mt-1 inline-block">
          {startDateFormatted && endDateFormatted
            ? `${startDateFormatted} → ${endDateFormatted}`
            : `Month ${month}, ${year}`}
        </span>
      </div>
    </div>
  );
};