import { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import useAuthStore from "../../store/useAuthStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { RingLoader } from "react-spinners";

const ROLE_STYLES = {
  super_admin: { badge: "bg-violet-50 text-violet-700 border-violet-200", dot: "bg-violet-500" },
  admin: { badge: "bg-indigo-50 text-indigo-700 border-indigo-200", dot: "bg-indigo-500" },
  user: { badge: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400" },
};

const AVATAR_PALETTE = [
  { ring: "ring-indigo-200", bg: "bg-indigo-50", text: "text-indigo-600" },
  { ring: "ring-violet-200", bg: "bg-violet-50", text: "text-violet-600" },
  { ring: "ring-teal-200", bg: "bg-teal-50", text: "text-teal-700" },
  { ring: "ring-amber-200", bg: "bg-amber-50", text: "text-amber-700" },
  { ring: "ring-rose-200", bg: "bg-rose-50", text: "text-rose-600" },
  { ring: "ring-sky-200", bg: "bg-sky-50", text: "text-sky-700" },
];

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
const getAvatarColors = (id) => AVATAR_PALETTE[Math.abs(hashCode(String(id))) % AVATAR_PALETTE.length];
const roleStyle = (role) => ROLE_STYLES[role] || ROLE_STYLES.user;

/* ---------- icons ---------- */

const IconSearch = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <circle cx="9" cy="9" r="6.2" />
    <path d="M17 17l-3.8-3.8" strokeLinecap="round" />
  </svg>
);
const IconRefresh = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
    <path d="M16 5.5v3.3h-3.3M4 14.5v-3.3h3.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 9.2a5.3 5.3 0 0 1 9-3M15 10.8a5.3 5.3 0 0 1-9 3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconKey = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
    <circle cx="7" cy="13" r="3" />
    <path d="M9.1 10.9 15 5l1.2 1.2M13.4 6.6l1.6 1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconTrash = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
    <path d="M4.5 6h11M8 6V4.6c0-.5.4-.9.9-.9h2.2c.5 0 .9.4.9.9V6M6.3 6l.5 9c.05.9.8 1.6 1.7 1.6h3c.9 0 1.65-.7 1.7-1.6l.5-9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconClose = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9" {...props}>
    <path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" />
  </svg>
);
const IconUsers = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <circle cx="7" cy="6.5" r="2.6" />
    <path d="M2 16c0-2.9 2.2-4.7 5-4.7s5 1.8 5 4.7" strokeLinecap="round" />
    <path d="M12.6 4.3a2.6 2.6 0 0 1 0 4.9M14.8 16c0-2.4-1.5-4-3.4-4.6" strokeLinecap="round" />
  </svg>
);
const IconShield = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M10 3l6 2.2v4.3c0 4-2.6 6.6-6 7.5-3.4-.9-6-3.5-6-7.5V5.2L10 3Z" strokeLinejoin="round" />
    <path d="M7.6 10l1.7 1.7 3.1-3.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconEye = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10Z" strokeLinejoin="round" />
    <circle cx="10" cy="10" r="2.3" />
  </svg>
);
const IconEyeOff = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M2.8 2.8l14.4 14.4M8.3 8.5a2.3 2.3 0 0 0 3.2 3.2M5.6 5.7C3.3 7 1.5 10 1.5 10s3 5.5 8.5 5.5c1.4 0 2.6-.35 3.7-.9M11.9 4.7A9 9 0 0 1 18.5 10s-.7 1.3-2 2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RoleBadge = ({ role }) => {
  const s = roleStyle(role);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {role ? role.replace("_", " ") : "user"}
    </span>
  );
};

const Avatar = ({ id, name }) => {
  const c = getAvatarColors(id);
  return (
    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-1 ${c.bg} ${c.text} ${c.ring}`}>
      {name?.charAt(0).toUpperCase() || "U"}
    </div>
  );
};

export const ManageUsersPage = () => {
  const currentUser = useAuthStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // 🔑 State for Password Reset Modal
  const [resetModalUser, setResetModalUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        confirmButtonColor: "#4f46e5",
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

  // --- CONFIRM BEFORE ROLE CHANGE ---
  // Role edits are hard to notice after the fact, so anything that grants or
  // removes admin-level access gets a confirmation step before it's applied.
  const handleRoleSelect = async (item, newRole) => {
    if (newRole === item.role) return;

    const isEscalation = newRole !== "user";
    if (isEscalation) {
      const result = await Swal.fire({
        title: "Change this user's role?",
        text: `${item.name} will become ${newRole.replace("_", " ")} and gain their permissions immediately.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4f46e5",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, change role",
      });
      if (!result.isConfirmed) return;
    }
    handleRoleChange(item.id, newRole);
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchesRole = roleFilter === "all" || (u.role || "user") === roleFilter;
    return matchesQuery && matchesRole;
  });

  const superAdminCount = users.filter((u) => u.role === "super_admin").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="mx-auto max-w-[1200px] p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-5 border-b border-gray-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Staff &amp; role management</h1>
          <p className="mt-1 text-xs text-gray-500">
            Assign workspace roles, reset passwords, or remove team members.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-right">
          <div className="flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-gray-50/60 px-3.5 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
              <IconUsers className="h-4 w-4" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-base font-extrabold tabular-nums text-gray-900">{users.length}</div>
              <div className="text-[11px] font-medium text-gray-400">staff</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-gray-50/60 px-3.5 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <IconShield className="h-4 w-4" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-base font-extrabold tabular-nums text-gray-900">{superAdminCount + adminCount}</div>
              <div className="text-[11px] font-medium text-gray-400">admins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            placeholder="Search member or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 sm:w-72"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          disabled={loading}
          className="h-9 w-fit gap-1.5 text-xs text-gray-600"
        >
          <IconRefresh className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Role filter */}
      <div className="mb-4 flex flex-wrap items-center gap-1 rounded-xl bg-gray-50 p-1">
        {[
          { key: "all", label: "All" },
          { key: "user", label: "User" },
          { key: "admin", label: "Admin" },
          { key: "super_admin", label: "Super admin" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setRoleFilter(f.key)}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              roleFilter === f.key ? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <Card className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Current role</th>
                <th className="px-5 py-3.5 text-center">Change permission</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-14">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RingLoader color="#4f46e5" size={36} />
                      <span className="text-sm font-medium text-gray-400">Loading users directory…</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                        <IconUsers className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">No matching users found</p>
                      <p className="text-xs text-gray-400">Try a different name or email.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((item) => {
                  const isCurrent = item.id === currentUser?.id;
                  return (
                    <tr key={item.id} className="transition-colors hover:bg-gray-50/60">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar id={item.id} name={item.name} />
                          <div className="flex items-center gap-1.5 font-bold text-gray-900">
                            {item.name}
                            {isCurrent && (
                              <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{item.email}</td>
                      <td className="px-5 py-3.5">
                        <RoleBadge role={item.role} />
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <select
                          value={item.role || "user"}
                          disabled={updatingId === item.id || isCurrent}
                          onChange={(e) => handleRoleSelect(item, e.target.value)}
                          className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="user">User (Standard)</option>
                          <option value="admin">Admin (Team Lead)</option>
                          <option value="super_admin">Super Admin (Full Access)</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setResetModalUser(item)}
                            title="Reset password"
                            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-500 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <IconKey className="h-3.5 w-3.5" />
                            Reset
                          </button>
                          <button
                            disabled={isCurrent || deletingId === item.id}
                            onClick={() => handleDeleteUser(item.id, item.name)}
                            title="Delete user"
                            className="flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-2.5 py-1.5 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <IconTrash className="h-3.5 w-3.5" />
                            {deletingId === item.id ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile cards */}
      <div className="space-y-2.5 md:hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 py-14">
            <RingLoader color="#4f46e5" size={36} />
            <span className="text-sm font-medium text-gray-400">Loading users directory…</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-100 px-6 py-14 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-300">
              <IconUsers className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-gray-700">No matching users found</p>
            <p className="text-xs text-gray-400">Try a different name or email.</p>
          </div>
        ) : (
          filteredUsers.map((item) => {
            const isCurrent = item.id === currentUser?.id;
            return (
              <div key={item.id} className="rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar id={item.id} name={item.name} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 truncate font-bold text-gray-900">
                        {item.name}
                        {isCurrent && (
                          <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">You</span>
                        )}
                      </div>
                      <div className="truncate text-[11px] text-gray-400">{item.email}</div>
                    </div>
                  </div>
                  <RoleBadge role={item.role} />
                </div>

                <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
                  <select
                    value={item.role || "user"}
                    disabled={updatingId === item.id || isCurrent}
                    onChange={(e) => handleRoleSelect(item, e.target.value)}
                    className="h-8 flex-1 rounded-lg border border-gray-200 bg-white px-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="user">User (Standard)</option>
                    <option value="admin">Admin (Team Lead)</option>
                    <option value="super_admin">Super Admin (Full Access)</option>
                  </select>
                  <button
                    onClick={() => setResetModalUser(item)}
                    title="Reset password"
                    className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <IconKey className="h-3.5 w-3.5" />
                  </button>
                  <button
                    disabled={isCurrent || deletingId === item.id}
                    onClick={() => handleDeleteUser(item.id, item.name)}
                    title="Delete user"
                    className="flex items-center justify-center rounded-lg border border-red-100 bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 🔑 RESET PASSWORD MODAL POPUP */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Reset password</h3>
                <p className="mt-0.5 text-xs text-gray-400">
                  for <span className="font-semibold text-indigo-600">{resetModalUser.name}</span>
                </p>
              </div>
              <button
                onClick={() => setResetModalUser(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handlePasswordResetSubmit} className="space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-bold text-gray-700">New password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 8 characters"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 pr-9 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                  </button>
                </div>
                {newPassword.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="flex h-1 flex-1 gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className={`h-full flex-1 rounded-full ${
                            i < passwordStrength(newPassword) ? strengthColor(passwordStrength(newPassword)) : "bg-gray-100"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400">{strengthLabel(passwordStrength(newPassword))}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block font-bold text-gray-700">Confirm new password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter new password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  disabled={isResetting}
                  className="rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isResetting ? "Updating…" : "Save new password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};