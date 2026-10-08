import { forwardRef } from "react";

export const CompanySummaryTemplate = forwardRef(
  ({ summaryData, year, month, weekNumber, notes, onNotesChange }, ref) => {
    const summary = summaryData?.summary;
    const members = summaryData?.members || []; // 👈 ទាញយកបញ្ជីឈ្មោះ User ពី Backend

    const calculateDateRange = (y, m, w) => {
      if (summaryData?.date_range?.start && summaryData?.date_range?.end) {
        const formatDateStr = (dStr) => {
          const d = new Date(dStr);
          const dd = String(d.getDate()).padStart(2, "0");
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const yyyy = d.getFullYear();
          return `${dd}/${mm}/${yyyy}`;
        };
        return `${formatDateStr(summaryData.date_range.start)} to ${formatDateStr(summaryData.date_range.end)}`;
      }

      if (m === "all") return `Entire Year of ${y}`;
      if (w === "all")
        return `Entire Month of ${String(m).padStart(2, "0")}/${y}`;

      try {
        const yearNum = Number(y);
        const monthNum = Number(m);

        const firstOfMonth = new Date(yearNum, monthNum - 1, 1);

        if (firstOfMonth.getDay() === 0) {
          firstOfMonth.setDate(2);
        }

        const dayOfWeek = firstOfMonth.getDay();
        const diffToMonday = 1 - dayOfWeek;
        const week1Monday = new Date(firstOfMonth);
        week1Monday.setDate(firstOfMonth.getDate() + diffToMonday);

        const targetMonday = new Date(week1Monday);
        targetMonday.setDate(week1Monday.getDate() + (Number(w) - 1) * 7);

        const targetSunday = new Date(targetMonday);
        targetSunday.setDate(targetMonday.getDate() + 6);

        const formatDate = (date) => {
          const dd = String(date.getDate()).padStart(2, "0");
          const mm = String(date.getMonth() + 1).padStart(2, "0");
          const yyyy = date.getFullYear();
          return `${dd}/${mm}/${yyyy}`;
        };
        return `${formatDate(targetMonday)} to ${formatDate(targetSunday)}`;
      } catch {
        return "N/A";
      }
    };

    const dynamicDateRange = calculateDateRange(year, month, weekNumber);

    const apiTrainingTarget = Number(summary?.targets?.training);
    const apiOnboardingTarget = Number(summary?.targets?.onboarding);
    const apiGraduatedTarget = Number(summary?.targets?.graduated);

    const targets = {
      training: apiTrainingTarget > 0 ? apiTrainingTarget : 90,
      onboarding: apiOnboardingTarget > 0 ? apiOnboardingTarget : 81,
      graduated: apiGraduatedTarget > 0 ? apiGraduatedTarget : 81,
    };

    const actuals = summary?.actuals || {
      training: 0,
      onboarding: 0,
      graduated: 0,
      delays_cancels: 0,
    };

    // 1. Define the breakdown variables FIRST
    const catTotals = summary?.category_totals || {};
    const modules = {
      company_info: catTotals["Company Information"] || 0,
      system_analysis: catTotals["System Analysis"] || 0,
      hr_policy: catTotals["Configure HR Policy"] || 0,
      lesson_path: catTotals["Provide Lesson (Path)"] || 0,
    };

    const gradData = summary?.graduation_breakdown || {};
    const gradBreakdown = {
      certificate: gradData.certificate || 0,
      hr_policy: gradData.hr_policy || 0,
      book: gradData.book || 0,
    };

    // 2. NOW calculate the percentages using those variables
    const trainingPercent =
      targets.training > 0
        ? ((actuals.training / targets.training) * 100).toFixed(0)
        : 0;

    const onboardingPercent =
      targets.onboarding > 0
        ? ((actuals.onboarding / targets.onboarding) * 100).toFixed(0)
        : 0;

    const graduatedCount = gradBreakdown.certificate;

    const graduatedPercent =
      targets.graduated > 0
        ? ((graduatedCount / targets.graduated) * 100).toFixed(0)
        : 0;

    // 💡 ថ្មី៖ Hover Tooltip Component សម្រាប់បង្ហាញទិន្នន័យ User ពេលដាក់ Mouse ពីលើ
    const HoverTooltip = ({ total, dataKey, subKey }) => {
      // ស្វែងរក User ណាដែលមានទិន្នន័យធំជាង ០ សម្រាប់ជួរនេះ
      const activeMembers = members.filter((m) => {
        if (dataKey === "actual_training") return m.actual_training > 0;
        if (dataKey === "delays_cancels") return m.delays_cancels > 0;
        if (dataKey === "actual_onboarding") return m.actual_onboarding > 0;
        if (dataKey === "actual_graduated") return m.actual_graduated > 0;
        if (dataKey === "category_totals")
          return m.category_totals?.[subKey] > 0;
        if (dataKey === "graduation_breakdown")
          return m.graduation_breakdown?.[subKey] > 0;
        return false;
      });

      if (activeMembers.length === 0 || total === 0) {
        return <span className="font-bold">{total}</span>;
      }

      return (
        <div className="relative group inline-block cursor-help ml-1">
          <span className="font-bold border-b border-dashed border-blue-400 text-blue-700 pb-[1px]">
            {total}
          </span>

          {/* Tooltip Popup (ប្រើ print:hidden ដើម្បីកុំឱ្យលេចចេញពេល Print ជា PDF) */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col min-w-[160px] max-w-[250px] bg-gray-900 text-white text-[11px] font-sans rounded p-2 z-50 print:hidden shadow-xl">
            <div className="font-bold border-b border-gray-700 pb-1 mb-1 text-center text-gray-300">
              Staff Contributions
            </div>
            {activeMembers.map((m) => {
              let val = 0;
              if (dataKey === "actual_training") val = m.actual_training;
              else if (dataKey === "delays_cancels") val = m.delays_cancels;
              else if (dataKey === "actual_onboarding")
                val = m.actual_onboarding;
              else if (dataKey === "actual_graduated") val = m.actual_graduated;
              else if (dataKey === "category_totals")
                val = m.category_totals?.[subKey];
              else if (dataKey === "graduation_breakdown")
                val = m.graduation_breakdown?.[subKey];

              return (
                <div
                  key={m.user_id}
                  className="flex justify-between items-center py-0.5 gap-4"
                >
                  <span className="truncate">{m.user_name}</span>
                  <span className="font-bold text-blue-300">{val}</span>
                </div>
              );
            })}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      );
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
                    CheckInMe
                    <span className="text-[9px] text-blue-600 align-super">
                      ®
                    </span>
                  </div>
                  <div className="text-[8px] text-gray-500 font-semibold tracking-tighter uppercase -mt-1">
                    Automate Workplace
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center flex-1">
              <h1 className="text-sm font-bold text-gray-900 tracking-tight">
                Weekly Action Plan{" "}
                <span className="font-normal khmer-text text-xs text-gray-800 ml-1">
                  ផែនការសកម្មភាពប្រចាំសប្ដាហ៍
                </span>
              </h1>
            </div>
            <div className="w-[160px]"></div>
          </div>

          {/* Meta Block */}
          <div className="space-y-3 mb-6 text-xs">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <span className="text-gray-800">Team: </span>
                <span className="font-bold meta-underline">
                  វិជ្ជាជីវៈបណ្តុះបណ្តាលព័ន្ធ
                </span>
              </div>
              <div>
                <span className="text-gray-800">Date: </span>
                <span className="font-bold meta-underline">
                  {dynamicDateRange}
                </span>
              </div>
              <div>
                <span className="text-gray-800">Week/សប្តាហ៍: </span>
                <span className="font-bold meta-underline">
                  {weekNumber === "all" ? "Total/សរុប" : weekNumber}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <span className="text-gray-800">
                  ប្រកាស Completed Training :{" "}
                </span>
                <span className="font-bold meta-underline">
                  {targets.training}
                </span>
              </div>
              <div>
                <span className="text-gray-800">
                  Success Onboarding Session :{" "}
                </span>
                <span className="font-bold meta-underline">
                  {targets.onboarding}
                </span>
              </div>
              <div>
                <span className="text-gray-800">Graduated : </span>
                <span className="font-bold meta-underline">
                  {targets.graduated}
                </span>
              </div>
            </div>
          </div>

          <div className="text-sm font-bold text-gray-900 mt-6 mb-4">
            Last week summary / សេចក្តីសង្ខេបលទ្ធផលពីសប្តាហ៍មុន
          </div>

          <ol className="list-decimal pl-12 space-y-4 text-xs font-normal">
            <li>
              <div className="flex items-baseline gap-1">
                <span>ប្រកាស Training/ បានបញ្ចប់:</span>
                <HoverTooltip
                  total={actuals.training}
                  dataKey="actual_training"
                />
                <span className="font-bold ml-1">({trainingPercent}%)</span>
              </div>
              <div className="pl-6 mt-0.5 flex items-baseline">
                Postpone Training:
                <HoverTooltip
                  total={actuals.delays_cancels}
                  dataKey="delays_cancels"
                />
              </div>
            </li>

            <li>
              <div className="flex items-baseline gap-1">
                <span>
                  ប្រកាស Completed Success Onboarding Session/ បានបញ្ចប់:
                </span>
                <HoverTooltip
                  total={actuals.onboarding}
                  dataKey="actual_onboarding"
                />
                <span className="font-bold ml-1">({onboardingPercent}%)</span>
              </div>
              <div className="pl-6 mt-0.5 flex flex-wrap gap-x-1 items-baseline text-gray-800">
                <span>Company's information:</span>
                <HoverTooltip
                  total={modules.company_info}
                  dataKey="category_totals"
                  subKey="company_info"
                />
                ,<span className="ml-1">System Analysis:</span>
                <HoverTooltip
                  total={modules.system_analysis}
                  dataKey="category_totals"
                  subKey="system_analysis"
                />
                ,<span className="ml-1">Configure HR Policy:</span>
                <HoverTooltip
                  total={modules.hr_policy}
                  dataKey="category_totals"
                  subKey="hr_policy"
                />
                ,<span className="ml-1">Provide Lesson(Path):</span>
                <HoverTooltip
                  total={modules.lesson_path}
                  dataKey="category_totals"
                  subKey="lesson_path"
                />
              </div>
            </li>

            <li>
              <div className="flex items-baseline gap-1">
                <span>ប្រកាស Customer Graduated/ បានបញ្ចប់:</span>
                <HoverTooltip
                  total={gradBreakdown.certificate}
                  dataKey="graduation_breakdown"
                  subKey="certificate"
                />
                <span className="font-bold ml-1">({graduatedPercent}%)</span>
              </div>
              <div className="pl-6 mt-0.5 flex flex-wrap gap-x-1 items-baseline text-gray-800">
                <span>Provided</span>
                <span className="font-bold meta-underline text-blue-700 ml-1">
                  Certificate:
                </span>
                <HoverTooltip
                  total={gradBreakdown.certificate}
                  dataKey="graduation_breakdown"
                  subKey="certificate"
                />
                ,<span className="ml-1">Provided HR</span>
                <span className="font-bold meta-underline text-blue-700 ml-1">
                  Policy:
                </span>
                <HoverTooltip
                  total={gradBreakdown.hr_policy}
                  dataKey="graduation_breakdown"
                  subKey="hr_policy"
                />
                ,<span className="ml-1">Provided Book:</span>
                <HoverTooltip
                  total={gradBreakdown.book}
                  dataKey="graduation_breakdown"
                  subKey="book"
                />
              </div>
            </li>
          </ol>

          {/* 2-Line Textareas */}
          <div className="mt-8 space-y-5">
            <div className="space-y-1">
              <div className="font-normal text-gray-900">
                What's <span className="font-bold meta-underline">worked</span>{" "}
                ? / អ្វីដែលអាចធ្វើទៅរួច:
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
                What didn't{" "}
                <span className="font-bold meta-underline">work</span> ? /
                អ្វីដែលមិនទាន់ធ្វើទៅរួច:
              </div>
              <textarea
                rows={2}
                value={notes?.what_didnt_work || ""}
                onChange={(e) =>
                  onNotesChange("what_didnt_work", e.target.value)
                }
                placeholder="Type notes for what didn't work..."
                className="two-line-input px-1"
              />
            </div>

            <div className="space-y-1">
              <div className="font-normal text-gray-900">
                What's{" "}
                <span className="font-bold meta-underline">improvement</span> ?
                / អ្វីដែលត្រូវច្នៃប្រឌិតបន្ថែម:
              </div>
              <textarea
                rows={2}
                value={notes?.what_to_improve || ""}
                onChange={(e) =>
                  onNotesChange("what_to_improve", e.target.value)
                }
                placeholder="Type improvements..."
                className="two-line-input px-1"
              />
            </div>

            <div className="space-y-1">
              <div className="font-normal text-gray-900">
                What's <span className="font-bold meta-underline">next</span> ?
                / ចុះអ្វីដែលត្រូវធ្វើបន្តទៀត:
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
  },
);

CompanySummaryTemplate.displayName = "CompanySummaryTemplate";
