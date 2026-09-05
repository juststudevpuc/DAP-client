import { useState, useEffect, useRef } from "react";
import useAuthStore from "../store/useAuthStore";
import { apiService } from "../services/api";
import { WeeklyHeader } from "../components/weekly-plan/WeeklyHeader";
import { ActionPlanGrid } from "../components/weekly-plan/ActionPlanGrid";
import { WeeklyFooter } from "../components/weekly-plan/WeeklyFooter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";

export const WeeklyPlanDashboard = () => {
  const [planData, setPlanData] = useState(null);

  // 1. Initialize our routing and global state hooks
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  // 1. MUST initialize with null to avoid rendering errors before data loads
  const componentRef = useRef(null);

  // 2. Initialize the print hook with v3 syntax
  const handlePrint = useReactToPrint({
    contentRef: componentRef, // 🚨 REQUIRED for react-to-print v3
    content: () => componentRef.current, // Keep this as a fallback just in case
    documentTitle: `Weekly_Action_Plan_${planData?.week_number || "01"}`,
    onAfterPrint: () => console.log("Successfully printed!"),
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // ✅ FIXED: Call the new method that hits the '/current' endpoint
        const data = await apiService.getCurrentWeeklyPlan();
        setPlanData(data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    };
    loadDashboard();
  }, []);

  // 2. The Logout Handler
  const handleLogout = async () => {
    try {
      // Tell Laravel to destroy the token in the database
      await apiService.logout();
    } catch (error) {
      console.error("Logout failed on server", error);
    } finally {
      // Always clear local state and redirect to login, even if the server request fails
      logout();
      navigate("/login");
    }
  };

  if (!planData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">
        Loading CheckinMe Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-[1000px] bg-gray-50 p-5">
      {/* 3. Utility Bar - Placed outside the Card so it doesn't affect your theme/layout */}
      <div className="max-w-[1500px] mx-auto flex justify-end gap-2 mb-3 print:hidden">
        <Button
          variant="default"
          size="sm"
          onClick={handlePrint}
          className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
        >
          {/* Printer Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print Plan
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="h-8 text-xs text-gray-600 border-gray-300 hover:bg-gray-100"
        >
          Sign Out
        </Button>
      </div>

      <div ref={componentRef}>
        <Card className=" mx-auto p-6 bg-white shadow-sm rounded-none border-gray-300">
          <WeeklyHeader planData={planData} />
          <ActionPlanGrid dailyMetrics={planData.daily_metrics} />
          <WeeklyFooter planData={planData} />
        </Card>
      </div>
    </div>
  );
};
