import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, BarChart3, ArrowRight, Building2 } from "lucide-react";
import { apiService } from "@/services/api"; // Import the centralized service

export function Portfolio() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const data = await apiService.getPublicStats();

        if (data.success) {
          setTotalUsers(data.total_users);
        }
      } catch (error) {
        console.error("Failed to fetch real user stats", error);
        setTotalUsers(0); // Fallback if request fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
            Our <span className="text-blue-600">Impact</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            See how organizations are transforming their daily routines,
            ditching the paperwork, and accelerating their team's productivity.
          </p>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Target Metric: Real Database Users */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-8 text-center shadow-sm">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                Active Users
              </h3>
              <div className="text-4xl font-extrabold text-slate-900">
                {isLoading ? (
                  <span className="animate-pulse text-slate-300">...</span>
                ) : (
                  totalUsers.toLocaleString()
                )}
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Professionals using our platform
              </p>
            </div>

            {/* Organizations Metric */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center shadow-sm">
              <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-2">
                Organizations
              </h3>
              <div className="text-4xl font-extrabold text-slate-900">
                {isLoading ? (
                  <span className="animate-pulse text-slate-300">...</span>
                ) : (
                  "1"
                )}
              </div>
              <p className="text-sm text-slate-500 mt-2">Companies onboarded</p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase / Portfolio Items */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Success Stories
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group rounded-2xl border border-slate-200 bg-white p-8 transition hover:border-blue-200 hover:shadow-lg">
              <BarChart3 className="h-8 w-8 text-blue-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Tech Startup Inc.
              </h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Replaced cumbersome Excel spreadsheets with our platform,
                reducing manager review time by 4 hours per week while giving
                developers clear daily goals.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-blue-600">
                Read case study{" "}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-8 transition hover:border-blue-200 hover:shadow-lg">
              <BarChart3 className="h-8 w-8 text-emerald-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Global Marketing Agency
              </h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Streamlined remote team tracking. Admins now receive automated
                Telegram notifications when a daily action plan is submitted or
                completed.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-emerald-600">
                Read case study{" "}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 text-center">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white transition hover:bg-slate-800 shadow-xl"
        >
          Join {isLoading ? "..." : totalUsers.toLocaleString()} other users
          today
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>
    </main>
  );
}