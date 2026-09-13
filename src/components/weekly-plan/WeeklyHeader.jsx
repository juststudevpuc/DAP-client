import { useState, useEffect } from "react";
import useAuthStore from "../../store/useAuthStore";

export const WeeklyHeader = ({ planData, currentWeekNumber }) => {
  const user = useAuthStore((state) => state.user);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (planData) {
      const formatForInput = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
      };

      setStartDate(formatForInput(planData.start_date));
      setEndDate(formatForInput(planData.end_date));
    }
  }, [planData]);

  const formatDisplayDate = (isoString) => {
    if (!isoString) return ".... / .... / ....";
    const parts = isoString.split("-");
    if (parts.length < 3) return isoString;
    const [year, month, day] = parts;
    return `${day} / ${month} / ${year}`;
  };

  return (
    <div>
      <div className="flex items-center justify-center relative">
        <div className="absolute left-0 text-blue-600 font-bold text-xl flex items-center gap-2">
          <img
            src="/checkinme-logo.jpg"
            alt="Hero Banner"
            className="w-6 h-6"
          />
          <div>
            <div className="leading-none text-sm">CheckinMe</div>
            <div className="text-[9px] font-normal text-gray-500">
              Automate Workplace
            </div>
          </div>
        </div>

        <h1 className="text-[15px] font-bold text-center text-gray-900 tracking-tight print:text-[18px]">
          Weekly Action Plan ផែនការសកម្មភាពប្រចាំសប្តាហ៍
        </h1>
      </div>

      <div className="flex flex-col gap-6 text-[12px] font-semibold text-gray-800 px-2 mt-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="text-left">
            Name/ ឈ្មោះ: {user?.name || "Loading..."}
          </div>

          {/* DATES WITH CALENDAR PICKER */}
          <div className="flex items-center justify-center gap-2 whitespace-nowrap">
            <span>Date:</span>

            {/* Start Date */}
            <div className="relative inline-flex items-center justify-center group">
              <span className="border-b border-gray-400 px-1 min-w-[90px] text-center text-[12px] font-medium pb-[1px]">
                {formatDisplayDate(startDate)}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 ml-1 print:hidden group-hover:text-blue-500 transition-colors"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <span>to</span>

            {/* End Date */}
            <div className="relative inline-flex items-center justify-center group">
              <span className="border-b border-gray-400 px-1 min-w-[90px] text-center text-[12px] font-medium pb-[1px]">
                {formatDisplayDate(endDate)}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 ml-1 print:hidden group-hover:text-blue-500 transition-colors"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* READ-ONLY WEEK NUMBER */}
          <div className="flex items-center justify-end gap-1">
            <span>Week/ សប្តាហ៍:</span>
            <div className="flex items-center">
              <input
                type="number"
                readOnly
                value={currentWeekNumber ?? 1}
                style={{ textAlign: "center", width: "25px", fontSize: "15px" }}
                className="bg-transparent border-0 border-b border-gray-400 outline-none text-[12px] font-medium p-0 m-0 h-[18px] leading-none rounded-none shadow-none cursor-default select-none print:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* FIXED METRIC TARGETS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-left">
            ប្រកាស Completed Training:{" "}
            <span className="ml-1 font-normal">10</span>
          </div>
          <div className="text-center">
            ប្រកាស Completed Onboarding:{" "}
            <span className="ml-1 font-normal">9</span>
          </div>
          <div className="text-right">
            ប្រកាស Graduated:{" "}
            <span className="ml-1 font-normal">9</span>
          </div>
        </div>
      </div>
    </div>
  );
};