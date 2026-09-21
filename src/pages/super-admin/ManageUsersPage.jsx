import { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import useAuthStore from "../../store/useAuthStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { RingLoader } from "react-spinners";

export const ManageUsersPage = () => {
  const currentUser = useAuthStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔑 State for Password Reset Modal
  const [resetModalUser, setResetModalUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAllUsers();
      setUsers(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Failed to load users", error);
      Swal.fire({
        icon: "error",
        title: "Load Failed",
        text: "Failed to load staff directory. Please check your connection.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- ROLE CHANGE HANDLER ---
  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser?.id && newRole !== "super_admin") {
      Swal.fire({
        icon: "warning",
        title: "Action Denied",
        text: "You cannot revoke your own Super Admin role.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    setUpdatingId(userId);
    try {
      await apiService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Role updated successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Failed to update role", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Failed to change role.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // --- RESET PASSWORD HANDLER ---
  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Mismatch",
        text: "Passwords do not match. Please re-enter.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (newPassword.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Password must be at least 8 characters long.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    setIsResetting(true);
    try {
      const response = await apiService.resetUserPasswordByAdmin(resetModalUser.id, {
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Password Reset!",
        text: response.message || `Password successfully updated for ${resetModalUser.name}.`,
        confirmButtonColor: "#2563eb",
      });

      setResetModalUser(null);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to reset password", error);
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: error.response?.data?.message || "Failed to reset user password.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsResetting(false);
    }
  };

  // --- DELETE USER HANDLER ---
  const handleDeleteUser = async (userId, userName) => {
    if (userId === currentUser?.id) {
      Swal.fire({
        icon: "warning",
        title: "Action Denied",
        text: "You cannot delete your own account while logged in.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to delete user "${userName}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete user!",
    });

    if (!result.isConfirmed) return;

    setDeletingId(userId);
    try {
      await apiService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "User deleted successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Failed to delete user", error);
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.response?.data?.message || "Failed to delete user.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
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
            Assign workspace roles, permission levels, reset passwords, or remove team members.
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
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RingLoader color="#22d3ee" size={40} />
                      <span className="text-gray-400 font-medium text-sm">
                        Loading users directory...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
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
                          onChange={(e) =>
                            handleRoleChange(item.id, e.target.value)
                          }
                          className="h-8 text-xs border border-gray-300 rounded px-2 bg-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="user">User (Standard)</option>
                          <option value="admin">Admin (Team Lead)</option>
                          <option value="super_admin">
                            Super Admin (Full Access)
                          </option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-center space-x-2">
                        {/* 🔑 Reset Password Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setResetModalUser(item)}
                          className="h-7 px-2.5 text-[11px] border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          🔑 Reset Pass
                        </Button>

                        {/* 🗑️ Delete Button */}
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isCurrent || deletingId === item.id}
                          onClick={() => handleDeleteUser(item.id, item.name)}
                          className="h-7 px-2.5 text-[11px] bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {deletingId === item.id ? "Deleting..." : "🗑️ Delete"}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 🔑 RESET PASSWORD MODAL POPUP */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Reset Password for <span className="text-blue-600">{resetModalUser.name}</span>
              </h3>
              <button 
                onClick={() => setResetModalUser(null)} 
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordResetSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="At least 8 characters"
                  className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter new password"
                  className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  disabled={isResetting}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm"
                >
                  {isResetting ? "Updating..." : "Save New Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};