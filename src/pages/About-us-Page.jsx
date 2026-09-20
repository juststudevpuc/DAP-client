import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Target, Code2 } from "lucide-react";

export function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <main>
        {/* Hero / Mission Section */}
        <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mx-auto max-w-3xl">
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
                Redefining the{" "}
                <span className="text-blue-600">Daily Action Plan</span>
              </h1>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Our mission is simple: to solve the problems of traditional,
                manual tracking. We are replacing outdated paper routines with a
                seamless digital experience that empowers both employees and
                management.
              </p>
            </div>
          </div>
        </section>

        {/* The Solution / App Info Grid */}
        <section className="py-16 bg-white border-y border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Why we built this platform
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                A purpose-built solution to bridge the gap between daily tasks
                and weekly goals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 shadow-blue-300">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 transition hover:border-blue-100 hover:shadow-md">
                <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                  <Leaf className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Going Digital & Green
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  We are significantly reducing the use of paper in the
                  workplace. By moving daily action notes to a digital platform,
                  teams stay organized without the clutter and waste of
                  traditional manual methods.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 transition hover:border-blue-100 hover:shadow-md">
                <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Effortless KPI Tracking
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Users can easily type up what they accomplished today, while
                  admins get a bird's-eye view to track their team's
                  performance. It makes evaluating weekly KPIs transparent,
                  fast, and highly accurate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Meet the Developers
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                The fullstack engineers behind the platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-8 max-w-3xl mx-auto">
              {/* Tep Panhasak */}
              <div className="flex-1 rounded-2xl bg-white border border-slate-200 p-8 text-center shadow-sm hover:shadow-md transition">
                <div className="mx-auto h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                  <Code2 className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Tep Panhasak
                </h3>
                <p className="text-blue-600 font-medium text-sm mt-1">
                  Fullstack Developer
                </p>
              </div>

              {/* Sokheng */}
              <div className="flex-1 rounded-2xl bg-white border border-slate-200 p-8 text-center shadow-sm hover:shadow-md transition">
                <div className="mx-auto h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                  <Code2 className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Sokheng</h3>
                <p className="text-blue-600 font-medium text-sm mt-1">
                  Fullstack Developer
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600" />
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
              Ready to ditch the paperwork?
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Join us in transforming how your team logs their daily actions and
              tracks weekly KPIs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-blue-600 transition hover:bg-blue-50 hover:scale-105 active:scale-95 shadow-xl"
              >
                Get Started for Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-blue-200/30 bg-blue-700/30 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-700/50"
              >
                Contact our Team
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
