import { Outlet, useLocation, Link } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";
import { NavBarLandingPage } from "./NavBarLandingPage";

export function LandingLayout() {
  // 1. Get the current URL path
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Global Navbar */}
      <NavBarLandingPage />

      {/* Dynamic Page Content Wrapper */}
      <div className="flex-grow overflow-hidden">
        {/* 2. Wrap Outlet with motion.div and set the key to the current path */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </div>

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-bold">SOLVE</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 Trainer Platform. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
            <Link to="/contact" className="hover:text-slate-900">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}