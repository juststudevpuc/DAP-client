import { Mail, MapPin } from "lucide-react";

export function ContactUs() {
  return (
    <main className="pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about integrating the platform with your team? Need
            technical support? We are here to help you solve it.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto space-y-8">
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Contact Information
              </h2>
              <p className="text-slate-600 mb-8">
                Reach out to us directly through any of these channels. We
                typically respond within 24 hours.
              </p>
            </div>

            {/* Centered Contact Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-8">
              
              {/* Email Section */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Email Developers
                  </h3>
                  <div className="mt-1 space-y-1">
                    <a
                      href="mailto:teppanhasak.22nd@gmail.com"
                      className="block text-sm text-slate-600 hover:text-blue-600 hover:underline transition-colors"
                    >
                      teppanhasak.22nd@gmail.com
                    </a>
                    <a
                      href="mailto:chinnzztheking09@gmail.com"
                      className="block text-sm text-slate-600 hover:text-blue-600 hover:underline transition-colors"
                    >
                      chinnzztheking09@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Telegram Section */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                  {/* Custom Telegram SVG Icon */}
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .34z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Telegram Direct
                  </h3>
                  <div className="mt-1 space-y-1">
                    <a
                      href="https://t.me/tep_panhasak"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-slate-600 hover:text-sky-600 hover:underline transition-colors"
                    >
                      @tep_panhasak
                    </a>
                    <a
                      href="https://t.me/chin111"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-slate-600 hover:text-sky-600 hover:underline transition-colors"
                    >
                      @chin111
                    </a>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Fastest response time
                  </p>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Location Section */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Location
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Phnom Penh, Cambodia
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}