import { create } from 'zustand';

// Safely try to parse the user from local storage
const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

const useAuthStore = create((set) => ({
  // Initialize state by checking localStorage for BOTH token and user
  user: getStoredUser(),
  token: localStorage.getItem('token') || null,

  // Call this when the user successfully logs in or registers
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // 🚨 Save user to hard drive
    set({ user, token });
  },

  // Call this when the user logs out 
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // 🚨 Clear user from hard drive
    set({ user: null, token: null });
  },
}));

export default useAuthStore;