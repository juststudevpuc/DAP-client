import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuthStore from "../../store/useAuthStore";
import { apiService } from "../../services/api";

export const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  // Get current user details from store if available
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
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
            T
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 tracking-tight">Trainer</h1>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Workspace</p>
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
          <svg className={`w-4 h-4 ${isActive("/dashboard") ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <svg className={`w-4 h-4 ${isActive("/weekly-plan") ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Weekly Action Plan
        </Link>
      </nav>

      {/* Footer / User Profile snippet & Sign Out */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xs font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-gray-800 truncate">{user?.name || "Workspace User"}</p>
            <p className="text-[10px] text-gray-400 truncate">{user?.email || "Connected"}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full h-8 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 justify-start gap-2 font-medium"
        >
          <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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