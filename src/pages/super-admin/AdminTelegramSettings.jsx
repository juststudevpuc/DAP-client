import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiService from "@/services/api"; // Adjust to your api import path

export const AdminTelegramSettings = () => {
  const [autoAlertsEnabled, setAutoAlertsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  // Fetch current status on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiService.get("/admin/telegram/auto-alerts");
      setAutoAlertsEnabled(response.data.enabled);
    } catch (err) {
      console.error("Failed to fetch auto-alert settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (e) => {
    const newValue = e.target.checked;
    setAutoAlertsEnabled(newValue); // Optimistic UI update
    setToggling(true);

    try {
      await apiService.post("/admin/telegram/auto-alerts", {
        enabled: newValue,
      });

      Swal.fire({
        icon: "success",
        title: "Settings Updated",
        text: `Automated Telegram alerts have been turned ${newValue ? "ON" : "OFF"}.`,
        showConfirmButton: false,
        timer: 1500,
        customClass: { popup: "rounded-2xl shadow-xl border border-gray-100" },
      });
    } catch (err) {
      console.error("Failed to update status", err);
      setAutoAlertsEnabled(!newValue); // Revert if failed
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not save settings change. Please try again.",
        confirmButtonColor: "#ef4444",
        customClass: { popup: "rounded-2xl shadow-xl border border-gray-100" },
      });
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-xs text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-xl space-y-4">
      <div>
        <h3 className="text-base font-bold text-gray-900">
          🤖 Telegram Bot Automated Reminders
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Master switch to control automated evening alerts for users who haven't completed their daily metrics.
        </p>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50/70 border border-gray-200/80 rounded-xl">
        <div>
          <span className="block font-bold text-xs text-gray-800 uppercase tracking-wider">
            Daily Reminders Sweep
          </span>
          <span className="text-[11px] text-gray-500">
            {autoAlertsEnabled ? "Currently Active (Runs daily at 6:00 PM)" : "Currently Disabled globally"}
          </span>
        </div>

        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={autoAlertsEnabled}
            onChange={handleToggle}
            disabled={toggling}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
        </label>
      </div>
    </div>
  );
};