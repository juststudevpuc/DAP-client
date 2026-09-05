import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

export const ProtectedRoute = () => {
  // Check the global store to see if a token exists
  const token = useAuthStore((state) => state.token);

  // If there is no token, instantly redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If they have a token, render whatever component is nested inside (Outlet)
  return <Outlet />;
};