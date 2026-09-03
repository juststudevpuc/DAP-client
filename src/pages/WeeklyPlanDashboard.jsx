import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { WeeklyHeader } from "../components/weekly-plan/WeeklyHeader";
import { ActionPlanGrid } from "../components/weekly-plan/ActionPlanGrid";
import { WeeklyFooter } from "../components/weekly-plan/WeeklyFooter";
import { Card } from "@/components/ui/card";

export const WeeklyPlanDashboard = () => {
  const [planData, setPlanData] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await apiService.getWeeklyPlan(4);
        setPlanData(data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    };
    loadDashboard();
  }, []);

  if (!planData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading CheckinMe Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-[1200px] mx-auto p-8 bg-white shadow-sm border-gray-300">
        <WeeklyHeader planData={planData} />
        <ActionPlanGrid dailyMetrics={planData.daily_metrics} />
        <WeeklyFooter planData={planData} />
      </Card>
    </div>
  );
};