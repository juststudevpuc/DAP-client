import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WeeklyPlanDashboard } from './pages/WeeklyPlanDashboard';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Protected Routes --- */}
        <Route element={<ProtectedRoute />}>
          
          {/* Your main dashboard is now protected! */}
          <Route path="/weekly-plan" element={<WeeklyPlanDashboard />} />
          
          {/* If they visit the root domain, send them to the dashboard */}
          <Route path="/" element={<Navigate to="/weekly-plan" replace />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}