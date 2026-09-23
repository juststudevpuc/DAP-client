import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuthStore from "../../store/useAuthStore";
import { apiService } from "../../services/api";
import Swal from "sweetalert2";

export const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  // Role permissions
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isSuperAdmin = user?.role === "super_admin";

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your DAP session.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, log out",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout failed on server", error);
    } finally {
      logout();
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-0 -translate-x-full"
      } bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out z-20 print:hidden overflow-hidden shadow-sm`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-200">
            C
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 tracking-tight">
              SOLVE
            </h1>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              Workspace
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          Menu
        </div>

        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all relative group ${
            isActive("/dashboard")
              ? "bg-blue-50/80 text-blue-600 font-semibold"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          {isActive("/dashboard") && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-600 rounded-r-full" />
          )}
          <svg
            className={`w-4 h-4 ${isActive("/dashboard") ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="9"></rect>
            <rect x="14" y="3" width="7" height="5"></rect>
            <rect x="14" y="12" width="7" height="9"></rect>
            <rect x="3" y="16" width="7" height="5"></rect>
          </svg>
          Dashboard Overview
        </Link>

        <Link
          to="/weekly-plan"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all relative group ${
            isActive("/weekly-plan")
              ? "bg-blue-50/80 text-blue-600 font-semibold"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          {isActive("/weekly-plan") && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-600 rounded-r-full" />
          )}
          <svg
            className={`w-4 h-4 ${isActive("/weekly-plan") ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Weekly Action Plan
        </Link>

        {/* Admin & Super Admin Section */}
        {isAdmin && (
          <div className="pt-4 mt-3 border-t border-gray-100">
            <div className="px-3 pb-2 text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
              Admin Controls
            </div>

            <Link
              to="/admin/team-overview"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all relative group ${
                isActive("/admin/team-overview")
                  ? "bg-blue-50/80 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {isActive("/admin/team-overview") && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-600 rounded-r-full" />
              )}
              <svg
                className={`w-4 h-4 ${isActive("/admin/team-overview") ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Team Overview
            </Link>

            <Link
              to="/admin/company-summary"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all relative group ${
                isActive("/admin/company-summary")
                  ? "bg-blue-50/80 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {isActive("/admin/company-summary") && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-600 rounded-r-full" />
              )}
              <svg
                className={`w-4 h-4 ${isActive("/admin/company-summary") ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              Company Summary
            </Link>
          </div>
        )}

        {/* Super Admin Exclusive Section */}
        {isSuperAdmin && (
          <div className="pt-4 mt-3 border-t border-gray-100">
            <div className="px-3 pb-2 text-[10px] font-semibold text-purple-600 uppercase tracking-wider">
              Super Admin
            </div>

            <Link
              to="/super-admin/manage-users"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all relative group ${
                isActive("/super-admin/manage-users")
                  ? "bg-purple-50/80 text-purple-700 font-semibold"
                  : "text-gray-600 hover:bg-purple-50/40 hover:text-purple-700"
              }`}
            >
              {isActive("/super-admin/manage-users") && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-purple-600 rounded-r-full" />
              )}
              <svg
                className={`w-4 h-4 ${isActive("/super-admin/manage-users") ? "text-purple-600" : "text-gray-400 group-hover:text-purple-600"}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Manage Roles & Staff
            </Link>

            {/* 💡 NEW: System Settings Link for Super Admin */}
            <Link
              to="/admin/settings"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all relative group mt-1 ${
                isActive("/admin/settings")
                  ? "bg-purple-50/80 text-purple-700 font-semibold"
                  : "text-gray-600 hover:bg-purple-50/40 hover:text-purple-700"
              }`}
            >
              {isActive("/admin/settings") && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-purple-600 rounded-r-full" />
              )}
              <svg
                className={`w-4 h-4 ${isActive("/admin/settings") ? "text-purple-600" : "text-gray-400 group-hover:text-purple-600"}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              System Settings
            </Link>
          </div>
        )}
      </nav>

      {/* User Profile & Role Badge */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-gray-800 truncate">
                {user?.name || "Workspace User"}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded leading-none ${
                  user?.role === "super_admin"
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : user?.role === "admin"
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                {user?.role ? user.role.replace("_", " ") : "member"}
              </span>
              <p className="text-[10px] text-gray-400 truncate">
                {user?.email || "Connected"}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full h-8 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 justify-start gap-2 font-medium"
        >
          <svg
            className="w-3.5 h-3.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Sign Out
        </Button>
      </div>
    </aside>
  );
};