import { forwardRef } from "react";

export const CompanySummaryTemplate = forwardRef(({ summaryData, year, month, weekNumber, notes, onNotesChange }, ref) => {
  const summary = summaryData?.summary;
  
  const targets = summary?.targets || { training: 90, onboarding: 81, graduated: 81 };
  const actuals = summary?.actuals || { training: 46, onboarding: 12, graduated: 15, delays_cancels: 0 };
  
  const trainingPercent = targets.training > 0 ? ((actuals.training / targets.training) * 100).toFixed(2) : 0;
  const onboardingPercent = targets.onboarding > 0 ? ((actuals.onboarding / targets.onboarding) * 100).toFixed(2) : 0;
  const graduatedPercent = targets.graduated > 0 ? ((actuals.graduated / targets.graduated) * 100).toFixed(2) : 0;

  const modules = summaryData?.category_totals || {
    company_info: 34,
    system_analysis: 17,
    hr_policy: 30,
    lesson_path: 102,
  };

  const gradBreakdown = summaryData?.graduation_breakdown || {
    certificate: 15,
    hr_policy: 15,
    book: 15,
  };

  return (
    <div className="w-full bg-white flex justify-center py-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Inter:wght@400;600;700&display=swap');
        
        .bilingual-doc {
          font-family: 'Inter', 'Battambang', 'Khmer OS Battambang', 'Noto Sans Khmer', sans-serif;
          line-height: 1.9;
          color: #000;
          background: #fff;
          width: 297mm;
          min-height: 210mm;
          padding: 20mm 25mm;
          box-sizing: border-box;
        }

        .khmer-text {
          font-family: 'Battambang', 'Khmer OS Battambang', 'Noto Sans Khmer', sans-serif;
        }

        .meta-underline {
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1px;
        }

        .fill-line {
          border-bottom: 1px solid #2f5fdd;
          height: 24px;
          flex-grow: 1;
          display: inline-block;
        }

        @media print {
          body {
            background: #fff;
          }
          .bilingual-doc {
            width: 297mm;
            height: 210mm;
            padding: 15mm 20mm;
            box-shadow: none;
          }
        }
      `}</style>

      {/* A4 Landscape Document Container */}
      <div ref={ref} className="bilingual-doc shadow-md relative text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-[160px] flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold shadow-2xs">
                <span>
                    <img src="/checkinme-logo.jpg" alt="CheckInMe Logo" className="w-full h-full object-contain" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-0.5 font-black text-blue-900 text-sm tracking-tight">
                  CheckInMe<span className="text-[9px] text-blue-600 align-super"></span>
                </div>
                <div className="text-[8px] text-gray-500 font-semibold tracking-tighter uppercase -mt-1">Automate Workplace</div>
              </div>
            </div>
          </div>

          <div className="text-center flex-1">
            <h1 className="text-sm font-bold text-gray-900 tracking-tight">
              Weekly Action Plan <span className="font-normal khmer-text text-xs text-gray-800 ml-1">ផែនការសកម្មភាពប្រចាំសប្ដាហ៍</span>
            </h1>
          </div>

          <div className="w-[160px]"></div>
        </div>

        {/* Meta Block */}
        <div className="space-y-3 mb-6 text-xs">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <span className="font-normal text-gray-800">Team: </span>
              <span className="font-bold meta-underline">វិជ្ជាជីវៈបណ្តុះបណ្តាលព័ន្ធ</span>
            </div>
            <div>
              <span className="font-normal text-gray-800">Date: </span>
              <span className="font-bold meta-underline">31/08/2026 to 05/09/2026</span>
            </div>
            <div>
              <span className="font-normal text-gray-800">Week/សប្តាហ៍: </span>
              <span className="font-bold meta-underline">{weekNumber}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <span className="font-normal text-gray-800">ប្រកាស Completed Training: </span>
              <span className="font-bold meta-underline">{targets.training}</span>
            </div>
            <div>
              <span className="font-normal text-gray-800">Success Onboarding Session: </span>
              <span className="font-bold meta-underline">{targets.onboarding}</span>
            </div>
            <div>
              <span className="font-normal text-gray-800">Graduated: </span>
              <span className="font-bold meta-underline">{targets.graduated}</span>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-sm font-bold text-gray-900 mt-6 mb-4">
          Last week summary / សេចក្តីសង្ខេបលទ្ធផលពីសប្តាហ៍មុន
        </div>

        {/* Numbered List */}
        <ol className="list-decimal pl-12 space-y-4 text-xs font-normal">
          <li>
            <div className="flex items-baseline gap-1">
              <span>ប្រកាស Training/ បានបញ្ចប់:</span>
              <span className="font-bold ml-1">{actuals.training}</span>
              <span className="font-bold">({trainingPercent}%)</span>
            </div>
            <div className="pl-6 mt-0.5">
              Postpone Training: <span className="font-bold">{actuals.delays_cancels}</span>
            </div>
          </li>

          <li>
            <div className="flex items-baseline gap-1">
              <span>ប្រកាស Completed Success Onboarding Session/ បានបញ្ចប់:</span>
              <span className="font-bold ml-1">{actuals.onboarding}</span>
              <span className="font-bold">({onboardingPercent}%)</span>
            </div>
            <div className="pl-6 mt-0.5 flex flex-wrap gap-x-1 text-gray-800">
              <span>Company's information:</span>
              <span className="font-bold meta-underline text-blue-700">{modules.company_info}</span>,
              <span className="ml-1">System Analysis:</span>
              <span className="font-bold meta-underline text-blue-700">{modules.system_analysis}</span>,
              <span className="ml-1">Configure HR Policy:</span>
              <span className="font-bold meta-underline text-blue-700">{modules.hr_policy}</span>,
              <span className="ml-1">Provide Lesson(Path):</span>
              <span className="font-bold meta-underline text-blue-700">{modules.lesson_path}</span>
            </div>
          </li>

          <li>
            <div className="flex items-baseline gap-1">
              <span>ប្រកាស Customer Graduated/ បានបញ្ចប់:</span>
              <span className="font-bold ml-1">{actuals.graduated}</span>
              <span className="font-bold">({graduatedPercent}%)</span>
            </div>
            <div className="pl-6 mt-0.5 flex flex-wrap gap-x-1 text-gray-800">
              <span>Provided</span>
              <span className="font-bold meta-underline text-blue-700">Certificate:</span>
              <span className="font-bold">{gradBreakdown.certificate}</span>,
              <span className="ml-1">Provided HR</span>
              <span className="font-bold meta-underline text-blue-700">Policy:</span>
              <span className="font-bold">{gradBreakdown.hr_policy}</span>,
              <span className="ml-1">Provided Book:</span>
              <span className="font-bold">{gradBreakdown.book}</span>
            </div>
          </li>
        </ol>

        {/* Fill-in lines */}
        <div className="mt-8 space-y-5">
          <div className="flex items-center gap-2">
            <span className="font-normal text-gray-900 whitespace-nowrap">
              What's <span className="font-bold meta-underline">worked</span> ? / អ្វីដែលអាចធ្វើទៅរួច:
            </span>
            <input
              type="text"
              value={notes?.what_worked || ""}
              onChange={(e) => onNotesChange("what_worked", e.target.value)}
              className="fill-line bg-transparent border-0 border-b border-[#2f5fdd] focus:outline-none px-2 text-xs font-normal text-black"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-normal text-gray-900 whitespace-nowrap">
              What didn't <span className="font-bold meta-underline">work</span> ? / អ្វីដែលមិនទាន់ធ្វើទៅរួច:
            </span>
            <input
              type="text"
              value={notes?.what_didnt_work || ""}
              onChange={(e) => onNotesChange("what_didnt_work", e.target.value)}
              className="fill-line bg-transparent border-0 border-b border-[#2f5fdd] focus:outline-none px-2 text-xs font-normal text-black"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-normal text-gray-900 whitespace-nowrap">
              What's <span className="font-bold meta-underline">improvement</span> ? / អ្វីដែលត្រូវច្នៃប្រឌិតបន្ថែម:
            </span>
            <input
              type="text"
              value={notes?.what_to_improve || ""}
              onChange={(e) => onNotesChange("what_to_improve", e.target.value)}
              className="fill-line bg-transparent border-0 border-b border-[#2f5fdd] focus:outline-none px-2 text-xs font-normal text-black"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-normal text-gray-900 whitespace-nowrap">
              What's <span className="font-bold meta-underline">next</span> ? / ចុះអ្វីដែលត្រូវធ្វើបន្តទៀត:
            </span>
            <input
              type="text"
              value={notes?.what_is_next || ""}
              onChange={(e) => onNotesChange("what_is_next", e.target.value)}
              className="fill-line bg-transparent border-0 border-b border-[#2f5fdd] focus:outline-none px-2 text-xs font-normal text-black"
            />
          </div>
        </div>

        {/* Page number */}
        <div className="absolute bottom-6 left-0 right-0 text-center text-[#8a8a8a] text-xs">
          1
        </div>

      </div>
    </div>
  );
});

CompanySummaryTemplate.displayName = "CompanySummaryTemplate";