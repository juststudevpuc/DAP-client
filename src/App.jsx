import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WeeklyPlanDashboard } from "./pages/WeeklyPlanDashboard";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Landing } from "./pages/LandingPage";
import { ManageUsersPage } from "./pages/super-admin/ManageUsersPage";
import { CompanySummaryDashboard } from "./pages/admin/CompanySummaryDashboard";
import { TeamOverviewDashboard } from "./pages/admin/TeamOverviewDashboard";
import "./App.css";
import { AboutUs } from "./pages/About-us-Page";

// IMPORT YOUR NEW LAYOUT HERE
import { LandingLayout } from "./components/layout/LandingLayout"; 
import { Portfolio } from "./pages/PortfolioPage";
import { ContactUs } from "./pages/Contact-us-Page";
import { AdminSettingsPage } from "./pages/super-admin/AdminSettingsPage";
import Dashboard from "./pages/Dashboard";

// Placeholder Pages (Replace with dedicated component files when ready)


export default function App() {
  return (
    <BrowserRouter>
      {/* Remove the element prop from here */}
      <Routes>
        
        {/* --- Public Landing Routes (Has Navbar & Footer) --- */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<ContactUs />} />
        </Route>

        {/* --- Auth Routes (No Navbar - Clean Screen) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Authenticated Routes (All Logged-in Users) --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/weekly-plan" element={<WeeklyPlanDashboard />} />

            {/* --- Admin & Super Admin Shared Routes --- */}
            <Route element={<AdminRoute />}>
              <Route
                path="/admin/team-overview"
                element={<TeamOverviewDashboard />}
              />
              <Route
                path="/admin/company-summary"
                element={<CompanySummaryDashboard />}
              />
            </Route>

            {/* --- Super Admin Exclusive Routes --- */}
            <Route element={<AdminRoute requireSuperAdmin={true} />}>
              <Route
                path="/super-admin/manage-users"
                element={<ManageUsersPage />}
              />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
            </Route>
          </Route>
        </Route>

        {/* --- Fallback Route --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}