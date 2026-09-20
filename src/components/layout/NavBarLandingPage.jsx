import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function NavBarLandingPage() {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          <span className="text-xl font-bold tracking-tight">SOLVE</span>
        </motion.div>
        
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/aboutUs" className="hover:text-blue-600 transition">About Us</Link>
          <Link to="/portfolio" className="hover:text-blue-600 transition">Portfolio</Link>
          <Link to="/contact" className="hover:text-blue-600 transition">Contact us</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
          >
            Sign In
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register"
              className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 md:block shadow-md"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}