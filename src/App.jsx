import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WeeklyPlanDashboard } from './pages/WeeklyPlanDashboard';
import './App.css';

// 1. Change 'export const App' to 'export default function App'
export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WeeklyPlanDashboard />} />
        </Routes>
      </BrowserRouter>
  );
}