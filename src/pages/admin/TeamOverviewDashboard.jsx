import { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import { Card } from "@/components/ui/card";
import { TeamFilters } from "../../components/admin/team/TeamFilters";
import { TeamMemberBanner } from "../../components/admin/team/TeamMemberBanner";
import { TeamPlanMetrics } from "../../components/admin/team/TeamPlanMetrics";
import { TeamRetrospective } from "../../components/admin/team/TeamRetrospective";

export const TeamOverviewDashboard = () => {
  const [members, setMembers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("all");
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(9);
  const [weekNumber, setWeekNumber] = useState(1);

  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [isAllUsers, setIsAllUsers] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const users = await apiService.getAllUsers();
        const list = Array.isArray(users) ? users : users?.data || [];
        setMembers(list);
      } catch (err) {
        console.error("Failed to fetch staff members", err);
      }
    };
    loadMembers();
  }, []);

  const fetchMemberPlan = async () => {
    setLoading(true);
    try {
      const response = await apiService.getMemberPlan({
        user_id: selectedUserId,
        year,
        month,
        week_number: weekNumber,
      });

      setIsAllUsers(response?.is_all_users || false);
      setPlanData(response?.plan || null);
      setTargetUser(response?.target_user || null);
    } catch (err) {
      console.error("Failed to load plan data", err);
      setPlanData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberPlan();
  }, [selectedUserId, year, month, weekNumber]);

  return (
    <div className="p-6 w-full space-y-6">
      <TeamFilters
        members={members}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
        weekNumber={weekNumber}
        setWeekNumber={setWeekNumber}
        onRefresh={fetchMemberPlan}
      />

      <TeamMemberBanner
        targetUser={targetUser}
        weekNumber={weekNumber}
        month={month}
        year={year}
        planData={planData}
      />

      {loading ? (
        <Card className="p-16 text-center text-gray-400 text-xs shadow-xs w-full">
          Loading metrics data...
        </Card>
      ) : !planData ? (
        <Card className="p-16 text-center text-gray-400 text-xs shadow-xs w-full">
          No records found for Week {weekNumber}, Month {month}, {year}.
        </Card>
      ) : (
        <div className="space-y-6 w-full">
          <TeamPlanMetrics planData={planData} isAllUsers={isAllUsers} />
          {!isAllUsers && <TeamRetrospective planData={planData} />}
        </div>
      )}
    </div>
  );
};