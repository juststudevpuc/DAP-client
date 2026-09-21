import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { apiService } from "../../services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompanySummaryTemplate } from "../../components/CompanySummaryTemplate";
import { RingLoader } from "react-spinners";
import Swal from "sweetalert2";

export const CompanySummaryDashboard = () => {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(9);
  const [weekNumber, setWeekNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [notes, setNotes] = useState({
    what_worked: "",
    what_didnt_work: "",
    what_to_improve: "",
    what_is_next: "",
  });

  const templateRef = useRef(null);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await apiService.getCompanySummary({ year, month, week_number: weekNumber });
      setData(res);
      
      // Pre-fill notes from backend response if available
      if (res?.notes) {
        setNotes({
          what_worked: res.notes.what_worked || "",
          what_didnt_work: res.notes.what_didnt_work || "",
          what_to_improve: res.notes.what_to_improve || "",
          what_is_next: res.notes.what_is_next || "",
        });
      } else {
        setNotes({ what_worked: "", what_didnt_work: "", what_to_improve: "", what_is_next: "" });
      }
    } catch (err) {
      console.error("Failed to load company summary", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchSummary(); 
  }, [year, month, weekNumber]);

  const handleNotesChange = (field, value) => {
    setNotes((prev) => ({ ...prev, [field]: value }));
  };

  // --- SAVE NOTES TO DATABASE ---
  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      const payload = {
        year,
        month,
        week_number: weekNumber,
        ...notes,
      };
      const response = await apiService.saveCompanySummaryNotes(payload);
      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: response.message || "Weekly summary notes saved successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to save notes", err);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err.response?.data?.message || "Failed to save notes.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // --- Export PDF ---
  const handleExportPdf = async () => {
    const node = templateRef.current;
    if (!node) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height], compress: true });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`Company_Summary_Week_${weekNumber}_M${month}_${year}.pdf`);
    } catch (err) {
      console.error("PDF export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  // --- Send to Telegram ---
  const handleSendToTelegram = async () => {
    const node = templateRef.current;
    if (!node) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(node, { scale: 1.5, useCORS: true, backgroundColor: "#ffffff" });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const formData = new FormData();
        formData.append("image", blob, "company_summary.png");
        formData.append("week_number", Number(weekNumber));
        formData.append("month", Number(month));
        formData.append("year", Number(year));
        const ordinalWeek = weekNumber === 1 ? '1st' : weekNumber === 2 ? '2nd' : weekNumber === 3 ? '3rd' : '4th';
        formData.append("caption", `${ordinalWeek} weekly action plan summary report`);
        const response = await apiService.sendWeeklyImagesToTelegram(formData);
        alert(response.message || "Sent successfully to Telegram!");
      }, "image/jpeg", 0.9);
    } catch (err) {
      console.error("Telegram send failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  const summary = data?.summary;
  const members = data?.members || [];

  return (
    <div className="p-6 w-full mx-auto space-y-6 bg-white min-h-screen">
      {/* Header & Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            Company Performance Summary
          </h1>
          <p className="text-xs text-gray-500">
            Aggregated team deliverables across all active trainers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Year</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="h-9 px-2.5 text-xs border border-gray-300 rounded-md bg-white"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Month</span>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="h-9 px-2.5 text-xs border border-gray-300 rounded-md bg-white"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Week</span>
            <select
              value={weekNumber}
              onChange={(e) => setWeekNumber(Number(e.target.value))}
              className="h-9 px-2.5 text-xs border border-gray-300 rounded-md bg-white"
            >
              {[1, 2, 3, 4, 5].map((w) => (
                <option key={w} value={w}>Week {w}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={fetchSummary} className="h-9 text-xs">
              🔄 Refresh
            </Button>
            {/* 💡 Hidden during print/export with print:hidden */}
            <Button 
              onClick={handleSaveNotes} 
              disabled={isSaving || loading} 
              className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white print:hidden"
            >
              {isSaving ? "Saving..." : "💾 Save Notes"}
            </Button>
            <Button onClick={handleExportPdf} disabled={isExporting || loading} className="h-9 text-xs bg-blue-600 hover:bg-blue-700 text-white">
              Download PDF
            </Button>
            <Button onClick={handleSendToTelegram} disabled={isExporting || loading} className="h-9 text-xs bg-sky-500 hover:bg-sky-600 text-white">
              Send to Telegram
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <Card className="p-12 flex flex-col items-center justify-center gap-3 text-gray-400 text-xs">
          <RingLoader color="#22d3ee" size={40} />
          <span className="font-medium">Loading summary report...</span>
        </Card>
      ) : !summary ? (
        <Card className="p-12 text-center text-gray-400 text-xs">
          No records found for this timeframe.
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Executive Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 print:hidden">
            <Card className="p-4 bg-white border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Total Trainings
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-blue-600">
                  {summary.actuals.training}
                </span>
                <span className="text-xs text-gray-400">
                  / {summary.targets.training} target
                </span>
              </div>
            </Card>

            <Card className="p-4 bg-white border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Onboarding Success
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-emerald-600">
                  {summary.actuals.onboarding}
                </span>
                <span className="text-xs text-gray-400">
                  / {summary.targets.onboarding} target
                </span>
              </div>
            </Card>

            <Card className="p-4 bg-white border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Graduations
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-purple-600">
                  {summary.actuals.graduated}
                </span>
                <span className="text-xs text-gray-400">
                  / {summary.targets.graduated} target
                </span>
              </div>
            </Card>

            <Card className="p-4 bg-white border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Delays / Cancellations
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-rose-500">
                  {summary.actuals.delays_cancels}
                </span>
                <span className="text-xs text-gray-400">incidents</span>
              </div>
            </Card>
          </div>

          {/* ========================================================= */}
          {/* 📄 OFFICIAL A4 LANDSCAPE TEMPLATE RENDERED FOR EXPORT & VIEW */}
          {/* ========================================================= */}
          <CompanySummaryTemplate
            ref={templateRef}
            summaryData={data}
            year={year}
            month={month}
            weekNumber={weekNumber}
            notes={notes}
            onNotesChange={handleNotesChange}
          />

          {/* Member Contribution Breakdown Table */}
          <Card className="bg-white border border-gray-200 overflow-hidden shadow-sm print:hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Staff Contribution Breakdown (All Team Members)
              </h2>
              <span className="text-xs text-gray-400">
                {members.length} Active Plan(s)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-semibold text-gray-500 uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Trainer</th>
                    <th className="py-2.5 px-4 text-center">Training (Act / Tgt)</th>
                    <th className="py-2.5 px-4 text-center">Onboarding (Act / Tgt)</th>
                    <th className="py-2.5 px-4 text-center">Graduated (Act / Tgt)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.length > 0 ? (
                    members.map((m) => (
                      <tr key={m.user_id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-gray-800">{m.user_name}</p>
                          <p className="text-[10px] text-gray-400">{m.user_email}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-blue-600">{m.actual_training}</span> / {m.target_training}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-emerald-600">{m.actual_onboarding}</span> / {m.target_onboarding}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-purple-600">{m.actual_graduated}</span> / {m.target_graduated}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-400">
                        No team member contributions found for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};