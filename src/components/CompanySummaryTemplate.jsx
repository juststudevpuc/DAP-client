import { forwardRef } from "react";

export const CompanySummaryTemplate = forwardRef(({ summaryData, year, month, weekNumber, notes, onNotesChange }, ref) => {
  const summary = summaryData?.summary;
  
  const calculateDateRange = (y, m, w) => {
    try {
      const startDayNum = (w - 1) * 7 + 1;
      const startDate = new Date(y, m - 1, startDayNum);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 5);
      const formatDate = (date) => {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
      };
      return `${formatDate(startDate)} to ${formatDate(endDate)}`;
    } catch {
      return "15/09/2026 to 20/09/2026";
    }
  };

  const dynamicDateRange = calculateDateRange(year, month, weekNumber);

  // 💡 Guaranteed target defaults (90, 81, 81)
  const apiTrainingTarget = Number(summary?.targets?.training);
  const apiOnboardingTarget = Number(summary?.targets?.onboarding);
  const apiGraduatedTarget = Number(summary?.targets?.graduated);

  const targets = {
    training: apiTrainingTarget > 0 ? apiTrainingTarget : 90,
    onboarding: apiOnboardingTarget > 0 ? apiOnboardingTarget : 81,
    graduated: apiGraduatedTarget > 0 ? apiGraduatedTarget : 81,
  };

  const actuals = summary?.actuals || { training: 0, onboarding: 0, graduated: 0, delays_cancels: 0 };
  
  const trainingPercent = targets.training > 0 ? ((actuals.training / targets.training) * 100).toFixed(0) : 0;
  const onboardingPercent = targets.onboarding > 0 ? ((actuals.onboarding / targets.onboarding) * 100).toFixed(0) : 0;
  const graduatedPercent = targets.graduated > 0 ? ((actuals.graduated / targets.graduated) * 100).toFixed(0) : 0;

  const modules = summaryData?.category_totals || { company_info: 34, system_analysis: 17, hr_policy: 30, lesson_path: 102 };
  const gradBreakdown = summaryData?.graduation_breakdown || { certificate: 15, hr_policy: 15, book: 15 };

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
        .khmer-text { font-family: 'Battambang', 'Khmer OS Battambang', 'Noto Sans Khmer', sans-serif; }
        .meta-underline { text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
        .two-line-input {
          background-image: linear-gradient(to bottom, transparent 95%, #2f5fdd 95%);
          background-size: 100% 28px;
          line-height: 28px;
          border: none;
          outline: none;
          resize: none;
          width: 100%;
          font-size: 12px;
          color: #000;
        }
        @media print {
          body { background: #fff; }
          .bilingual-doc { width: 297mm; height: 210mm; padding: 15mm 20mm; box-shadow: none; }
        }
      `}</style>

      <div ref={ref} className="bilingual-doc shadow-md relative text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-[160px] flex items-center gap-2">
              <img
            src="/checkinme-logo.jpg"
            alt="Hero Banner"
            className="w-6 h-6"
          />
              <div>
                <div className="flex items-center gap-0.5 font-black text-blue-900 text-sm tracking-tight">
                  CheckInMe<span className="text-[9px] text-blue-600 align-super">®</span>
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
            <div><span className="text-gray-800">Team: </span><span className="font-bold meta-underline">វិជ្ជាជីវៈបណ្តុះបណ្តាលព័ន្ធ</span></div>
            <div><span className="text-gray-800">Date: </span><span className="font-bold meta-underline">{dynamicDateRange}</span></div>
            <div><span className="text-gray-800">Week/សប្តាហ៍: </span><span className="font-bold meta-underline">{weekNumber}</span></div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div><span className="text-gray-800">ប្រកាស Completed Training : </span><span className="font-bold meta-underline">{targets.training}</span></div>
            <div><span className="text-gray-800">Success Onboarding Session : </span><span className="font-bold meta-underline">{targets.onboarding}</span></div>
            <div><span className="text-gray-800">Graduated : </span><span className="font-bold meta-underline">{targets.graduated}</span></div>
          </div>
        </div>

        <div className="text-sm font-bold text-gray-900 mt-6 mb-4">
          Last week summary / សេចក្តីសង្ខេបលទ្ធផលពីសប្តាហ៍មុន
        </div>

        <ol className="list-decimal pl-12 space-y-4 text-xs font-normal">
          <li>
            <div className="flex items-baseline gap-1">
              <span>ប្រកាស Training/ បានបញ្ចប់:</span>
              <span className="font-bold ml-1">{actuals.training}</span>
              <span className="font-bold">({trainingPercent}%)</span>
            </div>
            <div className="pl-6 mt-0.5">Postpone Training: <span className="font-bold">{actuals.delays_cancels}</span></div>
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

        {/* 2-Line Textareas */}
        <div className="mt-8 space-y-5">
          <div className="space-y-1">
            <div className="font-normal text-gray-900">
              What's <span className="font-bold meta-underline">worked</span> ? / អ្វីដែលអាចធ្វើទៅរួច:
            </div>
            <textarea
              rows={2}
              value={notes?.what_worked || ""}
              onChange={(e) => onNotesChange("what_worked", e.target.value)}
              placeholder="Type notes for what worked..."
              className="two-line-input px-1"
            />
          </div>

          <div className="space-y-1">
            <div className="font-normal text-gray-900">
              What didn't <span className="font-bold meta-underline">work</span> ? / អ្វីដែលមិនទាន់ធ្វើទៅរួច:
            </div>
            <textarea
              rows={2}
              value={notes?.what_didnt_work || ""}
              onChange={(e) => onNotesChange("what_didnt_work", e.target.value)}
              placeholder="Type notes for what didn't work..."
              className="two-line-input px-1"
            />
          </div>

          <div className="space-y-1">
            <div className="font-normal text-gray-900">
              What's <span className="font-bold meta-underline">improvement</span> ? / អ្វីដែលត្រូវច្នៃប្រឌិតបន្ថែម:
            </div>
            <textarea
              rows={2}
              value={notes?.what_to_improve || ""}
              onChange={(e) => onNotesChange("what_to_improve", e.target.value)}
              placeholder="Type improvements..."
              className="two-line-input px-1"
            />
          </div>

          <div className="space-y-1">
            <div className="font-normal text-gray-900">
              What's <span className="font-bold meta-underline">next</span> ? / ចុះអ្វីដែលត្រូវធ្វើបន្តទៀត:
            </div>
            <textarea
              rows={2}
              value={notes?.what_is_next || ""}
              onChange={(e) => onNotesChange("what_is_next", e.target.value)}
              placeholder="Type next actions..."
              className="two-line-input px-1"
            />
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 text-center text-[#8a8a8a] text-xs">
          1
        </div>

      </div>
    </div>
  );
});

CompanySummaryTemplate.displayName = "CompanySummaryTemplate";