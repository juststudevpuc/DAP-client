import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { apiService } from "../../services/api";
import { Button } from "@/components/ui/button";
import { CompanySummaryTemplate } from "../../components/CompanySummaryTemplate";

export const CompanySummaryDashboard = () => {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(9);
  const [weekNumber, setWeekNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

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
    } catch (err) {
      console.error("Failed to load company summary", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSummary(); }, [year, month, weekNumber]);

  const handleNotesChange = (field, value) => {
    setNotes((prev) => ({ ...prev, [field]: value }));
  };

  // Export PDF
  const handleExportPdf = async () => {
    const node = templateRef.current;
    if (!node) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      
      // 💡 Landscape configuration for jsPDF
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height], compress: true });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`Weekly_Action_Plan_Week_${weekNumber}.pdf`);
    } catch (err) {
      console.error("PDF export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Send to Telegram
  const handleSendToTelegram = async () => {
    const node = templateRef.current;
    if (!node) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(node, { scale: 1.5, useCORS: true, backgroundColor: "#ffffff" });
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("image", blob, "company_summary.png");
        formData.append("week_number", Number(weekNumber));
        formData.append("month", Number(month));
        formData.append("year", Number(year));
        formData.append("caption", `${weekNumber === 1 ? '1st' : weekNumber === 2 ? '2nd' : weekNumber === 3 ? '3rd' : '4th'} weekly action plan summary report`);
        const response = await apiService.sendWeeklyImagesToTelegram(formData);
        alert(response.message || "Sent successfully to Telegram!");
      }, "image/jpeg", 0.9);
    } catch (err) {
      console.error("Telegram send failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Top Toolbar */}
      <div className="p-4 border-b border-gray-200 bg-white flex flex-wrap items-center justify-between gap-4 print:hidden">
        <h1 className="text-sm font-bold text-gray-900">Company Summary Template View</h1>
        <div className="flex items-center gap-3">
          {/* year, month, week selects & export buttons */}
          <Button onClick={handleExportPdf} className="bg-blue-600 text-white text-xs">Download PDF</Button>
          <Button onClick={handleSendToTelegram} className="bg-sky-500 text-white text-xs">Send to Telegram</Button>
        </div>
      </div>

      {/* Full Screen Template Render */}
      <CompanySummaryTemplate
        ref={templateRef}
        summaryData={data}
        year={year}
        month={month}
        weekNumber={weekNumber}
        notes={notes}
        onNotesChange={handleNotesChange}
      />
    </div>
  );
};