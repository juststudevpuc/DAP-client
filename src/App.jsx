import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WeeklyPlanDashboard } from "./pages/WeeklyPlanDashboard";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Landing } from "./pages/LandingPage";
import "./App.css";

// Placeholder for your general Dashboard overview page
const MainDashboard = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
    <p className="text-sm text-gray-500 mt-1">Welcome back to your CheckinMe workspace.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Protected Routes with Sidebar Layout --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<MainDashboard />} />
            <Route path="/weekly-plan" element={<WeeklyPlanDashboard />} />
          </Route>
        </Route>

        {/* --- Fallback Route --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}