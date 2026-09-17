import { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import useAuthStore from "../../store/useAuthStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ManageUsersPage = () => {
  const currentUser = useAuthStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAllUsers();
      setUsers(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Failed to load users", error);
      alert("❌ Failed to load staff directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser?.id && newRole !== "super_admin") {
      alert("⚠️ You cannot revoke your own Super Admin role.");
      return;
    }

    setUpdatingId(userId);
    try {
      await apiService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      alert("✅ Role updated successfully!");
    } catch (error) {
      console.error("Failed to update role", error);
      alert(error.response?.data?.message || "❌ Failed to change role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Staff & Role Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Assign workspace roles and permission levels to team members.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search member or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 px-3 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-64 bg-white"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={loading}
            className="h-9 text-xs"
          >
            🔄 Refresh
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Current Role</th>
                <th className="py-3 px-4 text-center">Change Permission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    Loading users directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    No matching users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((item) => {
                  const isCurrent = item.id === currentUser?.id;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3 px-4 font-medium text-gray-800 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-xs">
                          {item.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <span>{item.name}</span>
                          {isCurrent && (
                            <span className="ml-2 text-[10px] text-blue-600 font-normal">
                              (You)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{item.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                            item.role === "super_admin"
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : item.role === "admin"
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {item.role ? item.role.replace("_", " ") : "user"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <select
                          value={item.role || "user"}
                          disabled={updatingId === item.id || isCurrent}
                          onChange={(e) => handleRoleChange(item.id, e.target.value)}
                          className="h-8 text-xs border border-gray-300 rounded px-2 bg-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="user">User (Standard)</option>
                          <option value="admin">Admin (Team Lead)</option>
                          <option value="super_admin">Super Admin (Full Access)</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};