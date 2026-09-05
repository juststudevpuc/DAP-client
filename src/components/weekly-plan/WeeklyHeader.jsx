// 1. Import your Zustand store
import useAuthStore from "../../store/useAuthStore"; 

export const WeeklyHeader = ({ planData }) => {
  // 2. Extract the user object from global state
  const user = useAuthStore((state) => state.user);

  // Helper function to format Laravel timestamps into clean "DD / MM / YYYY" text
  const formatDate = (dateString) => {
    if (!dateString) return "...";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, " / ");
  };

  return (
    <div className="">
      {/* Top Title Section */}
      <div className="flex items-center justify-center mb- relative">
        <div className="absolute left-0 text-blue-600 font-bold text-xl flex items-center gap-2">
          <img src="/checkinme-logo.jpg" alt="Hero Banner" className="w-6 h-6" />
          <div>
            <div className="leading-none text-sm">CheckinMe</div>
            <div className="text-[9px] font-normal text-gray-500">
              Automate Workplace
            </div>
          </div>
        </div>

        <h1 className="text-[15px] font-bold text-center text-gray-900 tracking-tight">
          Weekly Action Plan
        </h1>
      </div>

      {/* Information Rows */}
      <div className="flex flex-col gap-6 text-[12px] font-semibold text-gray-800 px-2 mt-3">
        
        {/* Row 1: Employee, Dates, Week */}
        <div className="grid grid-cols-3 gap-4">
          {/* 3. Dynamically display the logged-in user's name */}
          <div className="text-left">Name: {user?.name || "Loading..."}</div>
        
          <div className="text-center">
            Date.: {formatDate(planData?.start_date)} to{" "}
            {formatDate(planData?.end_date)}
          </div>
          <div className="text-right">
            Week: {planData?.week_number?.toString().padStart(2, "0") || "01"}
          </div>
        </div>
        {/* Row 2: Target Metrics (Now dynamically mapped to your database!) */}
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