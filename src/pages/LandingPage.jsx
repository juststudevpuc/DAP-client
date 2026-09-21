import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  FileQuestionMark,
  Zap,
  Users, // Added for the user count badge
} from "lucide-react";
import { apiService } from "@/services/api"; // Make sure this path matches your setup

export function Landing() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the public user count when the landing page loads
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const data = await apiService.getPublicStats();
        if (data.success) {
          setTotalUsers(data.total_users);
        }
      } catch (error) {
        console.error("Failed to fetch real user stats", error);
        setTotalUsers(0); // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
              Master your team's{" "}
              <span className="text-blue-600">daily actions</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              The all-in-one platform for tracking attendance, organizing
              training systems, and accelerating team accountability without
              the micromanagement.
            </p>
            
            <div className="flex flex-col items-center justify-center">
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-600/20"
              >
                Start for free
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              {/* Trust Badge with Live User Count */}
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                <Users className="h-4 w-4 text-blue-600" />
                <span>
                  Join {isLoading ? "..." : totalUsers.toLocaleString()} professionals already using SOLVE
                </span>
              </div>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="mt-16 sm:mt-24 relative mx-auto max-w-5xl">
            <div className="rounded-2xl border border-slate-200 bg-white/50 p-2 shadow-2xl backdrop-blur-sm sm:p-4">
              <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50 aspect-video flex items-center justify-center relative">
                <img
                  src="/image1.jpg"
                  alt="CheckinMe Dashboard"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-sm border border-slate-100 flex items-center gap-3">
                  <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500 font-medium">Daily Goal</p>
                    <p className="text-sm font-bold text-slate-900">100% Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to scale
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Built specifically for modern teams that want less friction and more focus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 shadow-blue-300">
            {[
              {
                icon: Zap,
                title: "Action Planning",
                desc: "Turn training modules into actionable daily tasks with real-time progress tracking.",
              },
              {
                icon: FileQuestionMark,
                title: "What's Next? ",
                desc: "Catch me if you can baby",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-8 transition hover:border-blue-100 hover:shadow-md"
              >
                <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
            Ready to transform your workflow?
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Join {isLoading ? "hundreds of" : totalUsers.toLocaleString()} forward-thinking professionals using SOLVE to track, train, and succeed together.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-blue-600 transition hover:bg-blue-50 hover:scale-105 active:scale-95 shadow-xl"
          >
            Get Started for Free
          </Link>
        </div>
      </section>
    </main>
  );
}