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

import { useTelegramExport } from "../hooks/useTelegramExport";
import { TelegramConnectModal } from "../components/auth/components/telegram/TelegramConnectModal";
import { ManageWeeksModal } from "../components/weekly-plan/ManageWeeksModal";
import { SendDailyModal } from "../components/SendDailyModal";

const PAGE_MAX_WIDTH_PX = 3508;
const PAGE_MAX_HEIGHT_PX = 2480;
const RENDER_SCALE = 3;

export const WeeklyPlanDashboard = () => {
  const [planData, setPlanData] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoadingWeek, setIsLoadingWeek] = useState(false);

  // Initialize from localStorage so refresh preserves user position
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");

  const [filterYear, setFilterYear] = useState(() => {
    return localStorage.getItem("checkinme_filter_year") || currentYear;
  });

  const [filterMonth, setFilterMonth] = useState(() => {
    return localStorage.getItem("checkinme_filter_month") || currentMonth;
  });

  const [selectedWeek, setSelectedWeek] = useState(() => {
    const savedWeek = localStorage.getItem("checkinme_selected_week");
    return savedWeek ? Number(savedWeek) : 1;
  });

  // Sync choices to localStorage on every change
  useEffect(() => {
    localStorage.setItem("checkinme_filter_year", filterYear);
  }, [filterYear]);

  useEffect(() => {
    localStorage.setItem("checkinme_filter_month", filterMonth);
  }, [filterMonth]);

  useEffect(() => {
    localStorage.setItem("checkinme_selected_week", String(selectedWeek));
  }, [selectedWeek]);

  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingWeeklyPng, setIsExportingWeeklyPng] = useState(false);
  const [isExportingDailyPng, setIsExportingDailyPng] = useState(false);

  const [showTelegramMenu, setShowTelegramMenu] = useState(false);
  const [pendingTelegramType, setPendingTelegramType] = useState("weekly");
  const [showManageModal, setShowManageModal] = useState(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);

  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const componentRef = useRef(null);

  const { 
    isSendingTelegram, 
    sendToTelegram, 
    showConnectModal, 
    setShowConnectModal 
  } = useTelegramExport();

  const isExportingAny =
    isExportingPdf || isExportingWeeklyPng || isExportingDailyPng || isSendingTelegram;

  // Load all plans for the Manage Weeks modal
  const fetchHistoryData = async () => {
    try {
      const response = await apiService.getWeeklyPlans();
      const historyArray = Array.isArray(response) 
        ? response 
        : (response?.data || response?.items || []);
      setHistory(historyArray);
    } catch (error) {
      console.error("Failed to load history", error);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  // Fetch or initialize the specific Year, Month, and Week (1-4)
  const loadWeekData = async (year, month, week) => {
    setIsLoadingWeek(true);
    try {
      const response = await apiService.getWeeklyPlans({
        year,
        month,
        week,
      });

      const list = Array.isArray(response) 
        ? response 
        : (response?.data || response?.items || []);

      if (list.length > 0) {
        setPlanData(list[0]);
      } else {
        // Calculate date anchor for target week slot
        const startDay = (week - 1) * 7 + 1;
        const formattedStartDate = `${year}-${month}-${String(startDay).padStart(2, "0")}`;

        // Auto-create week in database so day metrics receive permanent IDs immediately
        const created = await apiService.createWeeklyPlan({
          week_number: Number(week),
          start_date: formattedStartDate,
        });

        const newPlan = created?.data || created;
        setPlanData(newPlan);
        await fetchHistoryData();
      }
    } catch (error) {
      console.error("Failed to load or initialize week data", error);
    } finally {
      setIsLoadingWeek(false);
    }
  };

  useEffect(() => {
    loadWeekData(filterYear, filterMonth, selectedWeek);
  }, [filterYear, filterMonth, selectedWeek]);

  // Reset to default system time and Week 1
  const handleResetToDefault = () => {
    const defaultYear = new Date().getFullYear().toString();
    const defaultMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const defaultWeek = 1;

    // Clear saved selections from localStorage
    localStorage.removeItem("checkinme_filter_year");
    localStorage.removeItem("checkinme_filter_month");
    localStorage.removeItem("checkinme_selected_week");

    // Reset component states
    setFilterYear(defaultYear);
    setFilterMonth(defaultMonth);
    setSelectedWeek(defaultWeek);

    // Immediately fetch default week
    loadWeekData(defaultYear, defaultMonth, defaultWeek);
  };

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

  // --- SAVE / UPDATE HANDLER ---
  const handleSaveWeek = async (summaryPayload) => {
    if (!planData?.id) {
      alert("⚠️ Plan is still initializing. Please wait a second and try again.");
      return;
    }

    try {
      const payloadToSend = {
        ...summaryPayload,
        week_number: Number(selectedWeek),
        start_date: planData?.start_date,
        end_date: planData?.end_date,
      };

      await apiService.updateWeeklyPlan(planData.id, payloadToSend);

      alert(`✅ Week ${selectedWeek} saved to database!`);
      await fetchHistoryData();
      await loadWeekData(filterYear, filterMonth, selectedWeek);
    } catch (error) {
      console.error("Failed to save week", error);
      alert("❌ Failed to save. Check browser network tab for validation errors.");
    }
  };

  // --- 1. NATIVE BROWSER PRINT HANDLER ---
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    content: () => componentRef.current,
    documentTitle: `Weekly_Action_Plan_Week_${selectedWeek}`,
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
        1
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
        drawHeight
      );

      pdf.save(`Weekly_Action_Plan_Week_${selectedWeek}.pdf`);
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
      link.download = `Weekly_Action_Plan_Week_${selectedWeek}.png`;
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
      link.download = `Daily_Action_Plan_Week_${selectedWeek}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to export Daily PNG", error);
      alert("Failed to generate PNG. Please try again.");
    } finally {
      setIsExportingDailyPng(false);
    }
  };

  // --- 5. SEND TO TELEGRAM (WEEKLY) ---
  const handleTelegramClick = (type) => {
    setShowTelegramMenu(false);
    setPendingTelegramType(type);
    sendToTelegram(componentRef, planData, type, RENDER_SCALE);
  };

  // --- 6. SEND MULTI-SELECT DAILY IMAGE WITH DYNAMIC CAPTION TO TELEGRAM ---
  const handleSendDailyToTelegram = async (daysArray) => {
    const node = componentRef.current;
    if (!node) return;

    try {
      const rawCanvas = await html2canvas(node, {
        scale: RENDER_SCALE,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          const footer = clonedDoc.getElementById("weekly-footer-container");
          if (footer) footer.style.display = "none";
        },
      });

      rawCanvas.toBlob(async (blob) => {
        if (!blob) {
          alert("Failed to capture image snapshot.");
          return;
        }

        const formData = new FormData();
        formData.append("image", blob, "daily_plan.png");
        formData.append("week_number", Number(selectedWeek));
        formData.append("year", Number(filterYear));
        formData.append("month", Number(filterMonth));

        daysArray.forEach((day, index) => {
          formData.append(`days[${index}]`, day);
        });

        const response = await apiService.sendDailyImagesToTelegram(formData);
        alert(response.message || "Daily image sent successfully to Telegram!");
      }, "image/png", 1.0);

    } catch (err) {
      console.error("Failed to send daily image report", err);
      alert(err.response?.data?.message || "Failed to send report to Telegram.");
    }
  };

  if (!planData || isLoadingWeek) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">
        Loading CheckinMe Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-[1000px] print:min-h-0 bg-gray-50 print:bg-white p-5 print:p-0">
      {/* Telegram Connect Modal */}
      <TelegramConnectModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onLinked={() => {
          setShowConnectModal(false);
          handleTelegramClick(pendingTelegramType);
        }}
      />

      {/* Manage / Delete Weeks Modal */}
      <ManageWeeksModal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        history={history}
        onDeleted={() => {
          fetchHistoryData();
          loadWeekData(filterYear, filterMonth, selectedWeek);
        }}
      />

      {/* Send Daily Days Selection Modal */}
      <SendDailyModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
        onSend={handleSendDailyToTelegram}
      />

      <div className="max-w-[1500px] mx-auto flex flex-wrap justify-end gap-2 mb-3 print:hidden items-center">
        {/* Filters: Year, Month, Fixed 4-Week Selector, Filter Action, and Reset Button */}
        <div className="flex items-center mr-auto gap-2">
          <label className="text-xs font-semibold text-gray-700">Filter Year:</label>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="h-8 text-xs border border-gray-300 rounded-md px-2 bg-white"
          >
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>

          <label className="text-xs font-semibold text-gray-700">Month:</label>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="h-8 text-xs border border-gray-300 rounded-md px-2 bg-white"
          >
            <option value="01">01 - January</option>
            <option value="02">02 - February</option>
            <option value="03">03 - March</option>
            <option value="04">04 - April</option>
            <option value="05">05 - May</option>
            <option value="06">06 - June</option>
            <option value="07">07 - July</option>
            <option value="08">08 - August</option>
            <option value="09">09 - September</option>
            <option value="10">10 - October</option>
            <option value="11">11 - November</option>
            <option value="12">12 - December</option>
          </select>

          <label className="text-xs font-semibold text-gray-700 ml-2">View Week:</label>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
            className="h-8 text-xs border border-gray-300 rounded-md shadow-sm px-2 bg-white font-medium"
          >
            <option value={1}>Week 1</option>
            <option value={2}>Week 2</option>
            <option value={3}>Week 3</option>
            <option value={4}>Week 4</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetToDefault}
            title="Reset filters and return to current month Week 1"
            className="h-8 text-xs border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1"
          >
            🔄 Refresh
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          disabled={isExportingAny}
          className="h-8 text-xs text-blue-700 border-blue-600 hover:bg-blue-50 flex items-center gap-1"
        >
          Print Web
        </Button>

        {/* Telegram Dropdown */}
        <div className="relative">
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowTelegramMenu(!showTelegramMenu)}
            disabled={isExportingAny}
            className="h-8 text-xs bg-sky-500 hover:bg-sky-600 text-white flex items-center gap-1"
          >
            {isSendingTelegram ? "Sending..." : "Send to Telegram"}
          </Button>

          {showTelegramMenu && (
            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
              <button
                onClick={() => {
                  setShowTelegramMenu(false);
                  setIsDailyModalOpen(true);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-sky-50 transition"
              >
                Send Daily Image
              </button>
              <button
                onClick={() => handleTelegramClick("weekly")}
                className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-sky-50 transition border-t border-gray-100"
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
          className="h-8 text-xs bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isExportingDailyPng ? "Generating..." : "Daily Image"}
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={handleExportWeeklyPng}
          disabled={isExportingAny}
          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isExportingWeeklyPng ? "Generating..." : "Weekly Image"}
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={handleExportPdf}
          disabled={isExportingAny}
          className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isExportingPdf ? "Generating..." : "Download PDF"}
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
            currentWeekNumber={selectedWeek}
          />
          <ActionPlanGrid dailyMetrics={planData.daily_metrics} />

          <div id="weekly-footer-container">
            <WeeklyFooter 
              planData={planData} 
              onComplete={handleSaveWeek} 
              currentWeekNumber={selectedWeek}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};