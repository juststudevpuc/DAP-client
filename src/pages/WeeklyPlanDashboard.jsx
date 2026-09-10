import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";
import useAuthStore from "../store/useAuthStore";
import { apiService } from "../services/api";
import { WeeklyHeader } from "../components/weekly-plan/WeeklyHeader";
import { ActionPlanGrid } from "../components/weekly-plan/ActionPlanGrid";
import { WeeklyFooter } from "../components/weekly-plan/WeeklyFooter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// 👉 Import the new Telegram tools
import { useTelegramExport } from "../hooks/useTelegramExport";
import { TelegramConnectModal } from "../components/auth/components/telegram/TelegramConnectModal";

const PAGE_MAX_WIDTH_PX = 3508;
const PAGE_MAX_HEIGHT_PX = 2480;
const RENDER_SCALE = 3;

export const WeeklyPlanDashboard = () => {
  const [planData, setPlanData] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("current");

  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingWeeklyPng, setIsExportingWeeklyPng] = useState(false);
  const [isExportingDailyPng, setIsExportingDailyPng] = useState(false);

  // 👉 State for the Telegram dropdown menu
  const [showTelegramMenu, setShowTelegramMenu] = useState(false);
  const [pendingTelegramType, setPendingTelegramType] = useState('weekly');

  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const componentRef = useRef(null);

  // 👉 Initialize the Telegram hook
  const { 
    isSendingTelegram, 
    sendToTelegram, 
    showConnectModal, 
    setShowConnectModal 
  } = useTelegramExport();

  const isExportingAny =
    isExportingPdf || isExportingWeeklyPng || isExportingDailyPng || isSendingTelegram;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await apiService.getWeeklyPlans();
        setHistory(historyData);
      } catch (error) {
        console.error("Failed to load history", error);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const loadPlanData = async () => {
      try {
        let data;
        if (selectedPlanId === "current") {
          data = await apiService.getCurrentWeeklyPlan();
        } else {
          data = await apiService.getWeeklyPlan(selectedPlanId);
        }
        setPlanData(data);
      } catch (error) {
        console.error("Failed to load plan data", error);
      }
    };
    loadPlanData();
  }, [selectedPlanId]);

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout failed on server", error);
    } finally {
      logout();
      navigate("/login");
    }
  };

  // --- 1. NATIVE BROWSER PRINT HANDLER ---
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    content: () => componentRef.current,
    documentTitle: `Weekly_Action_Plan_${planData?.week_number || "01"}`,
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 5mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          zoom: 78%; 
        }
      }
    `,
  });

  // --- 2. HIGH-QUALITY PDF EXPORT ---
  const handleExportPdf = async () => {
    const node = componentRef.current;
    if (!node) return;

    setIsExportingPdf(true);
    try {
      const rawCanvas = await html2canvas(node, {
        scale: RENDER_SCALE,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        windowWidth: node.scrollWidth,
        windowHeight: node.scrollHeight,
      });

      const fitRatio = Math.min(
        PAGE_MAX_WIDTH_PX / rawCanvas.width,
        PAGE_MAX_HEIGHT_PX / rawCanvas.height,
        1,
      );

      const drawWidth = Math.round(rawCanvas.width * fitRatio);
      const drawHeight = Math.round(rawCanvas.height * fitRatio);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [PAGE_MAX_WIDTH_PX, PAGE_MAX_HEIGHT_PX],
        compress: true,
      });

      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, PAGE_MAX_WIDTH_PX, PAGE_MAX_HEIGHT_PX, "F");

      const imgData = rawCanvas.toDataURL("image/png");
      pdf.addImage(
        imgData,
        "PNG",
        (PAGE_MAX_WIDTH_PX - drawWidth) / 2,
        (PAGE_MAX_HEIGHT_PX - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );

      pdf.save(`Weekly_Action_Plan_${planData?.week_number || "01"}.pdf`);
    } catch (error) {
      console.error("Failed to export PDF", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  // --- 3. WEEKLY PNG (FULL PAGE) ---
  const handleExportWeeklyPng = async () => {
    const node = componentRef.current;
    if (!node) return;

    setIsExportingWeeklyPng(true);
    try {
      const rawCanvas = await html2canvas(node, {
        scale: 5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        windowWidth: node.scrollWidth,
        windowHeight: node.scrollHeight,
        logging: false, 
      });

      const imgData = rawCanvas.toDataURL("image/png", 1.0); 
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `Weekly_Action_Plan_${planData?.week_number || "01"}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to export PNG", error);
      alert("Failed to generate PNG. Please try again.");
    } finally {
      setIsExportingWeeklyPng(false);
    }
  };

  // --- 4. DAILY PNG (NO FOOTER) ---
  const handleExportDailyPng = async () => {
    const node = componentRef.current;
    if (!node) return;

    setIsExportingDailyPng(true);
    try {
      const rawCanvas = await html2canvas(node, {
        scale: RENDER_SCALE,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          const footer = clonedDoc.getElementById("weekly-footer-container");
          if (footer) {
            footer.style.display = "none";
          }
        },
      });

      const imgData = rawCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `Daily_Action_Plan_${planData?.week_number || "01"}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to export Daily PNG", error);
      alert("Failed to generate PNG. Please try again.");
    } finally {
      setIsExportingDailyPng(false);
    }
  };

  // --- 5. SEND TO TELEGRAM ---
  const handleTelegramClick = (type) => {
    setShowTelegramMenu(false); // Close dropdown
    setPendingTelegramType(type);
    sendToTelegram(componentRef, planData, type, RENDER_SCALE);
  };

  if (!planData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">
        Loading CheckinMe Dashboard...
      </div>
    );
  }

  const currentHistoryIndex = history.findIndex((p) => p?.id === planData?.id);
  const dynamicWeekNumber =
    currentHistoryIndex !== -1
      ? history.length - currentHistoryIndex
      : history.length + 1;

  return (
    <div className="min-h-[1000px] print:min-h-0 bg-gray-50 print:bg-white p-5 print:p-0">
      
      {/* 👉 Render the Telegram Connect Modal */}
      <TelegramConnectModal 
        isOpen={showConnectModal} 
        onClose={() => setShowConnectModal(false)}
        onLinked={() => {
          setShowConnectModal(false);
          handleTelegramClick(pendingTelegramType); 
        }}
      />

      <div className="max-w-[1500px] mx-auto flex justify-end gap-2 mb-3 print:hidden">
        <div className="flex items-center mr-auto print:hidden">
          <label className="text-xs font-semibold text-gray-700 mr-2">
            View Week:
          </label>
          <select
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            className="h-8 text-xs border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-2 bg-white"
          >
            <option value="current">Current Week (Active)</option>

            {history.map((plan, index) => (
              <option key={plan.id} value={plan.id}>
                Week {history.length - index} ({plan.start_date})
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          disabled={isExportingAny}
          className="h-8 text-xs text-blue-700 border-blue-600 hover:bg-blue-50 flex items-center gap-1 disabled:opacity-60"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print Web
        </Button>

        {/* 👉 Telegram Dropdown Menu */}
        <div className="relative">
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowTelegramMenu(!showTelegramMenu)}
            disabled={isExportingAny}
            className="h-8 text-xs bg-sky-500 hover:bg-sky-600 text-white flex items-center gap-1 disabled:opacity-60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .34z" />
            </svg>
            {isSendingTelegram ? "Sending..." : "Send to Telegram"}
            
            {/* Small dropdown chevron */}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showTelegramMenu ? 'rotate-180' : ''}`}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </Button>

          {/* Dropdown Options */}
          {showTelegramMenu && (
            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
              <button
                onClick={() => handleTelegramClick('daily')}
                className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition"
              >
                Send Daily Image
              </button>
              <button
                onClick={() => handleTelegramClick('weekly')}
                className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition border-t border-gray-100"
              >
                Send Weekly Image
              </button>
            </div>
          )}
        </div>

        <Button
          variant="default"
          size="sm"
          onClick={handleExportDailyPng}
          disabled={isExportingAny}
          className="h-8 text-xs bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1 disabled:opacity-60"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          {isExportingDailyPng ? "Generating..." : "Daily Image"}
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={handleExportWeeklyPng}
          disabled={isExportingAny}
          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 disabled:opacity-60"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          {isExportingWeeklyPng ? "Generating..." : "Weekly Image"}
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={handleExportPdf}
          disabled={isExportingAny}
          className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 disabled:opacity-60"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          {isExportingPdf ? "Generating..." : "Download PDF"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="h-8 text-xs text-gray-600 border-gray-300 hover:bg-gray-100"
        >
          Sign Out
        </Button>
      </div>

      <div
        ref={componentRef}
        className="bg-white mx-auto print:w-[277mm] print:overflow-hidden"
        style={{ width: "1400px", maxWidth: "100%" }}
      >
        <Card className="mx-auto p-6 bg-white shadow-sm rounded-none border-gray-300 print:shadow-none print:border-none print:p-0 print:break-inside-avoid">
          <WeeklyHeader
            planData={planData}
            dynamicWeekNumber={dynamicWeekNumber}
          />
          <ActionPlanGrid dailyMetrics={planData.daily_metrics} />

          <div id="weekly-footer-container">
            <WeeklyFooter planData={planData} />
          </div>
        </Card>
      </div>
    </div>
  );
};