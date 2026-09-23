import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { apiService } from "../../services/api"; // Ensure path matches your project structure

export const AdminSettingsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    try {
      const response = await apiService.getSystemSettings();
      // Handle response based on whether it returns { users: [...] } or the array directly
      setUsers(response.users || response.data || response);
    } catch (err) {
      console.error("Failed to load system settings data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId, currentState) => {
    const newState = !currentState;
    
    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, telegram_notifications_enabled: newState } : u))
    );

    try {
      await apiService.toggleUserTelegramNotification(userId, {
        telegram_notifications_enabled: newState,
      });
    } catch (err) {
      console.error("Failed to toggle user telegram status", err);
      // Revert on error
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, telegram_notifications_enabled: currentState } : u))
      );
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not update user setting. Please try again.",
        confirmButtonColor: "#ef4444",
        customClass: { popup: "rounded-2xl shadow-xl border border-gray-100" },
      });
    }
  };

  const handleTestSend = async (userId, userName, hasChatId) => {
    if (!hasChatId) {
      Swal.fire({
        icon: "warning",
        title: "Not Connected",
        text: `${userName} has not linked a Telegram Chat ID yet.`,
        confirmButtonColor: "#3b82f6",
        customClass: { popup: "rounded-2xl shadow-xl border border-gray-100" },
      });
      return;
    }

    try {
      Swal.fire({
        title: "Sending test...",
        text: `Dispatching telegram message to ${userName}`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await apiService.sendInstantTelegramTest(userId);

      Swal.fire({
        icon: "success",
        title: "Sent Successfully!",
        text: res.message,
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: "rounded-2xl shadow-xl border border-gray-100" },
      });
    } catch (err) {
      console.error("Failed to send test telegram", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Could not send test message.",
        confirmButtonColor: "#ef4444",
        customClass: { popup: "rounded-2xl shadow-xl border border-gray-100" },
      });
    }
  };

  if (loading) {
    return <div className="p-8 text-xs text-gray-500">Loading system settings...</div>;
  }

  return (
    <div className="p-8 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">System Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage user-level automations, telegram alerts, and future workspace configurations.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <span>🤖</span> User Telegram Reminder Controls
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Turn automated daily evening reminder alerts ON or OFF individually for each account.
          </p>
        </div>

        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
                <th className="p-3.5">User Account</th>
                <th className="p-3.5">Telegram Status</th>
                <th className="p-3.5 text-right">Automated Alerts & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-gray-900">{user.name}</div>
                    <div className="text-[11px] text-gray-400">{user.email}</div>
                  </td>
                  <td className="p-3.5">
                    {user.telegram_chat_id ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Linked (ID: {user.telegram_chat_id})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Not Connected
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="inline-flex items-center gap-3 justify-end">
                      {/* Instant Test Send Button */}
                      <button
                        onClick={() => handleTestSend(user.id, user.name, user.telegram_chat_id)}
                        title="Send Instant Test Reminder"
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 shadow-sm"
                      >
                        <span>🚀</span> Direct Send
                      </button>

                      <div className="flex items-center gap-2 border-l pl-3 border-gray-200">
                        <span className="text-[11px] text-gray-500 font-medium">
                          {user.telegram_notifications_enabled ? "Active" : "Disabled"}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={user.telegram_notifications_enabled}
                            onChange={() => handleToggleUser(user.id, user.telegram_notifications_enabled)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};