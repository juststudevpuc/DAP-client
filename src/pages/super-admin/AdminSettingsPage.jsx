import React, { useState, useEffect, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import { apiService } from "../../services/api";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "linked", label: "Linked" },
  { key: "unlinked", label: "Not connected" },
  { key: "active", label: "Alerts on" },
  { key: "disabled", label: "Alerts off" },
];

const AVATAR_PALETTE = [
  { ring: "ring-indigo-200", bg: "bg-indigo-50", text: "text-indigo-600" },
  { ring: "ring-violet-200", bg: "bg-violet-50", text: "text-violet-600" },
  { ring: "ring-teal-200", bg: "bg-teal-50", text: "text-teal-700" },
  { ring: "ring-amber-200", bg: "bg-amber-50", text: "text-amber-700" },
  { ring: "ring-rose-200", bg: "bg-rose-50", text: "text-rose-600" },
  { ring: "ring-sky-200", bg: "bg-sky-50", text: "text-sky-700" },
];

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "?";

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

const getAvatarColors = (id) => AVATAR_PALETTE[Math.abs(hashCode(String(id))) % AVATAR_PALETTE.length];

const swalStyle = { customClass: { popup: "rounded-2xl shadow-xl border border-gray-100" } };

/* ---------- icons ---------- */

const IconSearch = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <circle cx="9" cy="9" r="6.2" />
    <path d="M17 17l-3.8-3.8" strokeLinecap="round" />
  </svg>
);
const IconCopy = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <rect x="7.2" y="7.2" width="9.3" height="9.3" rx="1.8" />
    <path d="M4.5 12.5V5.3A1.8 1.8 0 0 1 6.3 3.5h7.2" strokeLinecap="round" />
  </svg>
);
const IconCheck = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M4 10.5l3.8 3.8L16 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconSend = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
    <path d="M17 3L2.5 9.2l5.6 2.2M17 3l-5.7 14-3.2-5.6M17 3L8.1 11.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconUsers = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <circle cx="7" cy="6.5" r="2.6" />
    <path d="M2 16c0-2.9 2.2-4.7 5-4.7s5 1.8 5 4.7" strokeLinecap="round" />
    <path d="M12.6 4.3a2.6 2.6 0 0 1 0 4.9M14.8 16c0-2.4-1.5-4-3.4-4.6" strokeLinecap="round" />
  </svg>
);
const IconLink = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
    <path d="M8.3 11.7a3 3 0 0 0 4.3.2l2-2a3 3 0 0 0-4.2-4.2l-1 1" strokeLinecap="round" />
    <path d="M11.7 8.3a3 3 0 0 0-4.3-.2l-2 2a3 3 0 0 0 4.2 4.2l1-1" strokeLinecap="round" />
  </svg>
);
const IconLinkOff = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
    <path d="M8.3 11.7a3 3 0 0 0 4.3.2l1.2-1.2M11.7 8.3a3 3 0 0 0-4.3-.2l-1.2 1.2" strokeLinecap="round" />
    <path d="M4 4l12 12" strokeLinecap="round" />
  </svg>
);
const IconChevronUpDown = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M6 8l4-4 4 4M6 12l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconBell = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M10 3.5c-2.2 0-3.7 1.7-3.7 4v2.1c0 .6-.2 1.1-.6 1.6l-.9 1.1c-.4.5 0 1.2.7 1.2h9c.7 0 1.1-.7.7-1.2l-.9-1.1c-.4-.5-.6-1-.6-1.6V7.5c0-2.3-1.5-4-3.7-4Z" strokeLinejoin="round" />
    <path d="M8.3 15.5a1.8 1.8 0 0 0 3.4 0" strokeLinecap="round" />
  </svg>
);

/* ---------- building blocks ---------- */

const StatChip = ({ icon, value, label, tone }) => (
  <div className="flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-gray-50/60 px-3.5 py-2.5">
    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${tone.bg} ${tone.text}`}>
      {icon}
    </div>
    <div className="leading-tight">
      <div className="text-base font-extrabold tabular-nums text-gray-900">{value}</div>
      <div className="text-[11px] font-medium text-gray-400">{label}</div>
    </div>
  </div>
);

const StatusTag = ({ linked, chatId }) =>
  linked ? (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/70 bg-emerald-50 py-1 pl-2 pr-2.5 text-[11px] font-semibold text-emerald-700">
      <IconLink className="h-3 w-3" />
      <span className="font-mono tracking-tight text-emerald-800">{chatId}</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 py-1 pl-2 pr-2.5 text-[11px] font-semibold text-gray-400">
      <IconLinkOff className="h-3 w-3" />
      Not connected
    </span>
  );

const Toggle = ({ checked, onChange }) => (
  <label className="relative inline-flex cursor-pointer items-center">
    <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
    <div className="h-6 w-10 rounded-full bg-gray-200 shadow-inner transition-colors duration-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:shadow-sm after:transition-all after:duration-200 after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-300 peer-focus-visible:ring-offset-2" />
  </label>
);

const TestSendButton = ({ pending, onClick }) => (
  <button
    onClick={onClick}
    disabled={pending}
    title="Send instant test reminder"
    className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-500 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <IconSend className="h-3 w-3" />
    {pending ? "Sending…" : "Test send"}
  </button>
);

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gray-100" />
        <div className="space-y-1.5">
          <div className="h-3 w-28 rounded bg-gray-100" />
          <div className="h-2.5 w-36 rounded bg-gray-100" />
        </div>
      </div>
    </td>
    <td className="px-5 py-4">
      <div className="h-5 w-28 rounded-lg bg-gray-100" />
    </td>
    <td className="px-5 py-4 text-right">
      <div className="ml-auto h-5 w-40 rounded bg-gray-100" />
    </td>
  </tr>
);

const SkeletonCard = () => (
  <div className="animate-pulse space-y-3 rounded-2xl border border-gray-100 p-4">
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-full bg-gray-100" />
      <div className="space-y-1.5">
        <div className="h-3 w-28 rounded bg-gray-100" />
        <div className="h-2.5 w-36 rounded bg-gray-100" />
      </div>
    </div>
    <div className="h-5 w-28 rounded-lg bg-gray-100" />
  </div>
);

const EmptyState = ({ hasQuery, onClear }) => (
  <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-300">
      <IconUsers className="h-5 w-5" />
    </div>
    <p className="text-sm font-semibold text-gray-700">
      {hasQuery ? "No users match your search" : "No users to show here"}
    </p>
    <p className="text-xs text-gray-400">
      {hasQuery ? "Try a different name, email, or filter." : "Users will appear here once they're added."}
    </p>
    {hasQuery && (
      <button onClick={onClear} className="mt-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
        Clear search
      </button>
    )}
  </div>
);

/* ---------- User Settings Modal Component ---------- */
const UserSettingsModal = ({ user, isOpen, onClose, onSaved }) => {
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setTelegramEnabled(user.telegram_notifications_enabled === 1 || user.telegram_notifications_enabled === true);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.toggleUserTelegramNotification(user.id, {
        telegram_notifications_enabled: telegramEnabled ? 1 : 0
      });

      if (response.success || response) {
        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: `Settings updated successfully for ${user.name}.`,
          timer: 1500,
          showConfirmButton: false,
          ...swalStyle
        });
        onSaved(); 
        onClose(); 
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to save settings.',
        ...swalStyle
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Account Settings</h3>
            <p className="text-xs text-gray-500">{user.name} ({user.email})</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSave} className="py-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <span className="font-medium text-gray-800 block text-xs">Telegram Daily Reminders</span>
              <span className="text-[11px] text-gray-400">Automatically ping user on Telegram if metrics are missing.</span>
            </div>
            <Toggle 
              checked={telegramEnabled} 
              onChange={(e) => setTelegramEnabled(e.target.checked)} 
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------- main page ---------- */

export const AdminSettingsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortAsc, setSortAsc] = useState(true);
  const [sendingId, setSendingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getSystemSettings();
      setUsers(response.users || response.data || response);
    } catch (err) {
      console.error("Failed to load system settings data", err);
      Swal.fire({
        icon: "error",
        title: "Couldn't load settings",
        text: "We weren't able to load user data. Please refresh the page.",
        confirmButtonColor: "#ef4444",
        ...swalStyle,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestSend = useCallback(async (userId, userName, hasChatId) => {
    if (!hasChatId) {
      Swal.fire({
        icon: "warning",
        title: "Not connected",
        text: `${userName} hasn't linked a Telegram chat ID yet.`,
        confirmButtonColor: "#4f46e5",
        ...swalStyle,
      });
      return;
    }
    setSendingId(userId);
    try {
      const res = await apiService.sendInstantTelegramTest(userId);
      Swal.fire({
        icon: "success",
        title: "Sent",
        text: res.message,
        timer: 2000,
        showConfirmButton: false,
        ...swalStyle,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Could not send test message.",
        confirmButtonColor: "#ef4444",
        ...swalStyle,
      });
    } finally {
      setSendingId(null);
    }
  }, []);

  const handleCopyChatId = useCallback((userId, chatId) => {
    navigator.clipboard?.writeText(String(chatId)).then(() => {
      setCopiedId(userId);
      setTimeout(() => setCopiedId((id) => (id === userId ? null : id)), 1500);
    });
  }, []);

  const openSettingsModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const totalUsers = users.length;
  const activeCount = users.filter((u) => u.telegram_notifications_enabled).length;
  const linkedCount = users.filter((u) => u.telegram_chat_id).length;

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = users.filter((u) => {
      const matchesQuery = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      const matchesFilter =
        filter === "all" ||
        (filter === "linked" && !!u.telegram_chat_id) ||
        (filter === "unlinked" && !u.telegram_chat_id) ||
        (filter === "active" && !!u.telegram_notifications_enabled) ||
        (filter === "disabled" && !u.telegram_notifications_enabled);
      return matchesQuery && matchesFilter;
    });
    return [...list].sort((a, b) => {
      const cmp = (a.name || "").localeCompare(b.name || "");
      return sortAsc ? cmp : -cmp;
    });
  }, [users, query, filter, sortAsc]);

  const hasQuery = !!query || filter !== "all";
  const clearFilters = () => {
    setQuery("");
    setFilter("all");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-gray-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">System settings</h1>
          <p className="mt-1 text-xs text-gray-500">
            Manage user-level automations, live Telegram alerts, and workspace configuration.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:flex sm:gap-3">
          <StatChip icon={<IconUsers className="h-4 w-4" />} value={totalUsers} label="users" tone={{ bg: "bg-gray-100", text: "text-gray-600" }} />
          <StatChip icon={<IconLink className="h-4 w-4" />} value={linkedCount} label="linked" tone={{ bg: "bg-emerald-50", text: "text-emerald-600" }} />
          <StatChip icon={<IconBell className="h-4 w-4" />} value={activeCount} label="alerts on" tone={{ bg: "bg-indigo-50", text: "text-indigo-600" }} />
        </div>
      </div>

      {/* Main panel */}
      <div className="space-y-5 rounded-3xl border border-gray-100/80 bg-white p-5 shadow-sm md:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Telegram reminder controls</h3>
            <p className="mt-0.5 text-xs text-gray-400">
              Turn the automated daily evening reminder on or off for each account.
            </p>
          </div>

          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or email"
              className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-xs text-gray-700 placeholder:text-gray-300 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 sm:w-64"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-1 rounded-xl bg-gray-50 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                filter === f.key ? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-2xl border border-gray-100 md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 font-bold uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3.5">
                    <button
                      onClick={() => setSortAsc((v) => !v)}
                      className="flex items-center gap-1 normal-case tracking-normal text-gray-400 hover:text-gray-600"
                    >
                      User
                      <IconChevronUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-5 py-3.5">Telegram status</th>
                  <th className="px-5 py-3.5 text-right">Alerts &amp; actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <EmptyState hasQuery={hasQuery} onClear={clearFilters} />
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const colors = getAvatarColors(user.id);
                    const isEnabled = user.telegram_notifications_enabled;
                    return (
                      <tr key={user.id} className="group transition-colors hover:bg-gray-50/60">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ring-1 ${colors.bg} ${colors.text} ${colors.ring}`}
                            >
                              {getInitials(user.name)}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-bold text-gray-900">{user.name}</div>
                              <div className="truncate text-[11px] text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <StatusTag linked={!!user.telegram_chat_id} chatId={user.telegram_chat_id} />
                            {user.telegram_chat_id && (
                              <button
                                onClick={() => handleCopyChatId(user.id, user.telegram_chat_id)}
                                title="Copy chat ID"
                                className="rounded-md p-1 text-gray-300 opacity-0 transition-opacity hover:text-gray-500 group-hover:opacity-100"
                              >
                                {copiedId === user.id ? (
                                  <IconCheck className="h-3.5 w-3.5 text-emerald-600" />
                                ) : (
                                  <IconCopy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-3">
                            {/* Settings Button */}
                            <button
                              onClick={() => openSettingsModal(user)}
                              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                            >
                              ⚙️ Settings
                            </button>

                            <TestSendButton
                              pending={sendingId === user.id}
                              onClick={() => handleTestSend(user.id, user.name, user.telegram_chat_id)}
                            />

                            <div className="border-l border-gray-200/60 pl-3 flex items-center gap-2">
                              <span className={`text-[11px] font-semibold ${isEnabled ? "text-indigo-600" : "text-gray-400"}`}>
                                {isEnabled ? "Active" : "Disabled"}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="space-y-2.5 md:hidden">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-2xl border border-gray-100">
              <EmptyState hasQuery={hasQuery} onClear={clearFilters} />
            </div>
          ) : (
            filteredUsers.map((user) => {
              const colors = getAvatarColors(user.id);
              const isEnabled = user.telegram_notifications_enabled;
              return (
                <div key={user.id} className="rounded-2xl border border-gray-100 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ring-1 ${colors.bg} ${colors.text} ${colors.ring}`}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-bold text-gray-900">{user.name}</div>
                        <div className="truncate text-[11px] text-gray-400">{user.email}</div>
                      </div>
                    </div>
                    <span className={`text-[11px] font-semibold ${isEnabled ? "text-indigo-600" : "text-gray-400"}`}>
                      {isEnabled ? "Active" : "Disabled"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
                    <StatusTag linked={!!user.telegram_chat_id} chatId={user.telegram_chat_id} />
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openSettingsModal(user)}
                        className="px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                      >
                        ⚙️ Settings
                      </button>
                      <TestSendButton
                        pending={sendingId === user.id}
                        onClick={() => handleTestSend(user.id, user.name, user.telegram_chat_id)}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!loading && filteredUsers.length > 0 && (
          <p className="text-[11px] text-gray-400">
            Showing {filteredUsers.length} of {totalUsers} users
          </p>
        )}
      </div>

      {/* Settings Modal Integration */}
      <UserSettingsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchSettingsData}
      />
    </div>
  );
};