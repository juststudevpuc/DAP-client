import { useState } from "react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { RingLoader } from "react-spinners";

export const SendWeeklyModal = ({ isOpen, onClose, onSend }) => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(9); // Default to September (9)
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const getMonthName = (monthNum) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNum - 1] || "September";
  };

  const getOrdinalSuffix = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  // 💡 Step definitions for the weekly spotlight sequence
  const STEPS = [
    {
      icon: "🎨",
      title: "Verifying Styles...",
      desc: "Checking template fonts and layout styling before capture",
    },
    {
      icon: "📤",
      title: "Sending to Telegram...",
      desc: "Uploading fully-styled weekly snapshot to your channel",
    },
  ];

  // 💡 Builds the spotlight card HTML for a given step index (0 or 1)
  const renderSpotlight = (stepIndex) => {
    const step = STEPS[stepIndex];
    const progressPct = ((stepIndex + 1) / STEPS.length) * 100;

    const dots = STEPS.map((_, i) => {
      const state =
        i < stepIndex ? "done" : i === stepIndex ? "active" : "upcoming";
      const dotClass =
        state === "done"
          ? "bg-blue-600"
          : state === "active"
          ? "bg-blue-600 scale-125 ring-4 ring-blue-100"
          : "bg-gray-200";
      return `<span class="inline-block w-2 h-2 rounded-full transition-all duration-500 ${dotClass}"></span>`;
    }).join('<span class="w-5 h-0.5 bg-gray-200 mx-1.5 rounded-full overflow-hidden"><span class="block h-full bg-blue-600 rounded-full transition-all duration-500" style="width: ' + (stepIndex > 0 ? "100%" : "0%") + '"></span></span>');

    return `
      <div class="flex flex-col items-center text-center px-2 pt-3 pb-1 animate-in fade-in slide-in-from-bottom-1 duration-300">
        <div class="relative flex items-center justify-center w-20 h-20 mb-4">
          <span class="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-sky-50 animate-ping opacity-60"></span>
          <span class="absolute inset-2 rounded-full bg-gradient-to-br from-blue-50 to-white shadow-inner"></span>
          <span class="absolute inset-0 rounded-full border-2 border-blue-200 animate-spin [animation-duration:3s] [border-top-color:transparent] [border-right-color:transparent]"></span>
          <span class="relative text-3xl drop-shadow-sm animate-in zoom-in-50 duration-300">${step.icon}</span>
        </div>

        <div class="flex items-center justify-center mb-3.5">${dots}</div>

        <div class="text-gray-900 font-bold text-[15px] tracking-tight">${step.title}</div>
        <div class="text-xs text-gray-500 mt-1.5 max-w-[230px] leading-relaxed">${step.desc}</div>

        <div class="w-full h-1.5 bg-gray-100 rounded-full mt-5 overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            style="width: ${progressPct}%"
          >
            <span class="absolute inset-0 bg-white/30 animate-pulse"></span>
          </div>
        </div>

        <div class="text-[10px] text-gray-400 font-medium mt-2 tabular-nums">
          Step ${stepIndex + 1} of ${STEPS.length}
        </div>
      </div>
    `;
  };

  const handleConfirmSend = async () => {
    setLoading(true);

    // ⚠️ No onClose() here — the week/month picker modal stays mounted
    // underneath. Swal's overlay already renders above it, so the spotlight
    // sequence sits on top instead of replacing it. Nothing is dismissed
    // until we KNOW the send worked.

    // 💡 Step 1: Verifying styles
    Swal.fire({
      html: renderSpotlight(0),
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: "#ffffff",
      width: 320,
      padding: "1.5rem",
      customClass: {
        popup: "rounded-2xl shadow-2xl border border-gray-100",
      },
    });

    try {
      // Hold verification step for styling paint buffer
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 💡 Step 2: Sending to Telegram
      Swal.update({
        html: renderSpotlight(1),
      });

      const monthName = getMonthName(Number(selectedMonth));
      const ordinalWeek = getOrdinalSuffix(Number(selectedWeek));
      const customCaption = `${ordinalWeek} weekly action plan in ${monthName}`;

      const result = await onSend({
        week_number: Number(selectedWeek),
        month: Number(selectedMonth),
        caption: customCaption,
      });

      // Some onSend implementations resolve normally but report failure in
      // the payload instead of throwing — treat that the same as a thrown
      // error so we don't close on a false success.
      if (result && result.success === false) {
        throw new Error(result.message || "Telegram did not confirm delivery.");
      }

      // ✅ Confirmed success — show the checkmark, then close everything.
      await Swal.fire({
        icon: "success",
        title: "Sent Successfully!",
        text: "Weekly plan sent to Telegram successfully.",
        showConfirmButton: false,
        timer: 1800,
        customClass: {
          popup: "rounded-2xl shadow-2xl border border-gray-100",
        },
      });

      onClose();
    } catch (err) {
      console.error("Failed to send weekly telegram image", err);

      // 🚫 No onClose() here either. The week/month picker stays open
      // behind the error so the user's selections aren't lost and they
      // can just retry.
      Swal.fire({
        icon: "error",
        title: "Send Failed",
        text: err.response?.data?.message || err.message || "Failed to send image to Telegram. Please try again.",
        confirmButtonColor: "#ef4444",
        customClass: {
          popup: "rounded-2xl shadow-xl border border-gray-100",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <span>📤</span> Send Weekly Plan to Telegram
          </h3>
          <button 
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold px-2 py-1 rounded-lg disabled:opacity-40"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Week Selection */}
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Select Week Number
            </label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            >
              <option value={1}>(1st) Week 1</option>
              <option value={2}>(2nd) Week 2</option>
              <option value={3}>(3rd) Week 3</option>
              <option value={4}>(4th) Week 4</option>
              <option value={5}>(5th) Week 5</option>
            </select>
          </div>

          {/* Month Selection */}
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Select Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            >
              <option value={1}>January</option>
              <option value={2}>February</option>
              <option value={3}>March</option>
              <option value={4}>April</option>
              <option value={5}>May</option>
              <option value={6}>June</option>
              <option value={7}>July</option>
              <option value={8}>August</option>
              <option value={9}>September</option>
              <option value={10}>October</option>
              <option value={11}>November</option>
              <option value={12}>December</option>
            </select>
          </div>

          {/* Preview Caption Box */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-blue-900">
            <span className="font-bold block text-[10px] text-blue-500 uppercase tracking-wider mb-0.5">
              Generated Telegram Caption Preview:
            </span>
            <span className="font-semibold text-xs">
              "{getOrdinalSuffix(Number(selectedWeek))} weekly action plan in {getMonthName(Number(selectedMonth))}"
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmSend}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <RingLoader color="#ffffff" size={16} />
                Sending...
              </>
            ) : (
              "🚀 Send to Telegram"
            )}
          </button>
        </div>

      </div>
    </div>
  );
};